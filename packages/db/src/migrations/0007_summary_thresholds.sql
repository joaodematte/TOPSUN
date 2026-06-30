CREATE TYPE "public"."summary_threshold_kind" AS ENUM(
  'request_protocol',
  'inspection_approval',
  'access_request',
  'art_access_requirement',
  'utility_inspection_request',
  'installation_completion',
  'technical_inspection_validation',
  'completion_validation'
);
--> statement-breakpoint
CREATE TABLE "summary_thresholds" (
  "attention" integer NOT NULL,
  "critical" integer NOT NULL,
  "kind" "summary_threshold_kind" NOT NULL,
  "on_time" integer NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "summary_thresholds_kind_pk" PRIMARY KEY("kind"),
  CONSTRAINT "summary_thresholds_order" CHECK ("summary_thresholds"."on_time" <= "summary_thresholds"."attention" AND "summary_thresholds"."attention" <= "summary_thresholds"."critical")
);
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'request_protocol', "attention", "critical", "on_time", "updated_at"
FROM "request_protocol_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'inspection_approval', "attention", "critical", "on_time", "updated_at"
FROM "inspection_approval_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'access_request', "attention", "critical", "on_time", "updated_at"
FROM "access_request_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'art_access_requirement', "attention", "critical", "on_time", "updated_at"
FROM "art_access_requirement_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'utility_inspection_request', "attention", "critical", "on_time", "updated_at"
FROM "utility_inspection_request_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'installation_completion', "attention", "critical", "on_time", "updated_at"
FROM "installation_completion_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'technical_inspection_validation', "attention", "critical", "on_time", "updated_at"
FROM "technical_inspection_validation_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time", "updated_at")
SELECT 'completion_validation', "attention", "critical", "on_time", "updated_at"
FROM "completion_validation_status_thresholds"
LIMIT 1;
--> statement-breakpoint
INSERT INTO "summary_thresholds" ("kind", "attention", "critical", "on_time")
SELECT kind, 14, 15, 7
FROM (
  VALUES
    ('request_protocol'::"summary_threshold_kind"),
    ('inspection_approval'::"summary_threshold_kind"),
    ('access_request'::"summary_threshold_kind"),
    ('art_access_requirement'::"summary_threshold_kind"),
    ('utility_inspection_request'::"summary_threshold_kind"),
    ('installation_completion'::"summary_threshold_kind"),
    ('technical_inspection_validation'::"summary_threshold_kind"),
    ('completion_validation'::"summary_threshold_kind")
) AS defaults(kind)
WHERE NOT EXISTS (
  SELECT 1 FROM "summary_thresholds" WHERE "summary_thresholds"."kind" = defaults.kind
);
--> statement-breakpoint
DROP TABLE "request_protocol_status_thresholds";
--> statement-breakpoint
DROP TABLE "inspection_approval_status_thresholds";
--> statement-breakpoint
DROP TABLE "access_request_status_thresholds";
--> statement-breakpoint
DROP TABLE "art_access_requirement_status_thresholds";
--> statement-breakpoint
DROP TABLE "utility_inspection_request_status_thresholds";
--> statement-breakpoint
DROP TABLE "installation_completion_status_thresholds";
--> statement-breakpoint
DROP TABLE "technical_inspection_validation_status_thresholds";
--> statement-breakpoint
DROP TABLE "completion_validation_status_thresholds";
