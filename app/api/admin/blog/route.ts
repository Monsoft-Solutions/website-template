import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { authors } from "@/lib/db/schema/author.table";
import { categories } from "@/lib/db/schema/category.table";
import { tags } from "@/lib/db/schema/tag.table";
import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";
import { and, eq, or, like, desc, count, exists, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import { notifyContentUpdate } from "@/lib/services/google-indexing.service";

/**
 * Admin blog posts list response type
 */
export type AdminBlogListResponse = {
  posts: BlogPostWithRelations[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Blog post creation data interface
 */
interface BlogPostCreateData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  categoryId: string;
  status: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  tagIds: string[];
}

/**
 * GET endpoint - Get all blog posts for admin (includes all statuses)
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access blog management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categoryId = searchParams.get("categoryId") || undefined;
    const tagId = searchParams.get("tagId") || undefined;
    const authorId = searchParams.get("authorId") || undefined;
    const status = searchParams.get("status") as
      | "draft"
      | "published"
      | "archived"
      | undefined;
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminBlogListResponse,
          error: "Invalid page number",
        } as ApiResponse<AdminBlogListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminBlogListResponse,
          error: "Invalid limit. Must be between 1 and 100",
        } as ApiResponse<AdminBlogListResponse>,
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Add status filter (if provided)
    if (status) {
      conditions.push(eq(blogPosts.status, status));
    }

    // Add category filter
    if (categoryId) {
      conditions.push(eq(blogPosts.categoryId, categoryId));
    }

    // Add author filter
    if (authorId) {
      conditions.push(eq(blogPosts.authorId, authorId));
    }

    // Add search filter
    if (searchQuery) {
      const searchTerm = `%${searchQuery}%`;
      conditions.push(
        or(
          like(blogPosts.title, searchTerm),
          like(blogPosts.excerpt, searchTerm),
          like(blogPosts.content, searchTerm)
        )!
      );
    }

    // Add tag filter
    if (tagId) {
      conditions.push(
        exists(
          db
            .select({ id: blogPostsTags.postId })
            .from(blogPostsTags)
            .where(
              and(
                eq(blogPostsTags.postId, blogPosts.id),
                eq(blogPostsTags.tagId, tagId)
              )
            )
        )
      );
    }

    // Build order by clause
    const orderByColumn =
      sortBy === "title"
        ? blogPosts.title
        : sortBy === "status"
        ? blogPosts.status
        : sortBy === "publishedAt"
        ? blogPosts.publishedAt
        : blogPosts.createdAt;

    const orderByClause =
      sortOrder === "asc" ? orderByColumn : desc(orderByColumn);

    // Get posts with joins
    const postsResult = await db
      .select({
        post: blogPosts,
        author: authors,
        category: categories,
      })
      .from(blogPosts)
      .leftJoin(authors, eq(blogPosts.authorId, authors.id))
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count with same conditions
    const totalCountResult = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalPosts = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalPosts / limit);

    // Get tags for each post
    const postsWithTags = await Promise.all(
      postsResult.map(async (result) => {
        const postTags = await db
          .select({ tag: tags })
          .from(blogPostsTags)
          .leftJoin(tags, eq(blogPostsTags.tagId, tags.id))
          .where(eq(blogPostsTags.postId, result.post.id));

        // Calculate reading time (approximate)
        const wordsPerMinute = 200;
        const wordCount = result.post.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);

        return {
          ...result.post,
          author: result.author!,
          category: result.category!,
          tags: postTags.map((pt) => pt.tag!),
          readingTime,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        posts: postsWithTags,
        totalPosts,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    } as ApiResponse<AdminBlogListResponse>);
  } catch (error) {
    console.error("Error fetching admin blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as AdminBlogListResponse,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch blog posts",
      } as ApiResponse<AdminBlogListResponse>,
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Create new blog post
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create blog posts
    await requireAdmin();

    const data: BlogPostCreateData = await request.json();

    // Validate required fields
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Missing required fields",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, data.slug))
      .limit(1);

    if (existingPost.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "A post with this slug already exists",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: typeof blogPosts.$inferInsert = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      authorId: data.authorId,
      categoryId: data.categoryId,
      status: data.status,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || null,
      featuredImage: data.featuredImage || null,
    };

    // Set publishedAt when publishing
    if (data.status === "published") {
      insertData.publishedAt = new Date();
    }

    // Insert the blog post
    const newPosts = await db
      .insert(blogPosts)
      .values(insertData)
      .returning({ id: blogPosts.id });

    const newPostId = newPosts[0].id;

    // Handle tags
    if (data.tagIds && data.tagIds.length > 0) {
      // Filter out temp tags (they start with "temp-")
      const validTagIds = data.tagIds.filter(
        (tagId) => !tagId.startsWith("temp-")
      );

      if (validTagIds.length > 0) {
        await db.insert(blogPostsTags).values(
          validTagIds.map((tagId) => ({
            postId: newPostId,
            tagId: tagId,
          }))
        );
      }
    }

    // Notify Google about the new blog post (async - doesn't block response)
    if (data.status === "published") {
      notifyContentUpdate("blog_post", data.slug, "URL_UPDATED");
    }

    // Invalidate blog cache
    revalidateTag("blog");

    return NextResponse.json({
      success: true,
      data: { id: newPostId },
      message: "Blog post created successfully",
    } as ApiResponse<{ id: string }>);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to create blog post",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint - Bulk delete blog posts
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete blog posts
    await requireAdmin();

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid post IDs provided",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // First, delete related blog_posts_tags entries
    await db.delete(blogPostsTags).where(
      sql`${blogPostsTags.postId} IN (${sql.join(
        ids.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

    // Then delete the blog posts
    await db.delete(blogPosts).where(
      sql`${blogPosts.id} IN (${sql.join(
        ids.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

    // Invalidate blog cache
    revalidateTag("blog");

    return NextResponse.json({
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} blog post(s)`,
    } as ApiResponse<null>);
  } catch (error) {
    console.error("Error deleting blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to delete blog posts",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint - Bulk update blog posts (publish/unpublish)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can bulk update blog posts
    await requireAdmin();

    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid post IDs provided",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (!["publish", "unpublish", "archive"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid action. Must be 'publish', 'unpublish', or 'archive'",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const status =
      action === "publish"
        ? "published"
        : action === "unpublish"
        ? "draft"
        : "archived";

    const updateData: {
      status: "published" | "draft" | "archived";
      updatedAt: Date;
      publishedAt?: Date;
    } = {
      status,
      updatedAt: new Date(),
    };

    // Set publishedAt when publishing
    if (action === "publish") {
      updateData.publishedAt = new Date();
    }

    // Update the blog posts
    await db
      .update(blogPosts)
      .set(updateData)
      .where(
        sql`${blogPosts.id} IN (${sql.join(
          ids.map((id) => sql`${id}`),
          sql`, `
        )})`
      );

    // Invalidate blog cache
    revalidateTag("blog");

    return NextResponse.json({
      success: true,
      data: null,
      message: `Successfully ${action}ed ${ids.length} blog post(s)`,
    } as ApiResponse<null>);
  } catch (error) {
    console.error("Error updating blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to update blog posts",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
