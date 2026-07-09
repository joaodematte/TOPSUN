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

export type VerifyApproveRequestAccessReportRow = Extract<
  AutomationRunReport,
  { kind: "verify_approve_request_access" }
>["rows"][number];

export type VerifyInspectionRequestReportRow = Extract<
  AutomationRunReport,
  { kind: "verify_inspection_request" }
>["rows"][number];

export type AutomationRunReportRow =
  | RequestProtocolReportRow
  | ValidateProtocolReturnReportRow
  | VerifyApproveRequestAccessReportRow
  | VerifyInspectionRequestReportRow;

export type AutomationRunReportLogEntry = AutomationRunReport["logs"][number];
