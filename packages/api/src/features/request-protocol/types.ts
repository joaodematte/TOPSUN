import type { listRequestProtocolProjects } from "./repository";

export type RequestProtocolProject = Awaited<
  ReturnType<typeof listRequestProtocolProjects>
>[number];

export type { StatusThresholdsInput as RequestProtocolStatusThresholdsInput } from "../shared/status-thresholds.schema";

export type { StatusThresholds } from "../shared/status-thresholds.constants";
