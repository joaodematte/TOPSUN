import type { AutomationKind } from "@topsun/db/schema/postgres";

import * as automationRepository from "./repository";
import * as automationRunner from "./runner";

export function startAutomation(kind: AutomationKind) {
  return automationRunner.startAutomationRun(kind);
}

export async function getStatus(kind: AutomationKind) {
  const activeRun = await automationRepository.getActiveAutomationRun(kind);
  const lastFinishedRun =
    await automationRepository.getLatestFinishedAutomationRun(kind);

  return {
    currentStep: activeRun?.currentStep ?? null,
    isRunning: Boolean(activeRun),
    lastExecutionAt: lastFinishedRun?.finishedAt?.toISOString() ?? null,
    lastExecutionResults: lastFinishedRun?.resultTables ?? null,
    lastExecutionStats: lastFinishedRun?.stats ?? null,
    runId: activeRun?.id ?? null,
  };
}

export function getLogs(kind: AutomationKind) {
  return automationRunner.getAutomationLogs(kind);
}
