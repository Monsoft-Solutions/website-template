import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";

/**
 * Type definitions for gallery images
 */
export type GalleryImage = InferSelectModel<typeof galleryImages>;
export type NewGalleryImage = InferInsertModel<typeof galleryImages>;

/**
 * Gallery image creation data (for forms)
 */
export type GalleryImageCreateData = {
  name: string;
  altText: string;
  description?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  groupIds: string[];
  file: File;
};

/**
 * Gallery image update data (for forms)
 */
export type GalleryImageUpdateData = {
  name: string;
  altText: string;
  description?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  groupIds: string[];
};

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  uploadedBy?: string;
  uploadedAt?: string;
  originalFileName?: string;
  exifData?: Record<string, string | number | boolean>;
  processingInfo?: {
    resized: boolean;
    compressed: boolean;
    thumbnailGenerated: boolean;
  };
}
