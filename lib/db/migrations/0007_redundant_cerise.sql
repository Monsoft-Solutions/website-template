CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"alt_text" varchar(500) NOT NULL,
	"description" text,
	"file_name" varchar(500) NOT NULL,
	"original_url" varchar(1000) NOT NULL,
	"thumbnail_url" varchar(1000),
	"optimized_url" varchar(1000),
	"file_size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"mime_type" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"cover_image_id" uuid,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_image_groups" (
	"image_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "gallery_image_groups_image_id_group_id_pk" PRIMARY KEY("image_id","group_id")
);
--> statement-breakpoint
ALTER TABLE "gallery_image_groups" ADD CONSTRAINT "gallery_image_groups_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."gallery_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_image_groups" ADD CONSTRAINT "gallery_image_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."gallery_groups"("id") ON DELETE no action ON UPDATE no action;