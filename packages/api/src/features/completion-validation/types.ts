import type { listCompletionValidationProjects } from "./repository";

export type CompletionValidationProject = Awaited<
  ReturnType<typeof listCompletionValidationProjects>
>[number];

export type { StatusThresholdsInput as CompletionValidationStatusThresholdsInput } from "../shared/status-thresholds.schema";
