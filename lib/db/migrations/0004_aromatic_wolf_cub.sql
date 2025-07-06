CREATE TYPE "public"."content_type" AS ENUM('blog_post', 'service');--> statement-breakpoint
CREATE TABLE "view_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" "content_type" NOT NULL,
	"content_id" uuid NOT NULL,
	"ip_address" "inet",
	"user_agent" varchar(1000),
	"referer" varchar(500),
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
