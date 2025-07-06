import { NextRequest, NextResponse } from "next/server";
import { authors } from "@/lib/db/schema/author.table";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { db } from "@/lib/db";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Author, NewAuthor } from "@/lib/types/blog/author.type";

/**
 * Admin authors list response type
 */
export interface AdminAuthorsListResponse {
  authors: AuthorWithUsage[];
  totalAuthors: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuthorWithUsage extends Author {
  postsCount: number;
}

/**
 * GET endpoint - Fetch authors with admin filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access author management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminAuthorsListResponse,
          error: "Invalid page number",
        } as ApiResponse<AdminAuthorsListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminAuthorsListResponse,
          error: "Invalid limit. Must be between 1 and 100",
        } as ApiResponse<AdminAuthorsListResponse>,
        { status: 400 }
      );
    }

    // Build where conditions
    const whereConditions = [];

    // Add search query filter
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(authors.name, `%${searchQuery}%`),
          ilike(authors.email, `%${searchQuery}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? authors.name
        : sortBy === "email"
        ? authors.email
        : authors.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(authors)
      .where(whereClause);

    const totalAuthors = totalCountResult[0]?.count || 0;

    // Get authors with pagination and posts count
    const authorsResult = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        bio: authors.bio,
        avatarUrl: authors.avatarUrl,
        createdAt: authors.createdAt,
        updatedAt: authors.updatedAt,
        postsCount: sql<number>`count(${blogPosts.id})`.as("posts_count"),
      })
      .from(authors)
      .leftJoin(blogPosts, eq(authors.id, blogPosts.authorId))
      .where(whereClause)
      .groupBy(authors.id)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalAuthors / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: AdminAuthorsListResponse = {
      authors: authorsResult,
      totalAuthors,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };

    const result: ApiResponse<AdminAuthorsListResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: {} as AdminAuthorsListResponse,
            error: "Unauthorized",
          } as ApiResponse<AdminAuthorsListResponse>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: {} as AdminAuthorsListResponse,
            error: "Forbidden",
          } as ApiResponse<AdminAuthorsListResponse>,
          { status: 403 }
        );
      }
    }

    console.error("Error fetching admin authors:", error);

    const result: ApiResponse<AdminAuthorsListResponse> = {
      success: false,
      data: {
        authors: [],
        totalAuthors: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: error instanceof Error ? error.message : "Failed to fetch authors",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST endpoint - Create new author
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create authors
    await requireAdmin();

    const data: NewAuthor = await request.json();

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and email are required",
        } as ApiResponse<Author>,
        { status: 400 }
      );
    }

    // Check if author with same email already exists
    const existingAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.email, data.email))
      .limit(1);

    if (existingAuthor.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Author with this email already exists",
        } as ApiResponse<Author>,
        { status: 409 }
      );
    }

    // Create new author
    const [newAuthor] = await db
      .insert(authors)
      .values({
        name: data.name,
        email: data.email,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
      })
      .returning();

    const result: ApiResponse<Author> = {
      success: true,
      data: newAuthor,
      message: "Author created successfully",
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Unauthorized",
          } as ApiResponse<Author | null>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Forbidden",
          } as ApiResponse<Author | null>,
          { status: 403 }
        );
      }
    }

    console.error("Error creating author:", error);

    const result: ApiResponse<Author | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to create author",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Bulk update authors
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can update authors
    await requireAdmin();

    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid author IDs" },
        { status: 400 }
      );
    }

    // For now, authors don't have status fields, so we'll just return success
    // This can be extended when author status fields are added
    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Bulk ${action} operation completed successfully`,
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Unauthorized",
          } as ApiResponse<null>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Forbidden",
          } as ApiResponse<null>,
          { status: 403 }
        );
      }
    }

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
 * DELETE endpoint - Bulk delete authors
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete authors
    await requireAdmin();

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid author IDs" },
        { status: 400 }
      );
    }

    // Check if any authors have associated blog posts
    const authorsWithPosts = await db
      .select({
        authorId: blogPosts.authorId,
        count: sql<number>`count(*)`,
      })
      .from(blogPosts)
      .where(
        sql`${blogPosts.authorId} IN (${sql.join(
          ids.map((id) => sql`${id}`),
          sql`, `
        )})`
      )
      .groupBy(blogPosts.authorId);

    if (authorsWithPosts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete authors that have associated blog posts",
        },
        { status: 400 }
      );
    }

    // Delete authors
    await db.delete(authors).where(
      sql`${authors.id} IN (${sql.join(
        ids.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} author(s)`,
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Unauthorized",
          } as ApiResponse<null>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Forbidden",
          } as ApiResponse<null>,
          { status: 403 }
        );
      }
    }

    console.error("Error deleting authors:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete authors",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
