import type { listTechnicalInspectionValidationProjects } from "./repository";

export type TechnicalInspectionValidationProject = Awaited<
  ReturnType<typeof listTechnicalInspectionValidationProjects>
>[number];

export type { StatusThresholdsInput as TechnicalInspectionValidationStatusThresholdsInput } from "../shared/status-thresholds.schema";
