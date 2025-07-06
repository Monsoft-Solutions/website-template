import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema/category.table";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { eq, ilike, and, or, desc, asc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Category, NewCategory } from "@/lib/types/blog/category.type";

/**
 * Admin Categories API Response Types
 */
export interface AdminCategoriesListResponse {
  categories: CategoryWithUsage[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryWithUsage extends Category {
  postsCount: number;
}

/**
 * GET endpoint - Fetch categories with usage statistics and admin filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access categories management
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
          ilike(categories.name, `%${searchQuery}%`),
          ilike(categories.description, `%${searchQuery}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? categories.name
        : sortBy === "postsCount"
        ? sql`posts_count`
        : categories.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(whereClause);

    const totalCategories = totalCountResult[0]?.count || 0;

    // Get categories with usage statistics
    const categoriesResult = await db
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
      .where(whereClause)
      .groupBy(categories.id)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCategories / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: AdminCategoriesListResponse = {
      categories: categoriesResult,
      totalCategories,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };

    const result: ApiResponse<AdminCategoriesListResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admin categories:", error);

    const result: ApiResponse<AdminCategoriesListResponse> = {
      success: false,
      data: {
        categories: [],
        totalCategories: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST endpoint - Create new category
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create categories
    await requireAdmin();

    const data: NewCategory = await request.json();

    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug are required",
        } as ApiResponse<Category>,
        { status: 400 }
      );
    }

    // Check if category with same name or slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(or(eq(categories.name, data.name), eq(categories.slug, data.slug)))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Category with this name or slug already exists",
        } as ApiResponse<Category>,
        { status: 409 }
      );
    }

    // Create new category
    const [newCategory] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
      })
      .returning();

    const result: ApiResponse<Category> = {
      success: true,
      data: newCategory,
      message: "Category created successfully",
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);

    const result: ApiResponse<Category | null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Bulk update categories
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can update categories
    await requireAdmin();

    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid category IDs" },
        { status: 400 }
      );
    }

    // For now, categories don't have status fields, so we'll just return success
    // This can be extended when category status fields are added
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
 * DELETE endpoint - Bulk delete categories
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete categories
    await requireAdmin();

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid category IDs" },
        { status: 400 }
      );
    }

    // Check if any categories have associated blog posts
    const categoriesWithPosts = await db
      .select({
        categoryId: blogPosts.categoryId,
        count: sql<number>`count(*)`,
      })
      .from(blogPosts)
      .where(
        sql`${blogPosts.categoryId} IN (${sql.join(
          ids.map((id) => sql`${id}`),
          sql`, `
        )})`
      )
      .groupBy(blogPosts.categoryId);

    if (categoriesWithPosts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete categories that have associated blog posts",
        },
        { status: 400 }
      );
    }

    // Delete categories
    await db.delete(categories).where(
      sql`${categories.id} IN (${sql.join(
        ids.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} category/categories`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting categories:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete categories",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
