import { launchBrowser } from "../browser/launch";
import { getTopsunConcurrency } from "../browser/topsun-session";
import { listVerifyApproveRequestAccessProjects } from "../db/queries";
import type { VerifyApproveRequestAccessProject } from "../db/queries";
import { emitProgress } from "../types";
import type { AutomationRunOptions, AutomationRunResult } from "../types";
import { authenticateOnCelesc } from "./celesc-auth";
import type { CelescAccount, CelescAuthSession } from "./celesc-auth";
import {
  extractLastProtocolNumber,
  getPortalPageInfo,
  parsePortalTimelineSteps,
} from "./celesc-portal";
import {
  buildVerifyApproveRequestAccessResultTables,
  countVerifyApproveRequestAccessStats,
} from "./result-tables";
import type { VerifyApproveRequestAccessProjectResult } from "./result-tables";
import { closeAnaliseRedeStepOnTopsun } from "./topsun";
import type { CloseAnaliseRedeStepProject } from "./topsun";

interface ProjectWithAccount extends VerifyApproveRequestAccessProject {
  account: CelescAccount;
}

const ANALISE_REDE_STEP_MESSAGE =
  "Projeto liberado com necessidade de análise de rede.";

function resolveCelescAccount(protocolo: string | null): CelescAccount | null {
  if (!protocolo) {
    return null;
  }

  const normalized = protocolo.toLowerCase();

  if (normalized.includes("luiz")) {
    return "luiz";
  }

  if (normalized.includes("gabriel")) {
    return "gabriel";
  }

  return null;
}

function classifyProjects(
  projects: VerifyApproveRequestAccessProject[]
): ProjectWithAccount[] {
  return projects.flatMap((project) => {
    const account = resolveCelescAccount(project.protocolo);

    if (!account) {
      return [];
    }

    return [{ ...project, account }];
  });
}

async function authenticateRequiredAccounts(
  accounts: CelescAccount[],
  onProgress: AutomationRunOptions["onProgress"]
): Promise<Map<CelescAccount, CelescAuthSession>> {
  const sessions = new Map<CelescAccount, CelescAuthSession>();

  await Promise.all(
    accounts.map(async (account) => {
      const session = await authenticateOnCelesc(account);
      sessions.set(account, session);

      await emitProgress(onProgress, {
        level: "info",
        message: `Autenticado na CELESC com conta ${account}.`,
      });
    })
  );

  return sessions;
}

async function fetchPortalInfoForProject(
  project: ProjectWithAccount,
  sessions: Map<CelescAccount, CelescAuthSession>,
  onProgress: AutomationRunOptions["onProgress"]
): Promise<VerifyApproveRequestAccessProjectResult> {
  const baseResult = {
    client: project.nomeCliente,
    projectId: project.projeto,
    protocolNumber: null as string | null,
    solicitante: project.account,
    timelineSteps: [],
  };

  const protocolNumber = extractLastProtocolNumber(project.protocolo);

  if (!protocolNumber) {
    const errorMessage = `Protocolo inválido: "${project.protocolo ?? ""}"`;

    await emitProgress(onProgress, {
      level: "error",
      message: `Protocolo inválido para projeto ${project.projeto} - ${project.nomeCliente}: "${project.protocolo ?? ""}"`,
    });

    return {
      ...baseResult,
      errorMessage,
      status: "Erro",
    };
  }

  const session = sessions.get(project.account);

  if (!session) {
    const errorMessage = `Sessão CELESC não encontrada para conta ${project.account}`;

    await emitProgress(onProgress, {
      level: "error",
      message: `Sessão CELESC não encontrada para conta ${project.account} (projeto ${project.projeto}).`,
    });

    return {
      ...baseResult,
      errorMessage,
      protocolNumber,
      status: "Erro",
    };
  }

  try {
    const portalInfo = await getPortalPageInfo({
      accessId: session.accessId,
      accessToken: session.accessToken,
      protocol: protocolNumber,
    });

    const timelineSteps = parsePortalTimelineSteps(portalInfo);

    await emitProgress(onProgress, {
      level: "success",
      message: `Portal consultado: ${project.projeto} - ${project.nomeCliente} (protocolo ${protocolNumber})`,
    });

    return {
      client: project.nomeCliente,
      projectId: project.projeto,
      protocolNumber,
      solicitante: project.account,
      status: "Sucesso",
      timelineSteps,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    await emitProgress(onProgress, {
      level: "error",
      message: `Erro ao consultar portal CELESC para projeto ${project.projeto} - ${project.nomeCliente}: ${errorMessage}`,
    });

    return {
      ...baseResult,
      errorMessage,
      protocolNumber,
      status: "Erro",
    };
  }
}

async function fetchPortalInfoForProjects(
  projects: ProjectWithAccount[],
  sessions: Map<CelescAccount, CelescAuthSession>,
  onProgress: AutomationRunOptions["onProgress"]
): Promise<VerifyApproveRequestAccessProjectResult[]> {
  if (projects.length === 0) {
    return [];
  }

  const concurrency = getTopsunConcurrency();
  const results: VerifyApproveRequestAccessProjectResult[] = [];
  let nextProjectIndex = 0;

  async function worker() {
    /* oxlint-disable no-await-in-loop -- cada worker consome a fila em sequência */
    while (nextProjectIndex < projects.length) {
      const currentIndex = nextProjectIndex;
      nextProjectIndex += 1;

      const project = projects[currentIndex];

      if (!project) {
        continue;
      }

      results[currentIndex] = await fetchPortalInfoForProject(
        project,
        sessions,
        onProgress
      );
    }
    /* oxlint-enable no-await-in-loop */
  }

  const workerCount = Math.min(concurrency, projects.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

function getProjectsEligibleForAnaliseRedeClose(
  results: VerifyApproveRequestAccessProjectResult[]
): CloseAnaliseRedeStepProject[] {
  return results.flatMap((result) => {
    if (result.status !== "Sucesso") {
      return [];
    }

    const latestStep = result.timelineSteps.at(-1);

    if (latestStep?.stepMessage.trim() !== ANALISE_REDE_STEP_MESSAGE) {
      return [];
    }

    return [
      {
        client: result.client,
        projectId: result.projectId,
        stepMessage: latestStep.stepMessage,
        stepStatusDate: latestStep.stepStatusDate,
      },
    ];
  });
}

export async function runVerifyApproveRequestAccess(
  options: AutomationRunOptions
): Promise<AutomationRunResult> {
  const { headless = true, onProgress } = options;

  try {
    await emitProgress(onProgress, {
      level: "step",
      message: "Buscando projetos elegíveis",
      step: "Buscando projetos",
    });

    const projects = await listVerifyApproveRequestAccessProjects();
    const classifiedProjects = classifyProjects(projects);

    if (classifiedProjects.length === 0) {
      await emitProgress(onProgress, {
        level: "success",
        message: "Sem projetos para verificar solicitação de acesso.",
      });

      return {
        shouldAppendCompletionLog: false,
        shouldUpdateStats: false,
        stats: { failed: 0, succeeded: 0 },
        status: "completed",
      };
    }

    await emitProgress(onProgress, {
      level: "info",
      message: `Encontrados ${classifiedProjects.length} projeto(s) para consultar na CELESC.`,
    });

    const skippedCount = projects.length - classifiedProjects.length;

    if (skippedCount > 0) {
      await emitProgress(onProgress, {
        level: "info",
        message: `${skippedCount} projeto(s) ignorado(s) por não conter luiz ou gabriel no protocolo.`,
      });
    }

    const requiredAccounts = [
      ...new Set(classifiedProjects.map((project) => project.account)),
    ];

    await emitProgress(onProgress, {
      level: "step",
      message: "Autenticando na CELESC",
      step: "CELESC",
    });

    const sessions = await authenticateRequiredAccounts(
      requiredAccounts,
      onProgress
    );

    await emitProgress(onProgress, {
      level: "step",
      message: "Consultando protocolos na CELESC",
      step: "GraphQL",
    });

    const results = await fetchPortalInfoForProjects(
      classifiedProjects,
      sessions,
      onProgress
    );

    const projectsToCloseOnTopsun =
      getProjectsEligibleForAnaliseRedeClose(results);

    if (projectsToCloseOnTopsun.length > 0) {
      await emitProgress(onProgress, {
        level: "info",
        message: `${projectsToCloseOnTopsun.length} projeto(s) elegível(is) para fechar etapa de análise de rede na Topsun.`,
      });

      await emitProgress(onProgress, {
        level: "step",
        message: `Fechando ${projectsToCloseOnTopsun.length} etapa(s) na Topsun`,
        step: "TOPSUN",
      });

      const browser = await launchBrowser({ headless });

      try {
        await closeAnaliseRedeStepOnTopsun(
          browser,
          projectsToCloseOnTopsun,
          onProgress
        );
      } finally {
        await browser.close();
      }
    }

    const resultTables = buildVerifyApproveRequestAccessResultTables(results);
    const stats = countVerifyApproveRequestAccessStats(resultTables);

    await emitProgress(onProgress, {
      level: "info",
      message: `${stats.succeeded} consulta(s) concluída(s) com sucesso, ${stats.failed} falha(s).`,
    });

    return {
      resultTables,
      stats,
      status: "completed",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido na automação";

    await emitProgress(onProgress, {
      level: "error",
      message: errorMessage,
    });

    return {
      errorMessage,
      stats: { failed: 0, succeeded: 0 },
      status: "failed",
    };
  }
}
