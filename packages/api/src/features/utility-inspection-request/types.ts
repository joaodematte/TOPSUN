import type { listUtilityInspectionRequestProjects } from "./repository";

export type UtilityInspectionRequestProject = Awaited<
  ReturnType<typeof listUtilityInspectionRequestProjects>
>[number];

export type { StatusThresholdsInput as UtilityInspectionRequestStatusThresholdsInput } from "../shared/status-thresholds.schema";
