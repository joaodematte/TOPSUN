import type { AutomationProgressEvent } from "@topsun/automation";
import {
  runRequestProtocol,
  runValidateProtocolReturn,
  runVerifyApproveRequestAccess,
} from "@topsun/automation";
import type { AutomationKind } from "@topsun/db/schema/postgres";

import * as automationRepository from "./repository";

const PERSISTED_LOG_LEVELS = new Set(["info", "step", "success", "error"]);

async function handleProgress(runId: string, event: AutomationProgressEvent) {
  if (PERSISTED_LOG_LEVELS.has(event.level)) {
    await automationRepository.appendAutomationLog(
      runId,
      event.level,
      event.message
    );
  }

  if (event.step) {
    await automationRepository.updateAutomationRun(runId, {
      currentStep: event.step,
    });
  }
}

function executeAutomation(kind: AutomationKind, runId: string) {
  const headless = process.env.AUTOMATION_HEADLESS !== "false";
  const onProgress = (event: AutomationProgressEvent) =>
    handleProgress(runId, event);

  switch (kind) {
    case "request_protocol": {
      return runRequestProtocol({ headless, onProgress });
    }
    case "validate_protocol_return": {
      return runValidateProtocolReturn({ headless, onProgress });
    }
    case "verify_approve_request_access": {
      return runVerifyApproveRequestAccess({ headless, onProgress });
    }
    default: {
      const unhandledKind: never = kind;
      throw new Error(`Tipo de automação não suportado: ${unhandledKind}`);
    }
  }
}

export async function startAutomationRun(
  kind: AutomationKind,
  createdBy: string
) {
  const activeRun = await automationRepository.getActiveAutomationRun(kind);

  if (activeRun) {
    throw new Error("Já existe uma automação em execução para este fluxo.");
  }

  const [run] = await automationRepository.createAutomationRun(kind, createdBy);

  if (!run) {
    throw new Error("Não foi possível iniciar a automação.");
  }

  void (async () => {
    try {
      const result = await executeAutomation(kind, run.id);

      await automationRepository.updateAutomationRun(run.id, {
        currentStep: null,
        errorMessage: result.errorMessage ?? null,
        finishedAt: new Date(),
        resultTables: result.resultTables,
        ...(result.shouldUpdateStats === false ? {} : { stats: result.stats }),
        status: result.status === "completed" ? "completed" : "failed",
      });

      if (result.shouldAppendCompletionLog !== false) {
        await automationRepository.appendAutomationLog(
          run.id,
          result.status === "completed" ? "success" : "error",
          result.status === "completed"
            ? "Automação concluída."
            : (result.errorMessage ?? "Automação falhou.")
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      await automationRepository.updateAutomationRun(run.id, {
        currentStep: null,
        errorMessage,
        finishedAt: new Date(),
        status: "failed",
      });

      await automationRepository.appendAutomationLog(
        run.id,
        "error",
        errorMessage
      );
    }
  })();

  return { runId: run.id };
}

export function getAutomationStatus(kind: AutomationKind) {
  return automationRepository.getActiveAutomationRun(kind);
}

export function getLatestFinishedAutomationRun(kind: AutomationKind) {
  return automationRepository.getLatestFinishedAutomationRun(kind);
}

export async function getAutomationLogs(kind: AutomationKind) {
  const activeRun = await automationRepository.getActiveAutomationRun(kind);
  const targetRun =
    activeRun ?? (await automationRepository.getLatestAutomationRun(kind));

  if (!targetRun) {
    return [];
  }

  return automationRepository.listAutomationLogs(targetRun.id);
}
