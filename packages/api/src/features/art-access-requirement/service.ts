import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getArtAccessRequirementStatusThresholds,
  listArtAccessRequirementProjects,
  upsertArtAccessRequirementStatusThresholds,
} from "./repository";

export function getProjects() {
  return listArtAccessRequirementProjects();
}

export function getStatusThresholds() {
  return getArtAccessRequirementStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertArtAccessRequirementStatusThresholds(input);
}
