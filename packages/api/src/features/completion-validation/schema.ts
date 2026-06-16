import { statusThresholdsSchema } from "../shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";

export const completionValidationStatusThresholdsSchema =
  statusThresholdsSchema;

export type CompletionValidationStatusThresholdsInput = StatusThresholdsInput;
