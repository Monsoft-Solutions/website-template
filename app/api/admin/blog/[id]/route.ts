import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { authors } from "@/lib/db/schema/author.table";
import { categories } from "@/lib/db/schema/category.table";
import { tags } from "@/lib/db/schema/tag.table";
import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import { notifyContentUpdate } from "@/lib/services/google-indexing.service";

interface BlogPostUpdateData {
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
 * GET endpoint - Get single blog post for admin editing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can access blog posts
    await requireAdmin();

    const { id } = await params;

    // Get blog post with relations
    const postResult = await db
      .select({
        post: blogPosts,
        author: authors,
        category: categories,
      })
      .from(blogPosts)
      .leftJoin(authors, eq(blogPosts.authorId, authors.id))
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Blog post not found",
        } as ApiResponse<BlogPostWithRelations | null>,
        { status: 404 }
      );
    }

    const postData = postResult[0];

    // Get tags for the post
    const postTags = await db
      .select({ tag: tags })
      .from(blogPostsTags)
      .leftJoin(tags, eq(blogPostsTags.tagId, tags.id))
      .where(eq(blogPostsTags.postId, postData.post.id));

    // Calculate reading time (approximate)
    const wordsPerMinute = 200;
    const wordCount = postData.post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const blogPost: BlogPostWithRelations = {
      ...postData.post,
      author: postData.author!,
      category: postData.category!,
      tags: postTags.map((pt) => pt.tag!),
      readingTime,
    };

    return NextResponse.json({
      success: true,
      data: blogPost,
    } as ApiResponse<BlogPostWithRelations>);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch blog post",
      } as ApiResponse<BlogPostWithRelations | null>,
      { status: 500 }
    );
  }
}

/**
 * PUT endpoint - Update blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can update blog posts
    await requireAdmin();

    const { id } = await params;
    const data: BlogPostUpdateData = await request.json();

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

    // Check if slug already exists (excluding current post)
    const existingPost = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, data.slug), eq(blogPosts.id, id)))
      .limit(1);

    if (existingPost.length > 0 && existingPost[0].id !== id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "A post with this slug already exists",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Partial<typeof blogPosts.$inferInsert> = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      authorId: data.authorId,
      categoryId: data.categoryId,
      status: data.status,
      updatedAt: new Date(),
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || null,
    };

    // Handle featured image
    if (data.featuredImage) {
      updateData.featuredImage = data.featuredImage;
    }

    // Set publishedAt when publishing
    if (data.status === "published") {
      // Only set publishedAt if it's not already set
      const currentPost = await db
        .select({ publishedAt: blogPosts.publishedAt })
        .from(blogPosts)
        .where(eq(blogPosts.id, id))
        .limit(1);

      if (currentPost.length > 0 && !currentPost[0].publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Update the blog post
    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));

    // Handle tags - remove old associations and add new ones
    await db.delete(blogPostsTags).where(eq(blogPostsTags.postId, id));

    if (data.tagIds && data.tagIds.length > 0) {
      // Filter out temp tags (they start with "temp-")
      const validTagIds = data.tagIds.filter(
        (tagId) => !tagId.startsWith("temp-")
      );

      if (validTagIds.length > 0) {
        await db.insert(blogPostsTags).values(
          validTagIds.map((tagId) => ({
            postId: id,
            tagId: tagId,
          }))
        );
      }
    }

    // Notify Google about the blog post update (async - doesn't block response)
    notifyContentUpdate("blog_post", data.slug, "URL_UPDATED");

    return NextResponse.json({
      success: true,
      data: null,
      message: "Blog post updated successfully",
    } as ApiResponse<null>);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to update blog post",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint - Delete blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can delete blog posts
    await requireAdmin();

    const { id } = await params;

    // Get the blog post slug before deleting (for Google indexing notification)
    const [postToDelete] = await db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!postToDelete) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Blog post not found",
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // First, delete related blog_posts_tags entries
    await db.delete(blogPostsTags).where(eq(blogPostsTags.postId, id));

    // Then delete the blog post
    const deletedPosts = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });

    if (deletedPosts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Blog post not found",
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Notify Google about the blog post deletion (async - doesn't block response)
    notifyContentUpdate("blog_post", postToDelete.slug, "URL_DELETED");

    return NextResponse.json({
      success: true,
      data: null,
      message: "Blog post deleted successfully",
    } as ApiResponse<null>);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to delete blog post",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
