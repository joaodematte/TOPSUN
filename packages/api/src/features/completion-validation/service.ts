import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getCompletionValidationStatusThresholds,
  listCompletionValidationProjects,
  upsertCompletionValidationStatusThresholds,
} from "./repository";

export function getProjects() {
  return listCompletionValidationProjects();
}

export function getStatusThresholds() {
  return getCompletionValidationStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertCompletionValidationStatusThresholds(input);
}
