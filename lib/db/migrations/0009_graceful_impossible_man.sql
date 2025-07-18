ALTER TABLE "gallery_groups" ADD CONSTRAINT "gallery_groups_cover_image_id_gallery_images_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."gallery_images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "is_available_idx" ON "gallery_images" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "is_featured_idx" ON "gallery_images" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "display_order_idx" ON "gallery_images" USING btree ("display_order");