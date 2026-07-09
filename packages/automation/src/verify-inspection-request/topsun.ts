import type { Browser, BrowserContext, Page } from "playwright";

import {
  authenticate,
  closeContextSafely,
  DEFAULT_TIMEOUT_MS,
  fillDataEtapa,
  getTopsunConcurrency,
  MAX_PROJECT_ATTEMPTS,
  selectProject,
  TOPSUN_SELECTORS,
  waitForColetaFiltroToLoad,
} from "../browser/topsun-session";
import type { AutomationProgressEvent } from "../types";

export interface CloseInspectionStepProject {
  client: string | null;
  projectId: number;
  stepMessage: string;
  stepStatusDate: string;
}

interface CloseInspectionStepResult {
  errorMessage?: string;
  project: CloseInspectionStepProject;
  status: "ERRORED" | "SUCCEEDED";
}

const APPROVE_CONFIRM_WAIT_MS = 2000;

async function openInspectionModal(page: Page) {
  const inspectionEtapa = page.locator(TOPSUN_SELECTORS.etapaInspecaoText);

  await inspectionEtapa.waitFor();
  await inspectionEtapa.click();

  await page.locator(TOPSUN_SELECTORS.salvaEtapaButton).waitFor();
}

function buildTimelineObservationText(
  stepStatusDate: string,
  stepMessage: string
) {
  return `${stepStatusDate} - ${stepMessage} [R]`;
}

async function fillInspectionModal(
  page: Page,
  stepStatusDate: string,
  stepMessage: string
) {
  await fillDataEtapa(page, stepStatusDate, "dataEtapa1");

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

async function approveInspectionStep(page: Page) {
  await page.locator(TOPSUN_SELECTORS.aprovarCfgEtapaButton).click();
  await page.getByRole("button", { name: "Sim" }).click();
  await Bun.sleep(APPROVE_CONFIRM_WAIT_MS);
}

async function saveInspectionStep(page: Page) {
  await page.locator(TOPSUN_SELECTORS.salvaEtapaButton).click();
  await page.locator(TOPSUN_SELECTORS.swalConfirmButton).waitFor();
}

function createSucceededCloseInspectionResult(
  project: CloseInspectionStepProject
): CloseInspectionStepResult {
  return {
    project,
    status: "SUCCEEDED",
  };
}

function createErroredCloseInspectionResult(
  project: CloseInspectionStepProject,
  error: unknown
): CloseInspectionStepResult {
  return {
    errorMessage:
      error instanceof Error ? error.message : "Erro desconhecido na Topsun",
    project,
    status: "ERRORED",
  };
}

async function runCloseInspectionStepAttempt(
  browser: Browser,
  project: CloseInspectionStepProject,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
): Promise<CloseInspectionStepResult> {
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  try {
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);

    await authenticate(page);
    await waitForColetaFiltroToLoad(page);
    await selectProject(page, project.projectId);
    await openInspectionModal(page);
    await fillInspectionModal(
      page,
      project.stepStatusDate,
      project.stepMessage
    );
    await approveInspectionStep(page);
    await saveInspectionStep(page);

    await onProgress?.({
      level: "success",
      message: `Etapa de aprovação de vistoria fechada na Topsun: ${project.projectId} - ${project.client ?? ""}`,
    });

    return createSucceededCloseInspectionResult(project);
  } catch (error) {
    await onProgress?.({
      level: "error",
      message: `Erro ao fechar etapa de aprovação de vistoria na Topsun: ${project.projectId} - ${project.client ?? ""}`,
    });

    return createErroredCloseInspectionResult(project, error);
  } finally {
    await closeContextSafely(page, context);
  }
}

async function closeInspectionStepOnProject(
  browser: Browser,
  project: CloseInspectionStepProject,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>,
  attempt = 1
): Promise<CloseInspectionStepResult> {
  const result = await runCloseInspectionStepAttempt(
    browser,
    project,
    onProgress
  );

  if (result.status === "SUCCEEDED" || attempt >= MAX_PROJECT_ATTEMPTS) {
    return result;
  }

  return closeInspectionStepOnProject(
    browser,
    project,
    onProgress,
    attempt + 1
  );
}

async function processProjectsWithConcurrency(
  browser: Browser,
  projects: CloseInspectionStepProject[],
  concurrency: number,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
) {
  const results: CloseInspectionStepResult[] = [];
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
        results[currentIndex] = await closeInspectionStepOnProject(
          browser,
          project,
          onProgress
        );
      } catch (error) {
        results[currentIndex] = createErroredCloseInspectionResult(
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

export function closeInspectionStepOnTopsun(
  browser: Browser,
  projects: CloseInspectionStepProject[],
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
