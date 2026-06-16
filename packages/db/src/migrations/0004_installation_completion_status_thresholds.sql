CREATE TABLE "installation_completion_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000006'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "installation_completion_status_thresholds_singleton" CHECK ("installation_completion_status_thresholds"."id" = '00000000-0000-4000-8000-000000000006'::uuid),
	CONSTRAINT "installation_completion_status_thresholds_order" CHECK ("installation_completion_status_thresholds"."on_time" <= "installation_completion_status_thresholds"."attention" AND "installation_completion_status_thresholds"."attention" <= "installation_completion_status_thresholds"."critical")
);
