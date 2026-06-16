import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getInstallationCompletionStatusThresholds,
  listInstallationCompletionProjects,
  upsertInstallationCompletionStatusThresholds,
} from "./repository";

export function getProjects() {
  return listInstallationCompletionProjects();
}

export function getStatusThresholds() {
  return getInstallationCompletionStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertInstallationCompletionStatusThresholds(input);
}
