import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getAccessRequestStatusThresholds,
  listAccessRequestProjects,
  upsertAccessRequestStatusThresholds,
} from "./repository";

export function getProjects() {
  return listAccessRequestProjects();
}

export function getStatusThresholds() {
  return getAccessRequestStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertAccessRequestStatusThresholds(input);
}
