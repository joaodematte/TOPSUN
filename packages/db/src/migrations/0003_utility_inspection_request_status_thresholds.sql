CREATE TABLE "utility_inspection_request_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000005'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "utility_inspection_request_status_thresholds_singleton" CHECK ("utility_inspection_request_status_thresholds"."id" = '00000000-0000-4000-8000-000000000005'::uuid),
	CONSTRAINT "utility_inspection_request_status_thresholds_order" CHECK ("utility_inspection_request_status_thresholds"."on_time" <= "utility_inspection_request_status_thresholds"."attention" AND "utility_inspection_request_status_thresholds"."attention" <= "utility_inspection_request_status_thresholds"."critical")
);
