import path from "node:path";

import { launchBrowser } from "../browser/launch";
import { listAutomationRequestProtocolProjects } from "../db/queries";
import { countProtocolResults, emitProgress } from "../types";
import type { AutomationRunOptions, AutomationRunResult } from "../types";
import { requestProtocolOnNewCelesc } from "./celesc";
import {
  createSucceededProtocolResult,
  createSystemProtocolReport,
} from "./report";
import type { ProtocolResult } from "./report";
import { requestProtocolOnNewTopsun } from "./topsun";

export async function runRequestProtocol(
  options: AutomationRunOptions
): Promise<AutomationRunResult> {
  const { headless = true, onProgress, outputDir } = options;
  const reportPaths: string[] = [];

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
        reportPaths,
        shouldAppendCompletionLog: false,
        shouldUpdateStats: false,
        stats: { failed: 0, skipped: 0, succeeded: 0 },
        status: "completed",
      };
    }

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

      const celescReportPath = path.join(outputDir, "celesc-report.xlsx");
      await createSystemProtocolReport({
        outputPath: celescReportPath,
        results: celescResults,
        system: "CELESC",
      });
      reportPaths.push(celescReportPath);

      const succeededProjects = celescResults.flatMap(({ project, status }) =>
        status === "SUCCEEDED" ? [project] : []
      );

      await emitProgress(onProgress, {
        level: "success",
        message: `${succeededProjects.length} protocolo(s) solicitado(s) com sucesso na CELESC`,
      });

      await emitProgress(onProgress, {
        level: "step",
        message: "Atualizando projetos no TOPSUN",
        step: "TOPSUN",
      });

      const topsunResults = await requestProtocolOnNewTopsun(
        browser,
        succeededProjects,
        onProgress
      );

      const topsunReportPath = path.join(outputDir, "topsun-report.xlsx");
      await createSystemProtocolReport({
        outputPath: topsunReportPath,
        results: topsunResults,
        system: "TOPSUN",
      });
      reportPaths.push(topsunReportPath);

      const allResults = [...celescResults, ...topsunResults];
      const stats = countProtocolResults(allResults);

      return {
        reportPaths,
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
      reportPaths,
      stats: { failed: 0, skipped: 0, succeeded: 0 },
      status: "failed",
    };
  }
}
