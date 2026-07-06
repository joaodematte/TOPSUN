import type {
  AutomationKind,
  AutomationRunResultTables,
  AutomationRunStatsRecord,
  AutomationStatus,
  AutomationStoredResultTables,
} from "@topsun/db/schema/postgres";
import {
  isValidateProtocolReturnResultTables,
  isVerifyApproveRequestAccessResultTables,
} from "@topsun/db/schema/postgres";

import * as automationRepository from "./repository";
import * as automationRunner from "./runner";
import type {
  AutomationRunDisplayStatus,
  AutomationRunHistoryItem,
  AutomationRunReport,
  RequestProtocolReportRow,
  ValidateProtocolReturnReportRow,
  VerifyApproveRequestAccessReportRow,
} from "./types";

const VISIBLE_LOG_LEVELS = new Set(["info", "step", "success", "error"]);

function getRunDisplayStatus(
  status: AutomationStatus,
  stats: AutomationRunStatsRecord | null
): AutomationRunDisplayStatus {
  if (status === "in_progress") {
    return "running";
  }

  if (status === "failed") {
    return "error";
  }

  if (stats && stats.failed > 0) {
    return "with_divergences";
  }

  return "success";
}

function normalizeRequestProtocolRows(
  resultTables: AutomationRunResultTables | null | undefined
): RequestProtocolReportRow[] {
  if (!resultTables) {
    return [];
  }

  const successRows = resultTables.success.map((row) => ({
    atualizadoNoSistemaTopsun: "OK" as const,
    cliente: row.client,
    projeto: row.projectId,
    solicitadoNaCelesc: "OK" as const,
  }));

  const errorRows = resultTables.error.map((row) => ({
    atualizadoNoSistemaTopsun: row.topsunStatus,
    cliente: row.client,
    projeto: row.projectId,
    solicitadoNaCelesc: row.celescStatus,
  }));

  return [...successRows, ...errorRows];
}

function normalizeValidateProtocolReturnRows(
  resultTables: AutomationStoredResultTables | null | undefined
): ValidateProtocolReturnReportRow[] {
  if (!resultTables || !isValidateProtocolReturnResultTables(resultTables)) {
    return [];
  }

  return resultTables.rows.map((row) => ({
    cliente: row.client,
    email_date: row.emailDate ?? null,
    error_message: row.errorMessage ?? null,
    projeto: row.projectId,
    protocol_number: row.protocolNumber ?? null,
    status: row.status,
  }));
}

function normalizeOptionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed || null;
}

function normalizeVerifyApproveRequestAccessRows(
  resultTables: AutomationStoredResultTables | null | undefined
): VerifyApproveRequestAccessReportRow[] {
  if (
    !resultTables ||
    !isVerifyApproveRequestAccessResultTables(resultTables)
  ) {
    return [];
  }

  return resultTables.rows.map((row) => {
    const latestStep = row.timelineSteps.at(-1);

    return {
      cliente: row.client,
      error_message: row.errorMessage ?? null,
      latest_rejection_reasons: normalizeOptionalText(
        latestStep?.rejectionReasons
      ),
      latest_step_date: latestStep?.stepStatusDate ?? null,
      latest_step_message: latestStep?.stepMessage ?? null,
      latest_step_status: latestStep?.stepStatus ?? null,
      projeto: row.projectId,
      protocol_number: row.protocolNumber,
      solicitante: row.solicitante,
      status: row.status,
    };
  });
}

export function startAutomation(kind: AutomationKind) {
  return automationRunner.startAutomationRun(kind);
}

export async function getStatus(kind: AutomationKind) {
  const activeRun = await automationRepository.getActiveAutomationRun(kind);
  const lastFinishedRun =
    await automationRepository.getLatestFinishedAutomationRun(kind);

  return {
    currentStep: activeRun?.currentStep ?? null,
    isRunning: Boolean(activeRun),
    lastExecutionAt: lastFinishedRun?.finishedAt?.toISOString() ?? null,
    lastExecutionStats: lastFinishedRun?.stats ?? null,
    runId: activeRun?.id ?? null,
  };
}

export function getLogs(kind: AutomationKind) {
  return automationRunner.getAutomationLogs(kind);
}

export async function getHistory(
  kind: AutomationKind
): Promise<AutomationRunHistoryItem[]> {
  const runs = await automationRepository.listAutomationRuns(kind);

  return runs.map((run) => ({
    errorMessage: run.errorMessage,
    finishedAt: run.finishedAt?.toISOString() ?? null,
    id: run.id,
    startedAt: run.startedAt.toISOString(),
    stats: run.stats,
    status: getRunDisplayStatus(run.status, run.stats),
  }));
}

export async function getRunReport(
  kind: AutomationKind,
  automationId: string
): Promise<AutomationRunReport | null> {
  const run = await automationRepository.getAutomationRunById(
    kind,
    automationId
  );

  if (!run) {
    return null;
  }

  const logs = await automationRepository.listAutomationLogs(automationId);
  const baseReport = {
    errorMessage: run.errorMessage,
    finishedAt: run.finishedAt?.toISOString() ?? null,
    id: run.id,
    logs: logs
      .filter((log) => VISIBLE_LOG_LEVELS.has(log.level))
      .map((log) => ({
        id: log.id,
        level: log.level as "error" | "info" | "step" | "success",
        message: log.message,
        timestamp: log.createdAt.toISOString(),
      })),
    startedAt: run.startedAt.toISOString(),
    status: getRunDisplayStatus(run.status, run.stats),
  };

  switch (kind) {
    case "request_protocol": {
      return {
        ...baseReport,
        kind,
        rows: normalizeRequestProtocolRows(
          run.resultTables as AutomationRunResultTables | null | undefined
        ),
      };
    }
    case "validate_protocol_return": {
      return {
        ...baseReport,
        kind,
        rows: normalizeValidateProtocolReturnRows(run.resultTables),
      };
    }
    case "verify_approve_request_access": {
      return {
        ...baseReport,
        kind,
        rows: normalizeVerifyApproveRequestAccessRows(run.resultTables),
      };
    }
    default: {
      const unhandledKind: never = kind;
      throw new Error(`Tipo de automação não suportado: ${unhandledKind}`);
    }
  }
}
