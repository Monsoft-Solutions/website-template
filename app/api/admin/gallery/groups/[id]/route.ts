import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { galleryImageGroups } from "@/lib/db/schema/gallery-image-group.table";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  GalleryGroup,
  NewGalleryGroup,
} from "@/lib/types/gallery-group.type";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

/**
 * GET endpoint - Get individual gallery group with images
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can access gallery group details
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group ID is required",
        } as ApiResponse<GalleryGroupWithImages | null>,
        { status: 400 }
      );
    }

    // Get gallery group
    const [group] = await db
      .select()
      .from(galleryGroups)
      .where(eq(galleryGroups.id, id))
      .limit(1);

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group not found",
        } as ApiResponse<GalleryGroupWithImages | null>,
        { status: 404 }
      );
    }

    // Get associated images
    const imagesData = await db
      .select({
        image: galleryImages,
        displayOrder: galleryImageGroups.displayOrder,
      })
      .from(galleryImageGroups)
      .leftJoin(galleryImages, eq(galleryImageGroups.imageId, galleryImages.id))
      .where(eq(galleryImageGroups.groupId, id))
      .orderBy(galleryImageGroups.displayOrder);

    // Get cover image if exists
    const coverImage = group.coverImageId
      ? await db
          .select()
          .from(galleryImages)
          .where(eq(galleryImages.id, group.coverImageId))
          .limit(1)
          .then((result) => result[0] || undefined)
      : undefined;

    const groupWithImages: GalleryGroupWithImages = {
      ...group,
      images: imagesData
        .filter((i) => i.image)
        .map((i) => ({
          ...i.image!,
          displayOrder: i.displayOrder,
        })),
      imageCount: imagesData.filter((i) => i.image).length,
      coverImage,
    };

    return NextResponse.json({
      success: true,
      data: groupWithImages,
    } as ApiResponse<GalleryGroupWithImages>);
  } catch (error) {
    console.error("Error fetching gallery group:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery group",
      } as ApiResponse<GalleryGroupWithImages | null>,
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint - Update gallery group
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can update gallery groups
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group ID is required",
        } as ApiResponse<GalleryGroup | null>,
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validate that group exists
    const [existingGroup] = await db
      .select()
      .from(galleryGroups)
      .where(eq(galleryGroups.id, id))
      .limit(1);

    if (!existingGroup) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group not found",
        } as ApiResponse<GalleryGroup | null>,
        { status: 404 }
      );
    }

    // Check for name/slug conflicts (excluding current group)
    if (data.name || data.slug) {
      const conflicts = await db
        .select()
        .from(galleryGroups)
        .where(eq(galleryGroups.name, data.name || existingGroup.name))
        .limit(1);

      if (conflicts.length > 0 && conflicts[0].id !== id) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Gallery group with this name already exists",
          } as ApiResponse<GalleryGroup | null>,
          { status: 409 }
        );
      }

      const slugConflicts = await db
        .select()
        .from(galleryGroups)
        .where(eq(galleryGroups.slug, data.slug || existingGroup.slug))
        .limit(1);

      if (slugConflicts.length > 0 && slugConflicts[0].id !== id) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Gallery group with this slug already exists",
          } as ApiResponse<GalleryGroup | null>,
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: Partial<NewGalleryGroup> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.coverImageId !== undefined)
      updateData.coverImageId = data.coverImageId;
    if (data.displayOrder !== undefined)
      updateData.displayOrder = data.displayOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Update group record
    const [updatedGroup] = await db
      .update(galleryGroups)
      .set(updateData)
      .where(eq(galleryGroups.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: updatedGroup,
        message: "Gallery group updated successfully",
      } as ApiResponse<GalleryGroup>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gallery group:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update gallery group",
      } as ApiResponse<GalleryGroup | null>,
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint - Delete gallery group
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can delete gallery groups
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group ID is required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if group exists
    const [existingGroup] = await db
      .select()
      .from(galleryGroups)
      .where(eq(galleryGroups.id, id))
      .limit(1);

    if (!existingGroup) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group not found",
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Check if group has images
    const imageAssociations = await db
      .select()
      .from(galleryImageGroups)
      .where(eq(galleryImageGroups.groupId, id))
      .limit(1);

    if (imageAssociations.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            "Cannot delete gallery group that contains images. Please remove all images first.",
        } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Delete the group record
    await db.delete(galleryGroups).where(eq(galleryGroups.id, id));

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "Gallery group deleted successfully",
      } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery group:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete gallery group",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
