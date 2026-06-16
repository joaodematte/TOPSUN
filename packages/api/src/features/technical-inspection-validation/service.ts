import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getTechnicalInspectionValidationStatusThresholds,
  listTechnicalInspectionValidationProjects,
  upsertTechnicalInspectionValidationStatusThresholds,
} from "./repository";

export function getProjects() {
  return listTechnicalInspectionValidationProjects();
}

export function getStatusThresholds() {
  return getTechnicalInspectionValidationStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertTechnicalInspectionValidationStatusThresholds(input);
}
