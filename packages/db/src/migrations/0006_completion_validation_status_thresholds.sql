CREATE TABLE "completion_validation_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000008'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "completion_validation_status_thresholds_singleton" CHECK ("completion_validation_status_thresholds"."id" = '00000000-0000-4000-8000-000000000008'::uuid),
	CONSTRAINT "completion_validation_status_thresholds_order" CHECK ("completion_validation_status_thresholds"."on_time" <= "completion_validation_status_thresholds"."attention" AND "completion_validation_status_thresholds"."attention" <= "completion_validation_status_thresholds"."critical")
);
