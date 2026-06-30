import { launchBrowser } from "../browser/launch";
import { listAutomationRequestProtocolProjects } from "../db/queries";
import { emitProgress } from "../types";
import type { AutomationRunOptions, AutomationRunResult } from "../types";
import { requestProtocolOnNewCelesc } from "./celesc";
import {
  buildRequestProtocolResultTables,
  countProjectLevelStats,
  createSucceededProtocolResult,
} from "./report";
import type { ProtocolResult } from "./report";
import { requestProtocolOnNewTopsun } from "./topsun";

export async function runRequestProtocol(
  options: AutomationRunOptions
): Promise<AutomationRunResult> {
  const { headless = true, onProgress } = options;

  try {
    await emitProgress(onProgress, {
      level: "step",
      message: "Buscando projetos elegíveis",
      step: "Buscando projetos",
    });

    const projects = await listAutomationRequestProtocolProjects();

    if (projects.length === 0) {
      await emitProgress(onProgress, {
        level: "success",
        message: "Sem projetos para solicitar protocolo.",
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
      message: `Encontrados ${projects.length} projetos para solicitar protocolo.`,
    });

    const browser = await launchBrowser({ headless });

    try {
      await emitProgress(onProgress, {
        level: "step",
        message: "Solicitando protocolos na CELESC",
        step: "CELESC",
      });

      const celescResults = await Promise.all(
        projects.map(async (project): Promise<ProtocolResult> => {
          const succeeded = await requestProtocolOnNewCelesc(
            browser,
            project,
            onProgress
          );

          if (succeeded) {
            return createSucceededProtocolResult(project);
          }

          return {
            errorMessage: "Erro ao solicitar protocolo na CELESC.",
            project,
            status: "ERRORED",
          };
        })
      );

      const succeededProjects = celescResults.flatMap(({ project, status }) =>
        status === "SUCCEEDED" ? [project] : []
      );

      await emitProgress(onProgress, {
        level: "success",
        message: `${succeededProjects.length} protocolo(s) solicitado(s) com sucesso na CELESC`,
      });

      await emitProgress(onProgress, {
        level: "step",
        message: `Atualizando ${succeededProjects.length} projeto(s) no TOPSUN`,
        step: "TOPSUN",
      });

      const topsunResults = await requestProtocolOnNewTopsun(
        browser,
        succeededProjects,
        onProgress
      );

      const resultTables = buildRequestProtocolResultTables(
        celescResults,
        topsunResults
      );

      const stats = countProjectLevelStats(resultTables);

      return {
        resultTables,
        stats,
        status: "completed",
      };
    } finally {
      await browser.close();
    }
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
