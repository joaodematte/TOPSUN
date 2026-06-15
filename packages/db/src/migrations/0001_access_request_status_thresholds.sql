CREATE TABLE "access_request_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000003'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_request_status_thresholds_singleton" CHECK ("access_request_status_thresholds"."id" = '00000000-0000-4000-8000-000000000003'::uuid),
	CONSTRAINT "access_request_status_thresholds_order" CHECK ("access_request_status_thresholds"."on_time" <= "access_request_status_thresholds"."attention" AND "access_request_status_thresholds"."attention" <= "access_request_status_thresholds"."critical")
);
