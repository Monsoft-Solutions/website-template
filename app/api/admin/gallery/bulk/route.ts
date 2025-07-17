import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";

/**
 * PATCH endpoint - Bulk update gallery images (availability or featured status)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can perform bulk operations
    await requireAdmin();

    const body = await request.json();
    const { imageIds, operation, value } = body;

    // Validate request body
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: imageIds must be a non-empty array",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    if (!operation || !["availability", "featured"].includes(operation)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request: operation must be 'availability' or 'featured'",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    if (typeof value !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: value must be a boolean",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Determine the field to update
    const updateField =
      operation === "availability" ? "isAvailable" : "isFeatured";
    const updateData = { [updateField]: value };

    // Perform bulk update
    const updateResult = await db
      .update(galleryImages)
      .set(updateData)
      .where(inArray(galleryImages.id, imageIds))
      .returning({ id: galleryImages.id });

    const updatedCount = updateResult.length;

    if (updatedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No images were updated. Please check that the provided image IDs exist.",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { updated: updatedCount },
      message: `Successfully updated ${updatedCount} image(s)`,
    } as ApiResponse<{ updated: number }>);
  } catch (error) {
    console.error("Error in bulk update gallery images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while updating images",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint - Bulk delete gallery images
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete images
    await requireAdmin();

    const body = await request.json();
    const { imageIds } = body;

    // Validate request body
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: imageIds must be a non-empty array",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // First, get the images to delete (to clean up files later if needed)
    const imagesToDelete = await db
      .select({
        id: galleryImages.id,
        originalUrl: galleryImages.originalUrl,
        thumbnailUrl: galleryImages.thumbnailUrl,
      })
      .from(galleryImages)
      .where(inArray(galleryImages.id, imageIds));

    if (imagesToDelete.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No images found with the provided IDs",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Delete images from database
    const deleteResult = await db
      .delete(galleryImages)
      .where(inArray(galleryImages.id, imageIds))
      .returning({ id: galleryImages.id });

    const deletedCount = deleteResult.length;

    // TODO: In a production environment, you might want to:
    // 1. Delete actual files from blob storage
    // 2. Remove image-group relationships (handled by foreign key constraints)
    // 3. Update any references to these images as cover images

    return NextResponse.json({
      success: true,
      data: { deleted: deletedCount },
      message: `Successfully deleted ${deletedCount} image(s)`,
    } as ApiResponse<{ deleted: number }>);
  } catch (error) {
    console.error("Error in bulk delete gallery images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while deleting images",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
