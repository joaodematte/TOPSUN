import { postgresDb } from "@topsun/db";
import { automation, automationLog } from "@topsun/db/schema/postgres";
import type {
  AutomationKind,
  AutomationLogLevel,
  AutomationRunResultTables,
  AutomationRunStatsRecord,
} from "@topsun/db/schema/postgres";
import { and, asc, desc, eq, isNotNull, ne } from "drizzle-orm";

export function createAutomationRun(kind: AutomationKind) {
  return postgresDb
    .insert(automation)
    .values({ kind, status: "in_progress" })
    .returning();
}

export async function getActiveAutomationRun(kind: AutomationKind) {
  const [run] = await postgresDb
    .select()
    .from(automation)
    .where(and(eq(automation.kind, kind), eq(automation.status, "in_progress")))
    .orderBy(desc(automation.startedAt))
    .limit(1);

  return run;
}

export async function getLatestFinishedAutomationRun(kind: AutomationKind) {
  const [run] = await postgresDb
    .select()
    .from(automation)
    .where(
      and(
        eq(automation.kind, kind),
        ne(automation.status, "in_progress"),
        isNotNull(automation.stats)
      )
    )
    .orderBy(desc(automation.finishedAt))
    .limit(1);

  return run;
}

export async function getLatestAutomationRun(kind: AutomationKind) {
  const [run] = await postgresDb
    .select()
    .from(automation)
    .where(eq(automation.kind, kind))
    .orderBy(desc(automation.startedAt))
    .limit(1);

  return run;
}

export function updateAutomationRun(
  id: string,
  values: {
    currentStep?: string | null;
    errorMessage?: string | null;
    finishedAt?: Date;
    resultTables?: AutomationRunResultTables;
    stats?: AutomationRunStatsRecord;
    status?: "completed" | "failed" | "in_progress";
  }
) {
  return postgresDb
    .update(automation)
    .set(values)
    .where(eq(automation.id, id))
    .returning();
}

export function appendAutomationLog(
  automationId: string,
  level: AutomationLogLevel,
  message: string
) {
  return postgresDb
    .insert(automationLog)
    .values({ automationId, level, message })
    .returning();
}

export function listAutomationLogs(automationId: string) {
  return postgresDb
    .select()
    .from(automationLog)
    .where(eq(automationLog.automationId, automationId))
    .orderBy(asc(automationLog.createdAt));
}
