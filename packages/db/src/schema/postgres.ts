import { sql } from "drizzle-orm";
import { check, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const PROJECT_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000001";

export const INSPECTION_APPROVAL_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000002";

export const ACCESS_REQUEST_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000003";

export const ART_ACCESS_REQUIREMENT_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000004";

export const UTILITY_INSPECTION_REQUEST_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000005";

export const INSTALLATION_COMPLETION_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000006";

export const TECHNICAL_INSPECTION_VALIDATION_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000007";

export const requestProtocolStatusThresholds = pgTable(
  "request_protocol_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000001'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "request_protocol_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000001'::uuid`
    ),
    check(
      "request_protocol_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type RequestProtocolStatusThresholds =
  typeof requestProtocolStatusThresholds.$inferSelect;

export type NewRequestProtocolStatusThresholds =
  typeof requestProtocolStatusThresholds.$inferInsert;

export const inspectionApprovalStatusThresholds = pgTable(
  "inspection_approval_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000002'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "inspection_approval_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000002'::uuid`
    ),
    check(
      "inspection_approval_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type InspectionApprovalStatusThresholds =
  typeof inspectionApprovalStatusThresholds.$inferSelect;

export type NewInspectionApprovalStatusThresholds =
  typeof inspectionApprovalStatusThresholds.$inferInsert;

export const accessRequestStatusThresholds = pgTable(
  "access_request_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000003'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "access_request_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000003'::uuid`
    ),
    check(
      "access_request_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type AccessRequestStatusThresholds =
  typeof accessRequestStatusThresholds.$inferSelect;

export type NewAccessRequestStatusThresholds =
  typeof accessRequestStatusThresholds.$inferInsert;

export const artAccessRequirementStatusThresholds = pgTable(
  "art_access_requirement_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000004'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "art_access_requirement_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000004'::uuid`
    ),
    check(
      "art_access_requirement_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type ArtAccessRequirementStatusThresholds =
  typeof artAccessRequirementStatusThresholds.$inferSelect;

export type NewArtAccessRequirementStatusThresholds =
  typeof artAccessRequirementStatusThresholds.$inferInsert;

export const utilityInspectionRequestStatusThresholds = pgTable(
  "utility_inspection_request_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000005'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "utility_inspection_request_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000005'::uuid`
    ),
    check(
      "utility_inspection_request_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type UtilityInspectionRequestStatusThresholds =
  typeof utilityInspectionRequestStatusThresholds.$inferSelect;

export type NewUtilityInspectionRequestStatusThresholds =
  typeof utilityInspectionRequestStatusThresholds.$inferInsert;

export const installationCompletionStatusThresholds = pgTable(
  "installation_completion_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000006'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "installation_completion_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000006'::uuid`
    ),
    check(
      "installation_completion_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type InstallationCompletionStatusThresholds =
  typeof installationCompletionStatusThresholds.$inferSelect;

export type NewInstallationCompletionStatusThresholds =
  typeof installationCompletionStatusThresholds.$inferInsert;

export const technicalInspectionValidationStatusThresholds = pgTable(
  "technical_inspection_validation_status_thresholds",
  {
    attention: integer("attention").notNull(),
    critical: integer("critical").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`'00000000-0000-4000-8000-000000000007'::uuid`),
    onTime: integer("on_time").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "technical_inspection_validation_status_thresholds_singleton",
      sql`${table.id} = '00000000-0000-4000-8000-000000000007'::uuid`
    ),
    check(
      "technical_inspection_validation_status_thresholds_order",
      sql`${table.onTime} <= ${table.attention} AND ${table.attention} <= ${table.critical}`
    ),
  ]
);

export type TechnicalInspectionValidationStatusThresholds =
  typeof technicalInspectionValidationStatusThresholds.$inferSelect;

export type NewTechnicalInspectionValidationStatusThresholds =
  typeof technicalInspectionValidationStatusThresholds.$inferInsert;
