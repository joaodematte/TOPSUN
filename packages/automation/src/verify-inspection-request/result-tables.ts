import type {
  AutomationRunStatsRecord,
  VerifyInspectionRequestResultRow,
  VerifyInspectionRequestResultStatus,
  VerifyInspectionRequestResultTables,
  VerifyInspectionRequestTimelineStep,
} from "@topsun/db/schema/postgres";

export interface VerifyInspectionRequestProjectResult {
  client: string | null;
  errorMessage?: string;
  inspectionStep: VerifyInspectionRequestTimelineStep | null;
  projectId: number;
  protocolNumber: string | null;
  solicitante: string | null;
  status: VerifyInspectionRequestResultStatus;
  timelineSteps: VerifyInspectionRequestTimelineStep[];
}

export function buildVerifyInspectionRequestResultTables(
  results: VerifyInspectionRequestProjectResult[]
): VerifyInspectionRequestResultTables {
  const rows: VerifyInspectionRequestResultRow[] = results.map((result) => ({
    client: result.client,
    errorMessage: result.errorMessage,
    inspectionStep: result.inspectionStep,
    projectId: result.projectId,
    protocolNumber: result.protocolNumber,
    solicitante: result.solicitante,
    status: result.status,
    timelineSteps: result.timelineSteps,
  }));

  return { rows };
}

export function countVerifyInspectionRequestStats(
  resultTables: VerifyInspectionRequestResultTables
): AutomationRunStatsRecord {
  const succeeded = resultTables.rows.filter(
    (row) => row.status === "Sucesso"
  ).length;
  const failed = resultTables.rows.length - succeeded;

  return { failed, succeeded };
}
