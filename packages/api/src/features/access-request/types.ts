import type { listAccessRequestProjects } from "./repository";

export type AccessRequestProject = Awaited<
  ReturnType<typeof listAccessRequestProjects>
>[number];

export type { StatusThresholdsInput as AccessRequestStatusThresholdsInput } from "../shared/status-thresholds.schema";
