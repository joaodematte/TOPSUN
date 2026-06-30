import { postgresDb } from "@topsun/db";
import { summaryThresholds } from "@topsun/db/schema/postgres";
import type { SummaryThresholdKind } from "@topsun/db/schema/postgres";
import { eq } from "drizzle-orm";

import { DEFAULT_STATUS_THRESHOLDS } from "./status-thresholds.constants";
import type { StatusThresholds } from "./status-thresholds.constants";

export async function getStatusThresholdsByKind(
  kind: SummaryThresholdKind
): Promise<StatusThresholds> {
  const [row] = await postgresDb
    .select({
      attention: summaryThresholds.attention,
      critical: summaryThresholds.critical,
      onTime: summaryThresholds.onTime,
    })
    .from(summaryThresholds)
    .where(eq(summaryThresholds.kind, kind))
    .limit(1);

  return row ?? DEFAULT_STATUS_THRESHOLDS;
}

export async function upsertStatusThresholdsByKind(
  kind: SummaryThresholdKind,
  values: StatusThresholds
) {
  const [row] = await postgresDb
    .insert(summaryThresholds)
    .values({ kind, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: summaryThresholds.kind,
    })
    .returning({
      attention: summaryThresholds.attention,
      critical: summaryThresholds.critical,
      onTime: summaryThresholds.onTime,
    });

  return row;
}
