CREATE TABLE "site_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"og_image" varchar(500) NOT NULL,
	"links" jsonb NOT NULL,
	"creator" jsonb NOT NULL,
	"keywords" jsonb NOT NULL,
	"language" varchar(10) NOT NULL,
	"locale" varchar(20) NOT NULL,
	"theme" jsonb NOT NULL,
	"social_media" jsonb NOT NULL,
	"metadata" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
