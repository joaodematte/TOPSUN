import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getUtilityInspectionRequestStatusThresholds,
  listUtilityInspectionRequestProjects,
  upsertUtilityInspectionRequestStatusThresholds,
} from "./repository";

export function getProjects() {
  return listUtilityInspectionRequestProjects();
}

export function getStatusThresholds() {
  return getUtilityInspectionRequestStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertUtilityInspectionRequestStatusThresholds(input);
}
