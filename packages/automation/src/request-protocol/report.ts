import type {
  AutomationErrorResultRow,
  AutomationResultSystemStatus,
  AutomationRunResultTables,
  AutomationRunStatsRecord,
  AutomationSuccessResultRow,
} from "@topsun/db/schema/postgres";

import type { RequestProtocolProject as Project } from "../db/queries";

export type ProtocolStatus = "ERRORED" | "SKIPPED" | "SUCCEEDED";

export interface ProtocolResult {
  errorMessage?: string;
  project: Project;
  status: ProtocolStatus;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function formatSystemStatus(
  status: ProtocolStatus
): AutomationResultSystemStatus {
  if (status === "SUCCEEDED") {
    return "OK";
  }

  if (status === "SKIPPED") {
    return "IGNORADO";
  }

  return "ERRO";
}

function getRowErrorMessage(
  celescResult: ProtocolResult,
  topsunResult: ProtocolResult | undefined
) {
  if (celescResult.status === "ERRORED") {
    return (
      celescResult.errorMessage ?? "Erro ao solicitar protocolo na CELESC."
    );
  }

  if (topsunResult?.status === "ERRORED") {
    return (
      topsunResult.errorMessage ?? "Erro ao registrar protocolo na TOPSUN."
    );
  }

  if (topsunResult?.status === "SKIPPED") {
    return (
      topsunResult.errorMessage ??
      "Não enviado ao TOPSUN porque falhou na CELESC."
    );
  }

  return;
}

function buildSuccessRow(project: Project): AutomationSuccessResultRow {
  return {
    client: project.cliente,
    projectId: project.projeto,
  };
}

function buildErrorRow(
  celescResult: ProtocolResult,
  topsunResult: ProtocolResult | undefined
): AutomationErrorResultRow {
  const row: AutomationErrorResultRow = {
    celescStatus: formatSystemStatus(celescResult.status),
    client: celescResult.project.cliente,
    projectId: celescResult.project.projeto,
    topsunStatus: formatSystemStatus(topsunResult?.status ?? "SKIPPED"),
  };

  const errorMessage = getRowErrorMessage(celescResult, topsunResult);

  if (errorMessage) {
    row.errorMessage = errorMessage;
  }

  return row;
}

export function buildRequestProtocolResultTables(
  celescResults: ProtocolResult[],
  topsunResults: ProtocolResult[]
): AutomationRunResultTables {
  const topsunResultByProjectId = new Map(
    topsunResults.map((result) => [result.project.projeto, result])
  );

  const success: AutomationSuccessResultRow[] = [];
  const error: AutomationErrorResultRow[] = [];

  for (const celescResult of celescResults) {
    const topsunResult = topsunResultByProjectId.get(
      celescResult.project.projeto
    );

    if (
      celescResult.status === "SUCCEEDED" &&
      topsunResult?.status === "SUCCEEDED"
    ) {
      success.push(buildSuccessRow(celescResult.project));
      continue;
    }

    error.push(buildErrorRow(celescResult, topsunResult));
  }

  return { error, success };
}

export function countProjectLevelStats(
  resultTables: AutomationRunResultTables
): AutomationRunStatsRecord {
  return {
    failed: resultTables.error.length,
    succeeded: resultTables.success.length,
  };
}

export function createErroredProtocolResult(
  project: Project,
  error: unknown
): ProtocolResult {
  return {
    errorMessage: getErrorMessage(error),
    project,
    status: "ERRORED",
  };
}

export function createSucceededProtocolResult(
  project: Project
): ProtocolResult {
  return {
    project,
    status: "SUCCEEDED",
  };
}
