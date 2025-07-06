import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema/author.table";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { eq, sql } from "drizzle-orm";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Author, NewAuthor } from "@/lib/types/blog/author.type";

/**
 * GET endpoint - Get individual author with usage statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Author ID is required" },
        { status: 400 }
      );
    }

    // Get author with usage statistics
    const authorResult = await db
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
      .where(eq(authors.id, id))
      .groupBy(authors.id)
      .limit(1);

    if (authorResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 }
      );
    }

    const result: ApiResponse<(typeof authorResult)[0]> = {
      success: true,
      data: authorResult[0],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching author:", error);

    const result: ApiResponse<Author | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch author",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PUT endpoint - Update author
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: Partial<NewAuthor> = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Author ID is required" },
        { status: 400 }
      );
    }

    // Check if author exists
    const [existingAuthor] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    if (!existingAuthor) {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 }
      );
    }

    // Check if email already exists (excluding current author)
    if (data.email && data.email !== existingAuthor.email) {
      const duplicateCheck = await db
        .select()
        .from(authors)
        .where(sql`${authors.id} != ${id} AND ${authors.email} = ${data.email}`)
        .limit(1);

      if (duplicateCheck.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Author with this email already exists",
          },
          { status: 409 }
        );
      }
    }

    // Update author
    const [updatedAuthor] = await db
      .update(authors)
      .set({
        name: data.name || existingAuthor.name,
        email: data.email || existingAuthor.email,
        bio: data.bio !== undefined ? data.bio : existingAuthor.bio,
        avatarUrl:
          data.avatarUrl !== undefined
            ? data.avatarUrl
            : existingAuthor.avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, id))
      .returning();

    const result: ApiResponse<Author> = {
      success: true,
      data: updatedAuthor,
      message: "Author updated successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating author:", error);

    const result: ApiResponse<Author | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to update author",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Delete individual author
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Author ID is required" },
        { status: 400 }
      );
    }

    // Check if author exists
    const [existingAuthor] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    if (!existingAuthor) {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 }
      );
    }

    // Check if author has associated blog posts
    const associatedPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.authorId, id));

    if (associatedPosts[0]?.count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete author that has associated blog posts",
        },
        { status: 400 }
      );
    }

    // Delete author
    await db.delete(authors).where(eq(authors.id, id));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: "Author deleted successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting author:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete author",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
