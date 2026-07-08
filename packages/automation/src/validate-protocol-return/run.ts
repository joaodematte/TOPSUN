import { google } from "googleapis";
import type { Browser, BrowserContext, Page } from "playwright";

import { launchBrowser } from "../browser/launch";
import {
  authenticate,
  closeContextSafely,
  fillDataEtapa,
  getTopsunConcurrency,
  MAX_PROJECT_ATTEMPTS,
  openRequestProtocolModal,
  selectProject,
  TOPSUN_SELECTORS,
  waitForColetaFiltroToLoad,
} from "../browser/topsun-session";
import { listProtocolReturnProjectsByClientNames } from "../db/queries";
import type { AutomationRunOptions, AutomationRunResult } from "../types";
import { emitProgress } from "../types";
import {
  buildValidateProtocolReturnResultTables,
  countValidateProtocolReturnStats,
} from "./result-tables";

type ProtocoloEmail =
  | {
      nomeCliente: string;
      numeroProtocolo: string;
      status: "scraped";
    }
  | {
      status: "not_scraped";
    };

type NotOkProtocoloEmail =
  | {
      motivoDivergencia: string;
      unidadeConsumidora: string;
      status: "scraped";
    }
  | {
      status: "not_scraped";
    };

interface ScrapedProtocolEntry {
  dataEmail: string;
  nomeCliente: string;
  numeroProtocolo: string;
}

interface OpenProjectWithProtocol {
  dataRetorno: string;
  idColeta: number | null;
  nomeCliente: string | null;
  numeroProtocolo: string;
}

const DEFAULT_TIMEOUT_MS = 15_000;

const DUPLICATE_PROTOCOL_MESSAGE =
  "Mais de um e-mail de retorno para o mesmo cliente";

interface OpenProtocolProject {
  idColeta: number | null;
  nomeCliente: string | null;
}

interface ManualDivergenceProject extends OpenProtocolProject {
  dataRetorno: string;
  errorMessage: string;
  numeroProtocolo: string;
}

interface NotFoundProtocolEntry {
  dataEmail: string;
  nomeCliente: string;
  numeroProtocolo: string;
}

interface ProtocolReturnDbProject {
  bloqueadaEtapa: number | null;
  campopadraoEtapa: string | null;
  datahoraConclusaoEtapa: Date | string | null;
  idColeta: number | null;
  nomeCliente: string | null;
  statusEtapa: number | null;
}

function createGmailClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.gmail({ auth, version: "v1" });
}

function extractProtocolInfo(body: string): ProtocoloEmail {
  const match = body.match(
    /cliente\s+(?<nomeCliente>.+?)\s+indicou seu endereço de e-mail.*?protocolo\s+(?<numeroProtocolo>\d+)/u
  );

  if (!match?.groups?.nomeCliente || !match.groups.numeroProtocolo) {
    return { status: "not_scraped" };
  }

  return {
    nomeCliente: match.groups.nomeCliente.trim(),
    numeroProtocolo: match.groups.numeroProtocolo.trim(),
    status: "scraped",
  };
}

function cleanExtractedText(text: string) {
  return text
    .replaceAll(/<[^>]+>/gu, "")
    .replaceAll(/\s+/gu, " ")
    .trim();
}

function normalizeClientName(name: string) {
  return name
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replaceAll(/\s+/gu, " ")
    .trim();
}

function findProtocolEntriesForClientName(
  clientName: string | null,
  scrapedEntries: ScrapedProtocolEntry[]
) {
  if (!clientName) {
    return [];
  }

  const normalizedClientName = normalizeClientName(clientName);

  return scrapedEntries.filter((entry) => {
    const normalizedEntryName = normalizeClientName(entry.nomeCliente);

    return (
      normalizedClientName.includes(normalizedEntryName) ||
      normalizedEntryName.includes(normalizedClientName)
    );
  });
}

function findProtocolEntryForClientName(
  clientName: string | null,
  scrapedEntries: ScrapedProtocolEntry[]
) {
  return findProtocolEntriesForClientName(clientName, scrapedEntries)[0];
}

function getClientsWithMultipleProtocolEmails(
  scrapedEntries: ScrapedProtocolEntry[]
) {
  const emailCountByClient = new Map<string, number>();

  for (const entry of scrapedEntries) {
    const key = normalizeClientName(entry.nomeCliente);
    emailCountByClient.set(key, (emailCountByClient.get(key) ?? 0) + 1);
  }

  const clientsWithMultipleEmails = new Set<string>();

  for (const [clientKey, emailCount] of emailCountByClient) {
    if (emailCount > 1) {
      clientsWithMultipleEmails.add(clientKey);
    }
  }

  return clientsWithMultipleEmails;
}

function getClientsWithMultipleProjectMatches(
  allProjects: ProtocolReturnDbProject[],
  scrapedEntries: ScrapedProtocolEntry[]
) {
  const projectCountByClient = new Map<string, number>();

  for (const project of allProjects) {
    if (
      !project.nomeCliente ||
      findProtocolEntriesForClientName(project.nomeCliente, scrapedEntries)
        .length === 0
    ) {
      continue;
    }

    const key = normalizeClientName(project.nomeCliente);
    projectCountByClient.set(key, (projectCountByClient.get(key) ?? 0) + 1);
  }

  const clientsWithMultipleProjects = new Set<string>();

  for (const [clientKey, projectCount] of projectCountByClient) {
    if (projectCount > 1) {
      clientsWithMultipleProjects.add(clientKey);
    }
  }

  return clientsWithMultipleProjects;
}

function projectRequiresManualProcessing(
  clientName: string | null,
  manualClientKeys: Set<string>
) {
  if (!clientName || manualClientKeys.size === 0) {
    return false;
  }

  const normalizedClientName = normalizeClientName(clientName);

  for (const manualClientKey of manualClientKeys) {
    if (
      normalizedClientName.includes(manualClientKey) ||
      manualClientKey.includes(normalizedClientName)
    ) {
      return true;
    }
  }

  return false;
}

function buildManualProtocolNumbers(matchingEntries: ScrapedProtocolEntry[]) {
  return [
    ...new Set(matchingEntries.map((entry) => entry.numeroProtocolo)),
  ].join(" | ");
}

function buildManualEmailDates(matchingEntries: ScrapedProtocolEntry[]) {
  return [...new Set(matchingEntries.map((entry) => entry.dataEmail))].join(
    " | "
  );
}

function isOpenProtocolStage(project: ProtocolReturnDbProject) {
  return (
    project.datahoraConclusaoEtapa === null &&
    project.statusEtapa === 0 &&
    project.bloqueadaEtapa === 0
  );
}

function isProtocolAlreadyInserted(
  campopadraoEtapa: string | null,
  numeroProtocolo: string
) {
  return (campopadraoEtapa ?? "").includes(numeroProtocolo);
}

function projectNameMatchesProtocolEntry(
  projectName: string | null,
  protocolEntry: ScrapedProtocolEntry
) {
  if (!projectName) {
    return false;
  }

  const normalizedProjectName = normalizeClientName(projectName);
  const normalizedEntryName = normalizeClientName(protocolEntry.nomeCliente);

  return (
    normalizedProjectName.includes(normalizedEntryName) ||
    normalizedEntryName.includes(normalizedProjectName)
  );
}

function getNotFoundProtocolEntries(
  allProjects: ProtocolReturnDbProject[],
  scrapedEntries: ScrapedProtocolEntry[]
): NotFoundProtocolEntry[] {
  return scrapedEntries.flatMap((entry) => {
    const hasMatchingProject = allProjects.some((project) =>
      projectNameMatchesProtocolEntry(project.nomeCliente, entry)
    );

    if (hasMatchingProject) {
      return [];
    }

    return {
      dataEmail: entry.dataEmail,
      nomeCliente: entry.nomeCliente,
      numeroProtocolo: entry.numeroProtocolo,
    };
  });
}

function classifyProtocolReturnProjects(
  allProjects: ProtocolReturnDbProject[],
  scrapedEntries: ScrapedProtocolEntry[]
) {
  const alreadyInsertedProjects: OpenProjectWithProtocol[] = [];
  const openProjects: OpenProtocolProject[] = [];
  const manualDivergenceProjects: ManualDivergenceProject[] = [];
  const notFoundProtocolEntries = getNotFoundProtocolEntries(
    allProjects,
    scrapedEntries
  );
  const manualProjectIds = new Set<number>();
  const manualClientKeys = new Set([
    ...getClientsWithMultipleProtocolEmails(scrapedEntries),
    ...getClientsWithMultipleProjectMatches(allProjects, scrapedEntries),
  ]);

  for (const project of allProjects) {
    if (!project.idColeta || !project.nomeCliente) {
      continue;
    }

    const matchingEntries = findProtocolEntriesForClientName(
      project.nomeCliente,
      scrapedEntries
    );

    if (matchingEntries.length === 0) {
      continue;
    }

    if (
      projectRequiresManualProcessing(project.nomeCliente, manualClientKeys)
    ) {
      if (!manualProjectIds.has(project.idColeta)) {
        manualProjectIds.add(project.idColeta);
        manualDivergenceProjects.push({
          dataRetorno: buildManualEmailDates(matchingEntries),
          errorMessage: DUPLICATE_PROTOCOL_MESSAGE,
          idColeta: project.idColeta,
          nomeCliente: project.nomeCliente,
          numeroProtocolo: buildManualProtocolNumbers(matchingEntries),
        });
      }

      continue;
    }

    const [protocolEntry] = matchingEntries;

    if (!protocolEntry) {
      continue;
    }

    const projectWithProtocol: OpenProjectWithProtocol = {
      dataRetorno: protocolEntry.dataEmail,
      idColeta: project.idColeta,
      nomeCliente: project.nomeCliente,
      numeroProtocolo: protocolEntry.numeroProtocolo,
    };

    if (
      isProtocolAlreadyInserted(
        project.campopadraoEtapa,
        protocolEntry.numeroProtocolo
      )
    ) {
      alreadyInsertedProjects.push(projectWithProtocol);
      continue;
    }

    if (isOpenProtocolStage(project)) {
      openProjects.push({
        idColeta: project.idColeta,
        nomeCliente: project.nomeCliente,
      });
    }
  }

  const openProjectsWithProtocol = openProjects.flatMap((openProject) => {
    const protocolEntry = findProtocolEntryForClientName(
      openProject.nomeCliente,
      scrapedEntries
    );

    if (!protocolEntry) {
      return [];
    }

    return {
      ...openProject,
      dataRetorno: protocolEntry.dataEmail,
      numeroProtocolo: protocolEntry.numeroProtocolo,
    };
  });

  return {
    alreadyInsertedProjects,
    manualDivergenceProjects,
    notFoundProtocolEntries,
    openProjectsWithProtocol,
  };
}

function extractNotOkProtocolInfo(body: string): NotOkProtocoloEmail {
  const match = body.match(
    /unidade consumidora\s+(?<unidadeConsumidora>\d+)[\s\S]*?divergência\(s\):\s*(?<motivoDivergencia>[\s\S]+?)<\/span>/iu
  );

  if (!match?.groups?.unidadeConsumidora || !match.groups.motivoDivergencia) {
    return { status: "not_scraped" };
  }

  return {
    motivoDivergencia: cleanExtractedText(match.groups.motivoDivergencia),
    status: "scraped",
    unidadeConsumidora: match.groups.unidadeConsumidora.trim(),
  };
}

function getEmailBody(
  email: NonNullable<Awaited<ReturnType<typeof getEmails>>[number]>
) {
  return Buffer.from(
    email.data.payload?.body?.data ?? "",
    "base64url"
  ).toString("utf-8");
}

function getEmailDate(
  email: NonNullable<Awaited<ReturnType<typeof getEmails>>[number]>
) {
  const internalDate = Number(email.data.internalDate);

  if (!Number.isFinite(internalDate)) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR").format(new Date(internalDate));
}

async function getEmails(
  gmail: ReturnType<typeof createGmailClient>,
  query: string
) {
  const { data } = await gmail.users.messages.list({ q: query, userId: "me" });

  return Promise.all(
    (data.messages ?? []).map(({ id }) => {
      if (!id) {
        return null;
      }

      return gmail.users.messages.get({ id, userId: "me" });
    })
  );
}

async function fillRequestProtocolModal(
  page: Page,
  numeroProtocolo: string,
  dataRetorno: string
) {
  const dataValue =
    dataRetorno.trim() || new Intl.DateTimeFormat("pt-BR").format(new Date());

  await fillDataEtapa(page, dataValue, "dataEtapa2");

  const numeroProtocoloInput = page.locator(TOPSUN_SELECTORS.numeroProtocolo);
  const currentNumeroProtocolo = await numeroProtocoloInput.inputValue();

  if (currentNumeroProtocolo.includes(numeroProtocolo)) {
    return;
  }

  await numeroProtocoloInput.fill(
    currentNumeroProtocolo
      ? `${currentNumeroProtocolo} | ${numeroProtocolo}`
      : numeroProtocolo
  );
}

async function saveRequestProtocolStep(page: Page) {
  await page.getByRole("button", { name: "Salvar Registros" }).click();

  const confirmButton = page
    .locator(TOPSUN_SELECTORS.swalConfirmButton)
    .filter({ hasText: "Sim" });
  await confirmButton.waitFor();
  await confirmButton.click();

  await page.locator(TOPSUN_SELECTORS.etapaSolicitacaoProtocoloVerde).waitFor();
}

async function runCloseEtapaAttempt(
  browser: Browser,
  project: OpenProjectWithProtocol,
  onProgress?: AutomationRunOptions["onProgress"]
): Promise<boolean> {
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  if (!project.idColeta || !project.nomeCliente) {
    return false;
  }

  try {
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);

    await authenticate(page);
    await waitForColetaFiltroToLoad(page);
    await selectProject(page, project.idColeta);
    await openRequestProtocolModal(page);
    await fillRequestProtocolModal(
      page,
      project.numeroProtocolo,
      project.dataRetorno
    );
    await saveRequestProtocolStep(page);

    await onProgress?.({
      level: "success",
      message: `Etapa fechada na Topsun: ${project.idColeta} - ${project.nomeCliente}`,
    });

    return true;
  } catch {
    await onProgress?.({
      level: "error",
      message: `Erro ao fechar etapa na Topsun: ${project.idColeta} - ${project.nomeCliente}`,
    });

    return false;
  } finally {
    await closeContextSafely(page, context);
  }
}

async function closeEtapaOnTopsunWithRetry(
  browser: Browser,
  project: OpenProjectWithProtocol,
  onProgress?: AutomationRunOptions["onProgress"],
  attempt = 1
): Promise<boolean> {
  const succeeded = await runCloseEtapaAttempt(browser, project, onProgress);

  if (succeeded || attempt >= MAX_PROJECT_ATTEMPTS) {
    return succeeded;
  }

  return closeEtapaOnTopsunWithRetry(browser, project, onProgress, attempt + 1);
}

async function closeProtocolReturnsOnTopsun(
  browser: Browser,
  projects: OpenProjectWithProtocol[],
  onProgress?: AutomationRunOptions["onProgress"]
) {
  if (projects.length === 0) {
    return [];
  }

  const concurrency = getTopsunConcurrency();
  const results: boolean[] = [];
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

      try {
        results[currentIndex] = await closeEtapaOnTopsunWithRetry(
          browser,
          project,
          onProgress
        );
      } catch {
        results[currentIndex] = false;
      }
    }
    /* oxlint-enable no-await-in-loop */
  }

  const workerCount = Math.min(concurrency, projects.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

export async function runValidateProtocolReturn(
  options: AutomationRunOptions
): Promise<AutomationRunResult> {
  const { headless = true, onProgress } = options;

  try {
    await emitProgress(onProgress, {
      level: "step",
      message: "Consultando e-mails da CELESC",
      step: "Gmail",
    });

    const gmail = createGmailClient();

    const [okEmails, notOkEmails] = await Promise.all([
      getEmails(gmail, "newer_than:14d from:nao-responda@celesc.com.br"),
      getEmails(gmail, "newer_than:14d from:naoresponda@celesc.com.br"),
    ]);

    const okEmailCount = okEmails.filter(Boolean).length;
    const notOkEmailCount = notOkEmails.filter(Boolean).length;

    await emitProgress(onProgress, {
      level: "info",
      message: `Encontrados ${okEmailCount} e-mail(s) de retorno e ${notOkEmailCount} e-mail(s) de divergência.`,
    });

    const scrapedEntries: ScrapedProtocolEntry[] = [];
    const failedEmailBodies: string[] = [];
    const notOkScrapedEntries: {
      dataEmail: string;
      motivoDivergencia: string;
      unidadeConsumidora: string;
    }[] = [];

    for (const email of okEmails) {
      if (!email) {
        continue;
      }

      const body = getEmailBody(email);
      const protocolInfo = extractProtocolInfo(body);

      if (protocolInfo.status === "scraped") {
        scrapedEntries.push({
          dataEmail: getEmailDate(email),
          nomeCliente: protocolInfo.nomeCliente,
          numeroProtocolo: protocolInfo.numeroProtocolo,
        });
        continue;
      }

      failedEmailBodies.push(body);
    }

    for (const email of notOkEmails) {
      if (!email) {
        continue;
      }

      const body = getEmailBody(email);
      const protocolInfo = extractNotOkProtocolInfo(body);

      if (protocolInfo.status === "scraped") {
        notOkScrapedEntries.push({
          dataEmail: getEmailDate(email),
          motivoDivergencia: protocolInfo.motivoDivergencia,
          unidadeConsumidora: protocolInfo.unidadeConsumidora,
        });
      }
    }

    await emitProgress(onProgress, {
      level: "info",
      message: `${scrapedEntries.length} protocolo(s) extraído(s), ${notOkScrapedEntries.length} divergência(s) e ${failedEmailBodies.length} e-mail(s) não interpretado(s).`,
    });

    const allProjects = await listProtocolReturnProjectsByClientNames(
      scrapedEntries.map((entry) => entry.nomeCliente)
    );

    const {
      alreadyInsertedProjects,
      manualDivergenceProjects,
      notFoundProtocolEntries,
      openProjectsWithProtocol,
    } = classifyProtocolReturnProjects(allProjects, scrapedEntries);

    if (alreadyInsertedProjects.length > 0) {
      await emitProgress(onProgress, {
        level: "info",
        message: `${alreadyInsertedProjects.length} projeto(s) com protocolo já inserido no TOPSUN.`,
      });
    }

    if (manualDivergenceProjects.length > 0) {
      await emitProgress(onProgress, {
        level: "info",
        message: `${manualDivergenceProjects.length} projeto(s) com mais de um e-mail de retorno para o mesmo cliente.`,
      });
    }

    if (notFoundProtocolEntries.length > 0) {
      await emitProgress(onProgress, {
        level: "info",
        message: `${notFoundProtocolEntries.length} protocolo(s) sem cliente correspondente no TOPSUN.`,
      });
    }

    if (openProjectsWithProtocol.length === 0) {
      if (
        alreadyInsertedProjects.length === 0 &&
        manualDivergenceProjects.length === 0 &&
        notFoundProtocolEntries.length === 0
      ) {
        await emitProgress(onProgress, {
          level: "info",
          message:
            "Nenhum projeto com etapa aberta no TOPSUN corresponde aos protocolos retornados.",
        });

        await emitProgress(onProgress, {
          level: "success",
          message:
            "Não há nenhum protocolo retornado em que o projeto se encontra com a etapa `Solicitação de Protocolo` aberta",
        });
      }

      const resultTables = await buildValidateProtocolReturnResultTables({
        alreadyInsertedProjects,
        closeResults: [],
        manualDivergenceProjects,
        notFoundProtocolEntries,
        notOkScrapedEntries,
        openProjectsWithProtocol: [],
      });

      return {
        resultTables,
        shouldAppendCompletionLog: false,
        stats: countValidateProtocolReturnStats(resultTables),
        status: "completed",
      };
    }

    await emitProgress(onProgress, {
      level: "info",
      message: `${openProjectsWithProtocol.length} projeto(s) elegível(eis) para fechamento no TOPSUN.`,
    });

    await emitProgress(onProgress, {
      level: "step",
      message: "Fechando etapas no TOPSUN",
      step: "TOPSUN",
    });

    const browser = await launchBrowser({ headless });

    try {
      const closeResults = await closeProtocolReturnsOnTopsun(
        browser,
        openProjectsWithProtocol,
        onProgress
      );

      const succeeded = closeResults.filter(Boolean).length;
      const failed = closeResults.length - succeeded;

      await emitProgress(onProgress, {
        level: "info",
        message: `${succeeded} etapa(s) fechada(s) com sucesso, ${failed} falha(s).`,
      });

      const resultTables = await buildValidateProtocolReturnResultTables({
        alreadyInsertedProjects,
        closeResults,
        manualDivergenceProjects,
        notFoundProtocolEntries,
        notOkScrapedEntries,
        openProjectsWithProtocol,
      });

      return {
        resultTables,
        stats: countValidateProtocolReturnStats(resultTables),
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
