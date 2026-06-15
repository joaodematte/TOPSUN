import type { listArtAccessRequirementProjects } from "./repository";

export type ArtAccessRequirementProject = Awaited<
  ReturnType<typeof listArtAccessRequirementProjects>
>[number];

export type { StatusThresholdsInput as ArtAccessRequirementStatusThresholdsInput } from "../shared/status-thresholds.schema";
