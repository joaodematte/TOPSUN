import { statusThresholdsSchema } from "../shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";

export const installationCompletionStatusThresholdsSchema =
  statusThresholdsSchema;

export type InstallationCompletionStatusThresholdsInput = StatusThresholdsInput;
