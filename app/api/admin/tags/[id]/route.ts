import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema/tag.table";
import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";
import { eq, sql } from "drizzle-orm";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Tag, NewTag } from "@/lib/types/blog/tag.type";

/**
 * GET endpoint - Get individual tag with usage statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Get tag with usage statistics
    const tagResult = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        createdAt: tags.createdAt,
        postsCount: sql<number>`count(${blogPostsTags.postId})`.as(
          "posts_count"
        ),
      })
      .from(tags)
      .leftJoin(blogPostsTags, eq(tags.id, blogPostsTags.tagId))
      .where(eq(tags.id, id))
      .groupBy(tags.id)
      .limit(1);

    if (tagResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

    const result: ApiResponse<(typeof tagResult)[0]> = {
      success: true,
      data: tagResult[0],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching tag:", error);

    const result: ApiResponse<Tag | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch tag",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PUT endpoint - Update tag
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: Partial<NewTag> = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Check if tag exists
    const [existingTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);

    if (!existingTag) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

    // Check if name or slug already exists (excluding current tag)
    if (data.name || data.slug) {
      const duplicateCheck = await db
        .select()
        .from(tags)
        .where(
          sql`${tags.id} != ${id} AND (${tags.name} = ${
            data.name || existingTag.name
          } OR ${tags.slug} = ${data.slug || existingTag.slug})`
        )
        .limit(1);

      if (duplicateCheck.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Tag with this name or slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // Update tag
    const [updatedTag] = await db
      .update(tags)
      .set({
        name: data.name || existingTag.name,
        slug: data.slug || existingTag.slug,
      })
      .where(eq(tags.id, id))
      .returning();

    const result: ApiResponse<Tag> = {
      success: true,
      data: updatedTag,
      message: "Tag updated successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating tag:", error);

    const result: ApiResponse<Tag | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to update tag",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Delete individual tag
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Check if tag exists
    const [existingTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);

    if (!existingTag) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

    // Delete blog_posts_tags relationships first
    await db.delete(blogPostsTags).where(eq(blogPostsTags.tagId, id));

    // Delete tag
    await db.delete(tags).where(eq(tags.id, id));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: "Tag deleted successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting tag:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete tag",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
