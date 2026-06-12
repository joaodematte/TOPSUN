import { sql } from "drizzle-orm";
import { check, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const PROJECT_STATUS_THRESHOLDS_ID =
  "00000000-0000-4000-8000-000000000001";

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
