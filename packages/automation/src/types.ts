export type AutomationLogLevel = "error" | "step" | "success";

export interface AutomationProgressEvent {
  level: AutomationLogLevel;
  message: string;
  step?: string;
}

export interface AutomationRunStats {
  failed: number;
  skipped: number;
  succeeded: number;
}

export interface AutomationRunOptions {
  headless?: boolean;
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>;
  outputDir: string;
}

export interface AutomationRunResult {
  errorMessage?: string;
  reportPaths: string[];
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

export function countProtocolResults(
  results: { status: "ERRORED" | "SKIPPED" | "SUCCEEDED" }[]
): AutomationRunStats {
  // oxlint-disable-next-line unicorn/no-array-reduce
  return results.reduce<AutomationRunStats>(
    (stats, result) => {
      if (result.status === "SUCCEEDED") {
        stats.succeeded += 1;
      } else if (result.status === "SKIPPED") {
        stats.skipped += 1;
      } else {
        stats.failed += 1;
      }

      return stats;
    },
    { failed: 0, skipped: 0, succeeded: 0 }
  );
}
