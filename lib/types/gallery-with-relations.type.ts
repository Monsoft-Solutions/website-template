import { GalleryImage } from "./gallery-image.type";
import { GalleryGroup } from "./gallery-group.type";

/**
 * Gallery image with associated groups
 */
export type GalleryImageWithGroups = GalleryImage & {
  groups: (GalleryGroup & { displayOrder: number })[];
};

/**
 * Gallery group with associated images
 */
export type GalleryGroupWithImages = GalleryGroup & {
  images: (GalleryImage & { displayOrder: number })[];
  imageCount: number;
  coverImage?: GalleryImage;
};

/**
 * Extended gallery image for admin list view
 */
export type GalleryImageWithDetails = GalleryImage & {
  groups: { id: string; name: string; displayOrder: number }[];
  groupCount: number;
};
