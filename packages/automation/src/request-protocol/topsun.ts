import type { Browser } from "playwright";

import {
  authenticate,
  closeContextSafely,
  getTopsunConcurrency,
  MAX_PROJECT_ATTEMPTS,
  openRequestProtocolModal,
  selectProject,
  TOPSUN_SELECTORS,
  waitForColetaFiltroToLoad,
} from "../browser/topsun-session";
import type { RequestProtocolProject as Project } from "../db/queries";
import type { AutomationProgressEvent } from "../types";
import {
  createErroredProtocolResult,
  createSucceededProtocolResult,
} from "./report";
import type { ProtocolResult } from "./report";

const DEFAULT_TIMEOUT_MS = 15_000;
const PROTOCOLO_SOLICITADO_LABEL = "PROTOCOLO SOLICITADO [R]";

function buildCurrentDateText() {
  return new Intl.DateTimeFormat("pt-BR").format(new Date());
}

function buildProtocoloSolicitadoText() {
  return `${buildCurrentDateText()} - ${PROTOCOLO_SOLICITADO_LABEL}`;
}

async function fillRequestProtocolModal(page: import("playwright").Page) {
  const dataEtapa = page.locator(TOPSUN_SELECTORS.dataEtapa);
  const observacao = page.locator(TOPSUN_SELECTORS.observacao);

  await dataEtapa.fill(buildCurrentDateText());

  const protocoloSolicitadoText = buildProtocoloSolicitadoText();
  const currentObservacao = await observacao.inputValue();

  if (currentObservacao.includes(protocoloSolicitadoText)) {
    return;
  }

  await observacao.fill(
    currentObservacao
      ? `${currentObservacao}\n${protocoloSolicitadoText}`
      : protocoloSolicitadoText
  );
}

async function saveRequestProtocolStep(page: import("playwright").Page) {
  await page.getByRole("button", { name: "Salvar Registros" }).click();
  await page.locator(TOPSUN_SELECTORS.swalConfirmButton).waitFor();
}

async function runTopsunProjectAttempt(
  browser: Browser,
  project: Project,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
): Promise<ProtocolResult> {
  let context: import("playwright").BrowserContext | undefined;
  let page: import("playwright").Page | undefined;

  try {
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);

    await authenticate(page);
    await waitForColetaFiltroToLoad(page);
    await selectProject(page, project.projeto);
    await openRequestProtocolModal(page);
    await fillRequestProtocolModal(page);
    await saveRequestProtocolStep(page);

    await onProgress?.({
      level: "success",
      message: `Protocolo registrado na Topsun: ${project.projeto} - ${project.cliente}`,
    });

    return createSucceededProtocolResult(project);
  } catch (error) {
    await onProgress?.({
      level: "error",
      message: `Erro ao registrar protocolo na Topsun: ${project.projeto} - ${project.cliente}`,
    });

    return createErroredProtocolResult(project, error);
  } finally {
    await closeContextSafely(page, context);
  }
}

async function requestProtocolOnNewTopsunProject(
  browser: Browser,
  project: Project,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>,
  attempt = 1
): Promise<ProtocolResult> {
  const result = await runTopsunProjectAttempt(browser, project, onProgress);

  if (result.status === "SUCCEEDED" || attempt >= MAX_PROJECT_ATTEMPTS) {
    return result;
  }

  return requestProtocolOnNewTopsunProject(
    browser,
    project,
    onProgress,
    attempt + 1
  );
}

async function processProjectsWithConcurrency(
  browser: Browser,
  projects: Project[],
  concurrency: number,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
) {
  const results: ProtocolResult[] = [];
  let nextProjectIndex = 0;

  async function worker() {
    while (nextProjectIndex < projects.length) {
      const currentIndex = nextProjectIndex;
      nextProjectIndex += 1;

      const project = projects[currentIndex];

      if (!project) {
        continue;
      }

      try {
        results[currentIndex] = await requestProtocolOnNewTopsunProject(
          browser,
          project,
          onProgress
        );
      } catch (error) {
        results[currentIndex] = createErroredProtocolResult(project, error);
      }
    }
  }

  const workerCount = Math.min(concurrency, projects.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

export function requestProtocolOnNewTopsun(
  browser: Browser,
  projects: Project[],
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
) {
  if (projects.length === 0) {
    return Promise.resolve([]);
  }

  const concurrency = getTopsunConcurrency();

  return processProjectsWithConcurrency(
    browser,
    projects,
    concurrency,
    onProgress
  );
}
