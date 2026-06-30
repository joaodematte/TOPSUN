import type {
  AutomationRunResultTables,
  AutomationRunStatsRecord,
} from "@topsun/db/schema/postgres";

export type AutomationLogLevel = "error" | "info" | "step" | "success";

export interface AutomationProgressEvent {
  level: AutomationLogLevel;
  message: string;
  step?: string;
}

export type AutomationRunStats = AutomationRunStatsRecord;

export interface AutomationRunOptions {
  headless?: boolean;
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>;
  outputDir?: string;
}

export interface AutomationRunResult {
  errorMessage?: string;
  resultTables?: AutomationRunResultTables;
  shouldAppendCompletionLog?: boolean;
  shouldUpdateStats?: boolean;
  stats: AutomationRunStats;
  status: "completed" | "failed";
}

export async function emitProgress(
  onProgress: AutomationRunOptions["onProgress"],
  event: AutomationProgressEvent
) {
  await onProgress?.(event);
}
