CREATE TABLE "technical_inspection_validation_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000007'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technical_inspection_validation_status_thresholds_singleton" CHECK ("technical_inspection_validation_status_thresholds"."id" = '00000000-0000-4000-8000-000000000007'::uuid),
	CONSTRAINT "technical_inspection_validation_status_thresholds_order" CHECK ("technical_inspection_validation_status_thresholds"."on_time" <= "technical_inspection_validation_status_thresholds"."attention" AND "technical_inspection_validation_status_thresholds"."attention" <= "technical_inspection_validation_status_thresholds"."critical")
);
