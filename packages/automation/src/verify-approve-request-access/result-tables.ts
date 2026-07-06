import type {
  AutomationRunStatsRecord,
  VerifyApproveRequestAccessResultRow,
  VerifyApproveRequestAccessResultStatus,
  VerifyApproveRequestAccessResultTables,
  VerifyApproveRequestAccessTimelineStep,
} from "@topsun/db/schema/postgres";

export interface VerifyApproveRequestAccessProjectResult {
  client: string | null;
  errorMessage?: string;
  projectId: number;
  protocolNumber: string | null;
  solicitante: string | null;
  status: VerifyApproveRequestAccessResultStatus;
  timelineSteps: VerifyApproveRequestAccessTimelineStep[];
}

export function buildVerifyApproveRequestAccessResultTables(
  results: VerifyApproveRequestAccessProjectResult[]
): VerifyApproveRequestAccessResultTables {
  const rows: VerifyApproveRequestAccessResultRow[] = results.map((result) => ({
    client: result.client,
    errorMessage: result.errorMessage,
    projectId: result.projectId,
    protocolNumber: result.protocolNumber,
    solicitante: result.solicitante,
    status: result.status,
    timelineSteps: result.timelineSteps,
  }));

  return { rows };
}

export function countVerifyApproveRequestAccessStats(
  resultTables: VerifyApproveRequestAccessResultTables
): AutomationRunStatsRecord {
  const succeeded = resultTables.rows.filter(
    (row) => row.status === "Sucesso"
  ).length;
  const failed = resultTables.rows.length - succeeded;

  return { failed, succeeded };
}
