CREATE TYPE "public"."kind" AS ENUM('request_protocol', 'validate_protocol_return');
--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('in_progress', 'completed', 'failed');
--> statement-breakpoint
CREATE TYPE "public"."automation_log_level" AS ENUM(
  'info',
  'success',
  'error',
  'step'
);
--> statement-breakpoint
CREATE TABLE "automation" (
  "id" uuid PRIMARY KEY NOT NULL,
  "kind" "kind" NOT NULL,
  "status" "status" DEFAULT 'in_progress' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "finished_at" timestamp with time zone,
  "error_message" text,
  "stats" jsonb,
  "current_step" text
);
--> statement-breakpoint
CREATE TABLE "automation_log" (
  "id" uuid PRIMARY KEY NOT NULL,
  "automation_id" uuid NOT NULL,
  "level" "automation_log_level" NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "automation_log"
ADD CONSTRAINT "automation_log_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;
