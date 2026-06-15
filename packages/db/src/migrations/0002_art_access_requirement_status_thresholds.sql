CREATE TABLE "art_access_requirement_status_thresholds" (
	"attention" integer NOT NULL,
	"critical" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000004'::uuid NOT NULL,
	"on_time" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "art_access_requirement_status_thresholds_singleton" CHECK ("art_access_requirement_status_thresholds"."id" = '00000000-0000-4000-8000-000000000004'::uuid),
	CONSTRAINT "art_access_requirement_status_thresholds_order" CHECK ("art_access_requirement_status_thresholds"."on_time" <= "art_access_requirement_status_thresholds"."attention" AND "art_access_requirement_status_thresholds"."attention" <= "art_access_requirement_status_thresholds"."critical")
);
