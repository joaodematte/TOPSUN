import type {
  AutomationResultSystemStatus,
  AutomationRunStatsRecord,
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
  error_message: string | null;
  projeto: number;
  status: "Divergência" | "Erro" | "Sucesso";
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

export type AutomationRunReport =
  | RequestProtocolRunReport
  | ValidateProtocolReturnRunReport;

export type AutomationRunReportRow =
  | RequestProtocolReportRow
  | ValidateProtocolReturnReportRow;
