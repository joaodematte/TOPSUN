CREATE TABLE "inspection_approval_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000002'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inspection_approval_status_thresholds_singleton" CHECK ("inspection_approval_status_thresholds"."id" = '00000000-0000-4000-8000-000000000002'::uuid),
	CONSTRAINT "inspection_approval_status_thresholds_order" CHECK ("inspection_approval_status_thresholds"."on_time" <= "inspection_approval_status_thresholds"."attention" AND "inspection_approval_status_thresholds"."attention" <= "inspection_approval_status_thresholds"."critical")
);
--> statement-breakpoint
CREATE TABLE "request_protocol_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000001'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "request_protocol_status_thresholds_singleton" CHECK ("request_protocol_status_thresholds"."id" = '00000000-0000-4000-8000-000000000001'::uuid),
	CONSTRAINT "request_protocol_status_thresholds_order" CHECK ("request_protocol_status_thresholds"."on_time" <= "request_protocol_status_thresholds"."attention" AND "request_protocol_status_thresholds"."attention" <= "request_protocol_status_thresholds"."critical")
);
