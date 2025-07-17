import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";

/**
 * Type definitions for gallery groups
 */
export type GalleryGroup = InferSelectModel<typeof galleryGroups>;
export type NewGalleryGroup = InferInsertModel<typeof galleryGroups>;

/**
 * Gallery group creation/update data
 */
export type GalleryGroupFormData = {
  name: string;
  slug: string;
  description?: string;
  coverImageId?: string;
  displayOrder: number;
  isActive: boolean;
};
