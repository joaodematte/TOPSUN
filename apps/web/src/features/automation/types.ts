import type { RouterOutputs } from "@topsun/api";

export type AutomationRunHistoryItem =
  RouterOutputs["automation"]["getHistory"][number];

export type AutomationRunDisplayStatus = AutomationRunHistoryItem["status"];

export type AutomationRunReport = RouterOutputs["automation"]["getRunReport"];

export type RequestProtocolReportRow = Extract<
  AutomationRunReport,
  { kind: "request_protocol" }
>["rows"][number];

export type ValidateProtocolReturnReportRow = Extract<
  AutomationRunReport,
  { kind: "validate_protocol_return" }
>["rows"][number];

export type AutomationRunReportRow =
  | RequestProtocolReportRow
  | ValidateProtocolReturnReportRow;

export type AutomationRunReportLogEntry = AutomationRunReport["logs"][number];
