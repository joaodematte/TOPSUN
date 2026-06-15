import { statusThresholdsSchema } from "../shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";

export const artAccessRequirementStatusThresholdsSchema =
  statusThresholdsSchema;

export type ArtAccessRequirementStatusThresholdsInput = StatusThresholdsInput;
