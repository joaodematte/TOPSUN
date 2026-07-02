import { sql } from "drizzle-orm";
import {
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const summaryThresholdKind = pgEnum("summary_threshold_kind", [
  "request_protocol",
  "inspection_approval",
  "access_request",
  "art_access_requirement",
  "utility_inspection_request",
  "installation_completion",
  "technical_inspection_validation",
  "completion_validation",
]);

export const summaryThresholds = pgTable(
  "summary_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    kind: summaryThresholdKind("kind").notNull(),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.kind] }),
    check(
      "summary_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type SummaryThresholdKind =
  (typeof summaryThresholdKind.enumValues)[number];

export type SummaryThresholds = typeof summaryThresholds.$inferSelect;

export type NewSummaryThresholds = typeof summaryThresholds.$inferInsert;

export const automationKind = pgEnum("kind", [
  "request_protocol",
  "validate_protocol_return",
]);

export const automationStatus = pgEnum("status", [
  "in_progress",
  "completed",
  "failed",
]);

export const automationLogLevel = pgEnum("automation_log_level", [
  "info",
  "success",
  "error",
  "step",
]);

export interface AutomationRunStatsRecord {
  failed: number;
  succeeded: number;
}

export type AutomationResultSystemStatus = "ERRO" | "IGNORADO" | "OK";

export interface AutomationSuccessResultRow {
  client: string | null;
  projectId: number;
}

export interface AutomationErrorResultRow {
  celescStatus: AutomationResultSystemStatus;
  client: string | null;
  errorMessage?: string;
  projectId: number;
  topsunStatus: AutomationResultSystemStatus;
}

export interface AutomationRunResultTables {
  error: AutomationErrorResultRow[];
  success: AutomationSuccessResultRow[];
}

export type ValidateProtocolReturnResultStatus =
  | "Divergência"
  | "Falha TOPSUN"
  | "Já inserido"
  | "Manual"
  | "Não encontrado"
  | "Sucesso";

export interface ValidateProtocolReturnResultRow {
  client: string | null;
  errorMessage?: string;
  projectId: number;
  protocolNumber?: string;
  status: ValidateProtocolReturnResultStatus;
}

export interface ValidateProtocolReturnResultTables {
  rows: ValidateProtocolReturnResultRow[];
}

export type AutomationStoredResultTables =
  | AutomationRunResultTables
  | ValidateProtocolReturnResultTables;

export function isValidateProtocolReturnResultTables(
  resultTables: AutomationStoredResultTables
): resultTables is ValidateProtocolReturnResultTables {
  return "rows" in resultTables;
}

export const automation = pgTable("automation", {
  currentStep: text("current_step"),
  errorMessage: text("error_message"),
  finishedAt: timestamp("finished_at", { mode: "date", withTimezone: true }),
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  kind: automationKind("kind").notNull(),
  resultTables: jsonb("result_tables").$type<AutomationStoredResultTables>(),
  startedAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  stats: jsonb("stats").$type<AutomationRunStatsRecord>(),
  status: automationStatus("status").notNull().default("in_progress"),
});

export const automationLog = pgTable("automation_log", {
  automationId: uuid("automation_id")
    .notNull()
    .references(() => automation.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  level: automationLogLevel("level").notNull(),
  message: text("message").notNull(),
});

export type AutomationKind = (typeof automationKind.enumValues)[number];
export type AutomationStatus = (typeof automationStatus.enumValues)[number];
export type AutomationLogLevel = (typeof automationLogLevel.enumValues)[number];
export type Automation = typeof automation.$inferSelect;
export type NewAutomation = typeof automation.$inferInsert;
export type AutomationLog = typeof automationLog.$inferSelect;
export type NewAutomationLog = typeof automationLog.$inferInsert;
