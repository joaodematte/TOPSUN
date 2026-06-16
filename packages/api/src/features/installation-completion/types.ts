import type { listInstallationCompletionProjects } from "./repository";

export type InstallationCompletionProject = Awaited<
  ReturnType<typeof listInstallationCompletionProjects>
>[number];

export type { StatusThresholdsInput as InstallationCompletionStatusThresholdsInput } from "../shared/status-thresholds.schema";
