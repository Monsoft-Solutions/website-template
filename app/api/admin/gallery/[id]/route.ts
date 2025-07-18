import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";
import { galleryImageGroups } from "@/lib/db/schema/gallery-image-group.table";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  GalleryImage,
  NewGalleryImage,
} from "@/lib/types/gallery-image.type";
import type { GalleryImageWithGroups } from "@/lib/types/gallery-with-relations.type";

/**
 * GET endpoint - Get individual gallery image with groups
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can access gallery image details
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery image ID is required",
        } as ApiResponse<GalleryImageWithGroups | null>,
        { status: 400 }
      );
    }

    // Get gallery image
    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id))
      .limit(1);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery image not found",
        } as ApiResponse<GalleryImageWithGroups | null>,
        { status: 404 }
      );
    }

    // Get associated groups
    const groupsData = await db
      .select({
        group: galleryGroups,
        displayOrder: galleryImageGroups.displayOrder,
      })
      .from(galleryImageGroups)
      .leftJoin(galleryGroups, eq(galleryImageGroups.groupId, galleryGroups.id))
      .where(eq(galleryImageGroups.imageId, id));

    const imageWithGroups: GalleryImageWithGroups = {
      ...image,
      groups: groupsData
        .filter((g) => g.group)
        .map((g) => ({
          ...g.group!,
          displayOrder: g.displayOrder,
        })),
    };

    return NextResponse.json({
      success: true,
      data: imageWithGroups,
    } as ApiResponse<GalleryImageWithGroups>);
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery image",
      } as ApiResponse<GalleryImageWithGroups | null>,
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint - Update gallery image
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can update gallery images
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery image ID is required",
        } as ApiResponse<GalleryImage | null>,
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validate that image exists
    const [existingImage] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id))
      .limit(1);

    if (!existingImage) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery image not found",
        } as ApiResponse<GalleryImage | null>,
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Partial<NewGalleryImage> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.altText !== undefined) updateData.altText = data.altText;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.isAvailable !== undefined)
      updateData.isAvailable = data.isAvailable;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.displayOrder !== undefined)
      updateData.displayOrder = data.displayOrder;

    // Update image record
    const [updatedImage] = await db
      .update(galleryImages)
      .set(updateData)
      .where(eq(galleryImages.id, id))
      .returning();

    // Update group associations if provided
    if (data.groupIds !== undefined) {
      // Remove existing associations
      await db
        .delete(galleryImageGroups)
        .where(eq(galleryImageGroups.imageId, id));

      // Add new associations
      if (data.groupIds.length > 0) {
        const groupAssociations = data.groupIds.map(
          (groupId: string, index: number) => ({
            imageId: id,
            groupId,
            displayOrder: index,
          })
        );

        await db.insert(galleryImageGroups).values(groupAssociations);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedImage,
        message: "Gallery image updated successfully",
      } as ApiResponse<GalleryImage>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update gallery image",
      } as ApiResponse<GalleryImage | null>,
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint - Delete gallery image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can delete gallery images
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery image ID is required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if image exists and get its details for cleanup
    const [existingImage] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id))
      .limit(1);

    if (!existingImage) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery image not found",
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Check if this image is used as a cover image for any groups
    await db.transaction(async (tx) => {
      // Check if this image is used as a cover image for any groups
      const groupsUsingAsCover = await tx
        .select()
        .from(galleryGroups)
        .where(eq(galleryGroups.coverImageId, id));

      if (groupsUsingAsCover.length > 0) {
        // Remove cover image references
        await tx
          .update(galleryGroups)
          .set({ coverImageId: null })
          .where(eq(galleryGroups.coverImageId, id));
      }

      // Delete group associations
      await tx
        .delete(galleryImageGroups)
        .where(eq(galleryImageGroups.imageId, id));

      // Delete the image record
      await tx.delete(galleryImages).where(eq(galleryImages.id, id));
    });

    // TODO: Consider deleting the actual file from blob storage
    // This would require implementing a cleanup service or using blob storage lifecycle rules

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "Gallery image deleted successfully",
      } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete gallery image",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
