import { postgresDb } from ".";
import {
  INSPECTION_APPROVAL_STATUS_THRESHOLDS_ID,
  inspectionApprovalStatusThresholds,
  PROJECT_STATUS_THRESHOLDS_ID,
  requestProtocolStatusThresholds,
} from "./schema/postgres";
import type {
  InspectionApprovalStatusThresholds,
  RequestProtocolStatusThresholds,
} from "./schema/postgres";

export const DEFAULT_PROJECT_STATUS_THRESHOLDS = {
  attention: 14,
  critical: 15,
  onTime: 7,
} as const satisfies Pick<
  RequestProtocolStatusThresholds,
  "attention" | "critical" | "onTime"
>;

export async function getRequestProtocolStatusThresholds(): Promise<
  Pick<RequestProtocolStatusThresholds, "attention" | "critical" | "onTime">
> {
  const [row] = await postgresDb
    .select({
      attention: requestProtocolStatusThresholds.attention,
      critical: requestProtocolStatusThresholds.critical,
      onTime: requestProtocolStatusThresholds.onTime,
    })
    .from(requestProtocolStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_PROJECT_STATUS_THRESHOLDS;
}

export async function upsertRequestProtocolStatusThresholds(
  values: Pick<
    RequestProtocolStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(requestProtocolStatusThresholds)
    .values({ id: PROJECT_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: requestProtocolStatusThresholds.id,
    })
    .returning({
      attention: requestProtocolStatusThresholds.attention,
      critical: requestProtocolStatusThresholds.critical,
      onTime: requestProtocolStatusThresholds.onTime,
    });

  return row;
}

export async function getInspectionApprovalStatusThresholds(): Promise<
  Pick<InspectionApprovalStatusThresholds, "attention" | "critical" | "onTime">
> {
  const [row] = await postgresDb
    .select({
      attention: inspectionApprovalStatusThresholds.attention,
      critical: inspectionApprovalStatusThresholds.critical,
      onTime: inspectionApprovalStatusThresholds.onTime,
    })
    .from(inspectionApprovalStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_PROJECT_STATUS_THRESHOLDS;
}

export async function upsertInspectionApprovalStatusThresholds(
  values: Pick<
    InspectionApprovalStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(inspectionApprovalStatusThresholds)
    .values({ id: INSPECTION_APPROVAL_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: inspectionApprovalStatusThresholds.id,
    })
    .returning({
      attention: inspectionApprovalStatusThresholds.attention,
      critical: inspectionApprovalStatusThresholds.critical,
      onTime: inspectionApprovalStatusThresholds.onTime,
    });

  return row;
}
