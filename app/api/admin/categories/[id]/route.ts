import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema/category.table";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { eq, sql } from "drizzle-orm";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Category, NewCategory } from "@/lib/types/blog/category.type";

/**
 * GET endpoint - Get individual category with usage statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Get category with usage statistics
    const categoryResult = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        postsCount: sql<number>`count(${blogPosts.id})`.as("posts_count"),
      })
      .from(categories)
      .leftJoin(blogPosts, eq(categories.id, blogPosts.categoryId))
      .where(eq(categories.id, id))
      .groupBy(categories.id)
      .limit(1);

    if (categoryResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const result: ApiResponse<(typeof categoryResult)[0]> = {
      success: true,
      data: categoryResult[0],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching category:", error);

    const result: ApiResponse<Category | null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch category",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PUT endpoint - Update category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: Partial<NewCategory> = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if name or slug already exists (excluding current category)
    if (data.name || data.slug) {
      const duplicateCheck = await db
        .select()
        .from(categories)
        .where(
          sql`${categories.id} != ${id} AND (${categories.name} = ${
            data.name || existingCategory.name
          } OR ${categories.slug} = ${data.slug || existingCategory.slug})`
        )
        .limit(1);

      if (duplicateCheck.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Category with this name or slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // Update category
    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: data.name || existingCategory.name,
        slug: data.slug || existingCategory.slug,
        description:
          data.description !== undefined
            ? data.description
            : existingCategory.description,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    const result: ApiResponse<Category> = {
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating category:", error);

    const result: ApiResponse<Category | null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Delete individual category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has associated blog posts
    const associatedPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.categoryId, id));

    if (associatedPosts[0]?.count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category that has associated blog posts",
        },
        { status: 400 }
      );
    }

    // Delete category
    await db.delete(categories).where(eq(categories.id, id));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: "Category deleted successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting category:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
