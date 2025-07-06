CREATE TYPE "public"."comment_entity_type" AS ENUM('contact_submission', 'blog_post', 'service', 'user', 'order', 'project');--> statement-breakpoint
CREATE TABLE "admin_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "comment_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"is_internal" boolean DEFAULT true NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "admin_comments" ADD CONSTRAINT "admin_comments_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;