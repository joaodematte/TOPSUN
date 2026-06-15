import { statusThresholdsSchema } from "../shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";

export const utilityInspectionRequestStatusThresholdsSchema =
  statusThresholdsSchema;

export type UtilityInspectionRequestStatusThresholdsInput =
  StatusThresholdsInput;
