import { statusThresholdsSchema } from "../shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";

export const technicalInspectionValidationStatusThresholdsSchema =
  statusThresholdsSchema;

export type TechnicalInspectionValidationStatusThresholdsInput =
  StatusThresholdsInput;
