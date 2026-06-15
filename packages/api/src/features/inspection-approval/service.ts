import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getInspectionApprovalStatusThresholds,
  listInspectionApprovalProjects,
  upsertInspectionApprovalStatusThresholds,
} from "./repository";

export function getProjects() {
  return listInspectionApprovalProjects();
}

export function getStatusThresholds() {
  return getInspectionApprovalStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertInspectionApprovalStatusThresholds(input);
}
