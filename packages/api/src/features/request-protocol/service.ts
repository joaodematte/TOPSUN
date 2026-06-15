import type { StatusThresholdsInput } from "../shared/status-thresholds.schema";
import {
  getRequestProtocolStatusThresholds,
  listRequestProtocolProjects,
  upsertRequestProtocolStatusThresholds,
} from "./repository";

export function getProjects() {
  return listRequestProtocolProjects();
}

export function getStatusThresholds() {
  return getRequestProtocolStatusThresholds();
}

export function saveStatusThresholds(input: StatusThresholdsInput) {
  return upsertRequestProtocolStatusThresholds(input);
}
