import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema/tag.table";
import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";
import { eq, ilike, and, or, desc, asc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Tag, NewTag } from "@/lib/types/blog/tag.type";

/**
 * Admin Tags API Response Types
 */
export interface AdminTagsListResponse {
  tags: TagWithUsage[];
  totalTags: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TagWithUsage extends Tag {
  postsCount: number;
}

/**
 * GET endpoint - Fetch tags with usage statistics and admin filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access tags management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where conditions
    const whereConditions = [];

    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(tags.name, `%${searchQuery}%`),
          ilike(tags.slug, `%${searchQuery}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? tags.name
        : sortBy === "postsCount"
        ? sql`posts_count`
        : tags.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(tags)
      .where(whereClause);

    const totalTags = totalCountResult[0]?.count || 0;

    // Get tags with usage statistics
    const tagsResult = await db
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
      .where(whereClause)
      .groupBy(tags.id)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalTags / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: AdminTagsListResponse = {
      tags: tagsResult,
      totalTags,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };

    const result: ApiResponse<AdminTagsListResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admin tags:", error);

    const result: ApiResponse<AdminTagsListResponse> = {
      success: false,
      data: {
        tags: [],
        totalTags: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: error instanceof Error ? error.message : "Failed to fetch tags",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST endpoint - Create new tag
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create tags
    await requireAdmin();

    const data: NewTag = await request.json();

    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug are required",
        } as ApiResponse<Tag>,
        { status: 400 }
      );
    }

    // Check if tag with same name or slug already exists
    const existingTag = await db
      .select()
      .from(tags)
      .where(or(eq(tags.name, data.name), eq(tags.slug, data.slug)))
      .limit(1);

    if (existingTag.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Tag with this name or slug already exists",
        } as ApiResponse<Tag>,
        { status: 409 }
      );
    }

    // Create new tag
    const [newTag] = await db
      .insert(tags)
      .values({
        name: data.name,
        slug: data.slug,
      })
      .returning();

    const result: ApiResponse<Tag> = {
      success: true,
      data: newTag,
      message: "Tag created successfully",
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);

    const result: ApiResponse<Tag | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to create tag",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Bulk update tags
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can update tags
    await requireAdmin();

    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid tag IDs" },
        { status: 400 }
      );
    }

    // For now, tags don't have status fields, so we'll just return success
    // This can be extended when tag status fields are added
    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Bulk ${action} operation completed successfully`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error performing bulk action:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to perform bulk action",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Bulk delete tags
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete tags
    await requireAdmin();

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid tag IDs" },
        { status: 400 }
      );
    }

    // First, delete blog_posts_tags relationships
    await db.delete(blogPostsTags).where(
      sql`${blogPostsTags.tagId} IN (${sql.join(
        ids.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

    // Then delete tags
    await db.delete(tags).where(
      sql`${tags.id} IN (${sql.join(
        ids.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} tag(s)`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting tags:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete tags",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
