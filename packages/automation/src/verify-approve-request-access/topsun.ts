import type { Browser, BrowserContext, Page } from "playwright";

import {
  authenticate,
  closeContextSafely,
  DEFAULT_TIMEOUT_MS,
  getTopsunConcurrency,
  MAX_PROJECT_ATTEMPTS,
  selectProject,
  TOPSUN_SELECTORS,
  waitForColetaFiltroToLoad,
} from "../browser/topsun-session";
import type { AutomationProgressEvent } from "../types";

export interface CloseAnaliseRedeStepProject {
  client: string | null;
  projectId: number;
  stepMessage: string;
  stepStatusDate: string;
}

interface CloseAnaliseRedeStepResult {
  errorMessage?: string;
  project: CloseAnaliseRedeStepProject;
  status: "ERRORED" | "SUCCEEDED";
}

async function openAnaliseRedeModal(page: Page) {
  const analiseRedeEtapa = page.locator(TOPSUN_SELECTORS.etapaAnaliseRedeText);

  await analiseRedeEtapa.waitFor();
  await analiseRedeEtapa.click();

  await page.locator(TOPSUN_SELECTORS.salvaEtapaButton).waitFor();
}

function buildTimelineObservationText(
  stepStatusDate: string,
  stepMessage: string
) {
  return `${stepStatusDate} - ${stepMessage}`;
}

async function fillAnaliseRedeModal(
  page: Page,
  stepStatusDate: string,
  stepMessage: string
) {
  const observacao = page.locator(TOPSUN_SELECTORS.obsAprovacaoEtapa);
  const timelineObservationText = buildTimelineObservationText(
    stepStatusDate,
    stepMessage
  );
  const currentObservacao = await observacao.inputValue();

  if (currentObservacao.includes(timelineObservationText)) {
    return;
  }

  await observacao.fill(
    currentObservacao
      ? `${currentObservacao}\n${timelineObservationText}`
      : timelineObservationText
  );
}

async function saveAnaliseRedeStep(page: Page) {
  await page.locator(TOPSUN_SELECTORS.salvaEtapaButton).click();
  await page.locator(TOPSUN_SELECTORS.swalConfirmButton).waitFor();
}

function createSucceededCloseAnaliseRedeResult(
  project: CloseAnaliseRedeStepProject
): CloseAnaliseRedeStepResult {
  return {
    project,
    status: "SUCCEEDED",
  };
}

function createErroredCloseAnaliseRedeResult(
  project: CloseAnaliseRedeStepProject,
  error: unknown
): CloseAnaliseRedeStepResult {
  return {
    errorMessage:
      error instanceof Error ? error.message : "Erro desconhecido na Topsun",
    project,
    status: "ERRORED",
  };
}

async function runCloseAnaliseRedeStepAttempt(
  browser: Browser,
  project: CloseAnaliseRedeStepProject,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
): Promise<CloseAnaliseRedeStepResult> {
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  try {
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);

    await authenticate(page);
    await waitForColetaFiltroToLoad(page);
    await selectProject(page, project.projectId);
    await openAnaliseRedeModal(page);
    await fillAnaliseRedeModal(
      page,
      project.stepStatusDate,
      project.stepMessage
    );
    await saveAnaliseRedeStep(page);

    await onProgress?.({
      level: "success",
      message: `Etapa de análise de rede fechada na Topsun: ${project.projectId} - ${project.client ?? ""}`,
    });

    return createSucceededCloseAnaliseRedeResult(project);
  } catch (error) {
    await onProgress?.({
      level: "error",
      message: `Erro ao fechar etapa de análise de rede na Topsun: ${project.projectId} - ${project.client ?? ""}`,
    });

    return createErroredCloseAnaliseRedeResult(project, error);
  } finally {
    await closeContextSafely(page, context);
  }
}

async function closeAnaliseRedeStepOnProject(
  browser: Browser,
  project: CloseAnaliseRedeStepProject,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>,
  attempt = 1
): Promise<CloseAnaliseRedeStepResult> {
  const result = await runCloseAnaliseRedeStepAttempt(
    browser,
    project,
    onProgress
  );

  if (result.status === "SUCCEEDED" || attempt >= MAX_PROJECT_ATTEMPTS) {
    return result;
  }

  return closeAnaliseRedeStepOnProject(
    browser,
    project,
    onProgress,
    attempt + 1
  );
}

async function processProjectsWithConcurrency(
  browser: Browser,
  projects: CloseAnaliseRedeStepProject[],
  concurrency: number,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
) {
  const results: CloseAnaliseRedeStepResult[] = [];
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
        // oxlint-disable-next-line no-await-in-loop
        results[currentIndex] = await closeAnaliseRedeStepOnProject(
          browser,
          project,
          onProgress
        );
      } catch (error) {
        results[currentIndex] = createErroredCloseAnaliseRedeResult(
          project,
          error
        );
      }
    }
  }

  const workerCount = Math.min(concurrency, projects.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

export function closeAnaliseRedeStepOnTopsun(
  browser: Browser,
  projects: CloseAnaliseRedeStepProject[],
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
