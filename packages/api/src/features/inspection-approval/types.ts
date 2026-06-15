import type { listInspectionApprovalProjects } from "./repository";

export type InspectionApprovalProject = Awaited<
  ReturnType<typeof listInspectionApprovalProjects>
>[number];

export type { StatusThresholdsInput as InspectionApprovalStatusThresholdsInput } from "../shared/status-thresholds.schema";

export type { StatusThresholds } from "../shared/status-thresholds.constants";
