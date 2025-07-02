import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceGalleryImages } from "@/lib/db/schema/service-gallery-image.table";

/**
 * Type definitions for the service gallery images table
 */
export type ServiceGalleryImage = InferSelectModel<typeof serviceGalleryImages>;
export type NewServiceGalleryImage = InferInsertModel<
  typeof serviceGalleryImages
>;
