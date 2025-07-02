CREATE TYPE "public"."service_category" AS ENUM('Development', 'Design', 'Consulting', 'Marketing', 'Support');--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text NOT NULL,
	"timeline" varchar(100) NOT NULL,
	"category" "service_category" NOT NULL,
	"featured_image" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"feature" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_benefits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"benefit" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_process_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"step" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"duration" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "service_pricing_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"price" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"popular" boolean DEFAULT false,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_pricing_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pricing_tier_id" uuid NOT NULL,
	"feature" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"technology" varchar(100) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"deliverable" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"quote" text NOT NULL,
	"author" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"avatar" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "service_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_related" (
	"service_id" uuid NOT NULL,
	"related_service_id" uuid NOT NULL,
	CONSTRAINT "service_related_service_id_related_service_id_pk" PRIMARY KEY("service_id","related_service_id")
);
--> statement-breakpoint
ALTER TABLE "service_features" ADD CONSTRAINT "service_features_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_benefits" ADD CONSTRAINT "service_benefits_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_process_steps" ADD CONSTRAINT "service_process_steps_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_pricing_tiers" ADD CONSTRAINT "service_pricing_tiers_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_pricing_features" ADD CONSTRAINT "service_pricing_features_pricing_tier_id_fk" FOREIGN KEY ("pricing_tier_id") REFERENCES "public"."service_pricing_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_technologies" ADD CONSTRAINT "service_technologies_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_deliverables" ADD CONSTRAINT "service_deliverables_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_gallery_images" ADD CONSTRAINT "service_gallery_images_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_testimonials" ADD CONSTRAINT "service_testimonials_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_faqs" ADD CONSTRAINT "service_faqs_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_related" ADD CONSTRAINT "service_related_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_related" ADD CONSTRAINT "service_related_related_service_id_fk" FOREIGN KEY ("related_service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;