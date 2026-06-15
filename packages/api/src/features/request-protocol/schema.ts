import { statusThresholdsSchema } from "../shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";

export const requestProtocolStatusThresholdsSchema = statusThresholdsSchema;

export type RequestProtocolStatusThresholdsInput = StatusThresholdsInput;
