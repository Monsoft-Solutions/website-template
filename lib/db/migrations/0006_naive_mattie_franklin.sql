CREATE TYPE "public"."service_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "status" "service_status" DEFAULT 'published' NOT NULL;--> statement-breakpoint
CREATE INDEX "status_index" ON "services" USING btree ("status");--> statement-breakpoint
CREATE INDEX "category_index" ON "services" USING btree ("category");--> statement-breakpoint
CREATE INDEX "slug_index" ON "services" USING btree ("slug");