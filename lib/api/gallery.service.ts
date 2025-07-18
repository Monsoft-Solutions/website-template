import { eq, asc, and, inArray, count } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";
import { galleryImageGroups } from "@/lib/db/schema/gallery-image-group.table";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { GalleryGroup } from "@/lib/types/gallery-group.type";
import type {
  GalleryImageWithGroups,
  GalleryGroupWithImages,
} from "@/lib/types/gallery-with-relations.type";

/**
 * Gallery listing options for public API
 */
export interface PublicGalleryListOptions {
  page?: number;
  limit?: number;
  groupSlug?: string;
  featured?: boolean;
}

/**
 * Public gallery list response
 */
export interface PublicGalleryListResponse {
  images: GalleryImageWithGroups[];
  totalImages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  group?: GalleryGroup;
}

/**
 * Get all available gallery images for public display
 */
export const getPublicGalleryImages = unstable_cache(
  async (
    options: PublicGalleryListOptions = {}
  ): Promise<ApiResponse<PublicGalleryListResponse>> => {
    try {
      const { page = 1, limit = 20, groupSlug, featured } = options;
      const offset = (page - 1) * limit;

      // Build where conditions - only show available images
      const conditions = [eq(galleryImages.isAvailable, true)];

      // Add featured filter if specified
      if (featured) {
        conditions.push(eq(galleryImages.isFeatured, true));
      }

      // Add group filter if specified
      let selectedGroup: GalleryGroup | undefined;

      if (groupSlug) {
        // First get the group by slug
        const [group] = await db
          .select()
          .from(galleryGroups)
          .where(
            and(
              eq(galleryGroups.slug, groupSlug),
              eq(galleryGroups.isActive, true)
            )
          )
          .limit(1);

        if (!group) {
          return {
            success: false,
            data: {
              images: [],
              totalImages: 0,
              totalPages: 0,
              currentPage: page,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            error: "Gallery group not found",
          };
        }

        selectedGroup = group;

        // Get images that belong to this group
        const imagesInGroup = db
          .select({ imageId: galleryImageGroups.imageId })
          .from(galleryImageGroups)
          .where(eq(galleryImageGroups.groupId, group.id));

        conditions.push(inArray(galleryImages.id, imagesInGroup));
      }

      const whereClause = and(...conditions);

      // Get total count with same conditions
      const totalCountResult = await db
        .select({ count: count() })
        .from(galleryImages)
        .leftJoin(
          galleryImageGroups,
          eq(galleryImages.id, galleryImageGroups.imageId)
        )
        .where(whereClause);

      const totalImages = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalImages / limit);

      // Get images with pagination
      const imagesResult = await db
        .select({
          image: galleryImages,
        })
        .from(galleryImages)
        .where(whereClause)
        .orderBy(asc(galleryImages.displayOrder), asc(galleryImages.createdAt))
        .limit(limit)
        .offset(offset);

      // Get group information for each image
      const imageIds = imagesResult.map((item) => item.image.id);
      const groupsData =
        imageIds.length > 0
          ? await db
              .select({
                imageId: galleryImageGroups.imageId,
                group: galleryGroups,
                displayOrder: galleryImageGroups.displayOrder,
              })
              .from(galleryImageGroups)
              .leftJoin(
                galleryGroups,
                eq(galleryImageGroups.groupId, galleryGroups.id)
              )
              .where(
                and(
                  inArray(galleryImageGroups.imageId, imageIds),
                  eq(galleryGroups.isActive, true)
                )
              )
          : [];

      // Build response with group information
      const imagesWithGroups: GalleryImageWithGroups[] = imagesResult.map(
        (item) => {
          const imageGroups = groupsData
            .filter((g) => g.imageId === item.image.id && g.group)
            .map((g) => ({
              ...g.group!,
              displayOrder: g.displayOrder,
            }));

          return {
            ...item.image,
            groups: imageGroups,
          };
        }
      );

      const response: PublicGalleryListResponse = {
        images: imagesWithGroups,
        totalImages,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        group: selectedGroup,
      };

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error fetching public gallery images:", error);
      return {
        success: false,
        data: {
          images: [],
          totalImages: 0,
          totalPages: 0,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery images",
      };
    }
  },
  ["getPublicGalleryImages"],
  {
    tags: ["gallery"],
    revalidate: 1800, // Cache for 30 minutes
  }
);

/**
 * Get all active gallery groups for public display
 */
export const getPublicGalleryGroups = unstable_cache(
  async (): Promise<ApiResponse<GalleryGroupWithImages[]>> => {
    try {
      // Get all active groups
      const groups = await db
        .select()
        .from(galleryGroups)
        .where(eq(galleryGroups.isActive, true))
        .orderBy(asc(galleryGroups.displayOrder), asc(galleryGroups.name));

      if (groups.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      const groupIds = groups.map((g) => g.id);

      // Get image counts for each group
      const imageCountsResult = await db
        .select({
          groupId: galleryImageGroups.groupId,
          count: count(galleryImageGroups.imageId),
        })
        .from(galleryImageGroups)
        .leftJoin(
          galleryImages,
          eq(galleryImageGroups.imageId, galleryImages.id)
        )
        .where(
          and(
            inArray(galleryImageGroups.groupId, groupIds),
            eq(galleryImages.isAvailable, true)
          )
        )
        .groupBy(galleryImageGroups.groupId);

      // Get cover images for groups that have them
      const coverImageIds = groups
        .filter((g) => g.coverImageId)
        .map((g) => g.coverImageId!);

      const coverImages =
        coverImageIds.length > 0
          ? await db
              .select()
              .from(galleryImages)
              .where(
                and(
                  inArray(galleryImages.id, coverImageIds),
                  eq(galleryImages.isAvailable, true)
                )
              )
          : [];

      // Build response with counts and cover images
      const groupsWithDetails: GalleryGroupWithImages[] = groups.map(
        (group) => {
          const imageCount =
            imageCountsResult.find((ic) => ic.groupId === group.id)?.count || 0;
          const coverImage = coverImages.find(
            (ci) => ci.id === group.coverImageId
          );

          return {
            ...group,
            images: [], // Not fetching full images list in this function
            imageCount: Number(imageCount),
            coverImage,
          };
        }
      );

      return {
        success: true,
        data: groupsWithDetails,
      };
    } catch (error) {
      console.error("Error fetching public gallery groups:", error);
      return {
        success: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery groups",
      };
    }
  },
  ["getPublicGalleryGroups"],
  {
    tags: ["gallery"],
    revalidate: 3600, // Cache for 1 hour
  }
);

/**
 * Get a specific gallery group with its images
 */
export const getPublicGalleryGroupWithImages = unstable_cache(
  async (
    groupSlug: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<GalleryGroupWithImages | null>> => {
    try {
      // Get the group by slug
      const [group] = await db
        .select()
        .from(galleryGroups)
        .where(
          and(
            eq(galleryGroups.slug, groupSlug),
            eq(galleryGroups.isActive, true)
          )
        )
        .limit(1);

      if (!group) {
        return {
          success: false,
          data: null,
          error: "Gallery group not found",
        };
      }

      const offset = (page - 1) * limit;

      // Get images for this group
      const imagesResult = await db
        .select({
          image: galleryImages,
          displayOrder: galleryImageGroups.displayOrder,
        })
        .from(galleryImageGroups)
        .leftJoin(
          galleryImages,
          eq(galleryImageGroups.imageId, galleryImages.id)
        )
        .where(
          and(
            eq(galleryImageGroups.groupId, group.id),
            eq(galleryImages.isAvailable, true)
          )
        )
        .orderBy(
          asc(galleryImageGroups.displayOrder),
          asc(galleryImages.createdAt)
        )
        .limit(limit)
        .offset(offset);

      // Get total image count for this group
      const totalCountResult = await db
        .select({ count: count() })
        .from(galleryImageGroups)
        .leftJoin(
          galleryImages,
          eq(galleryImageGroups.imageId, galleryImages.id)
        )
        .where(
          and(
            eq(galleryImageGroups.groupId, group.id),
            eq(galleryImages.isAvailable, true)
          )
        );

      const totalImages = totalCountResult[0]?.count || 0;

      // Get cover image if exists
      const coverImage = group.coverImageId
        ? await db
            .select()
            .from(galleryImages)
            .where(
              and(
                eq(galleryImages.id, group.coverImageId),
                eq(galleryImages.isAvailable, true)
              )
            )
            .limit(1)
            .then((result) => result[0] || undefined)
        : undefined;

      const imagesWithOrder = imagesResult
        .filter((item) => item.image)
        .map((item) => ({
          ...item.image!,
          displayOrder: item.displayOrder,
        }));

      const groupWithImages: GalleryGroupWithImages = {
        ...group,
        images: imagesWithOrder,
        imageCount: Number(totalImages),
        coverImage,
      };

      return {
        success: true,
        data: groupWithImages,
      };
    } catch (error) {
      console.error("Error fetching gallery group with images:", error);
      return {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery group",
      };
    }
  },
  ["getPublicGalleryGroupWithImages"],
  {
    tags: ["gallery"],
    revalidate: 1800, // Cache for 30 minutes
  }
);

/**
 * Get featured gallery images for homepage or featured sections
 */
export const getFeaturedGalleryImages = unstable_cache(
  async (limit = 6): Promise<ApiResponse<GalleryImageWithGroups[]>> => {
    try {
      // Get featured images
      const imagesResult = await db
        .select()
        .from(galleryImages)
        .where(
          and(
            eq(galleryImages.isAvailable, true),
            eq(galleryImages.isFeatured, true)
          )
        )
        .orderBy(asc(galleryImages.displayOrder), asc(galleryImages.createdAt))
        .limit(limit);

      if (imagesResult.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Get group information for featured images
      const imageIds = imagesResult.map((img) => img.id);
      const groupsData = await db
        .select({
          imageId: galleryImageGroups.imageId,
          group: galleryGroups,
          displayOrder: galleryImageGroups.displayOrder,
        })
        .from(galleryImageGroups)
        .leftJoin(
          galleryGroups,
          eq(galleryImageGroups.groupId, galleryGroups.id)
        )
        .where(
          and(
            inArray(galleryImageGroups.imageId, imageIds),
            eq(galleryGroups.isActive, true)
          )
        );

      // Build response with group information
      const featuredImagesWithGroups: GalleryImageWithGroups[] =
        imagesResult.map((image) => {
          const imageGroups = groupsData
            .filter((g) => g.imageId === image.id && g.group)
            .map((g) => ({
              ...g.group!,
              displayOrder: g.displayOrder,
            }));

          return {
            ...image,
            groups: imageGroups,
          };
        });

      return {
        success: true,
        data: featuredImagesWithGroups,
      };
    } catch (error) {
      console.error("Error fetching featured gallery images:", error);
      return {
        success: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch featured images",
      };
    }
  },
  ["getFeaturedGalleryImages"],
  {
    tags: ["gallery"],
    revalidate: 3600, // Cache for 1 hour
  }
);
