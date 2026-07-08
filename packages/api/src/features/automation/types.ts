import type {
  AutomationResultSystemStatus,
  AutomationRunStatsRecord,
  ValidateProtocolReturnResultStatus,
  VerifyApproveRequestAccessResultStatus,
} from "@topsun/db/schema/postgres";

export type AutomationRunDisplayStatus =
  | "error"
  | "running"
  | "success"
  | "with_divergences";

export interface AutomationRunHistoryItem {
  errorMessage: string | null;
  finishedAt: string | null;
  id: string;
  startedAt: string;
  startedByName: string | null;
  stats: AutomationRunStatsRecord | null;
  status: AutomationRunDisplayStatus;
}

export interface RequestProtocolReportRow {
  atualizadoNoSistemaTopsun: AutomationResultSystemStatus;
  cliente: string | null;
  projeto: number;
  solicitadoNaCelesc: AutomationResultSystemStatus;
}

export interface ValidateProtocolReturnReportRow {
  cliente: string | null;
  email_date: string | null;
  error_message: string | null;
  projeto: number;
  protocol_number: string | null;
  status: ValidateProtocolReturnResultStatus;
}

export interface AutomationRunReportLogEntry {
  id: string;
  level: "error" | "info" | "step" | "success";
  message: string;
  timestamp: string;
}

interface AutomationRunReportBase {
  errorMessage: string | null;
  finishedAt: string | null;
  id: string;
  logs: AutomationRunReportLogEntry[];
  startedAt: string;
  status: AutomationRunDisplayStatus;
}

export interface RequestProtocolRunReport extends AutomationRunReportBase {
  kind: "request_protocol";
  rows: RequestProtocolReportRow[];
}

export interface ValidateProtocolReturnRunReport extends AutomationRunReportBase {
  kind: "validate_protocol_return";
  rows: ValidateProtocolReturnReportRow[];
}

export interface VerifyApproveRequestAccessReportRow {
  cliente: string | null;
  error_message: string | null;
  latest_rejection_reasons: string | null;
  latest_step_date: string | null;
  latest_step_message: string | null;
  latest_step_status: string | null;
  projeto: number;
  protocol_number: string | null;
  solicitante: string | null;
  status: VerifyApproveRequestAccessResultStatus;
}

export interface VerifyApproveRequestAccessRunReport extends AutomationRunReportBase {
  kind: "verify_approve_request_access";
  rows: VerifyApproveRequestAccessReportRow[];
}

export type AutomationRunReport =
  | RequestProtocolRunReport
  | ValidateProtocolReturnRunReport
  | VerifyApproveRequestAccessRunReport;

export type AutomationRunReportRow =
  | RequestProtocolReportRow
  | ValidateProtocolReturnReportRow
  | VerifyApproveRequestAccessReportRow;
