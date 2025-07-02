import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { categories } from "@/lib/db/schema/category.table";
import { authors } from "@/lib/db/schema/author.table";
import { tags } from "@/lib/db/schema/tag.table";
import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";
import type {
  BlogPostWithRelations,
  BlogListOptions,
  BlogListResponse,
} from "@/lib/types";
import { eq, desc, and, sql, count } from "drizzle-orm";

/**
 * Calculate estimated reading time based on content length
 * Assumes average reading speed of 200-250 words per minute
 */
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
};

/**
 * Get published blog posts with basic pagination
 * Simplified version to avoid complex query typing issues
 */
export const getBlogPosts = async (
  options: BlogListOptions = {}
): Promise<BlogListResponse> => {
  const { page = 1, limit = 10, status = "published" } = options;

  const offset = (page - 1) * limit;

  // Get posts with basic joins
  const postsResult = await db
    .select({
      post: blogPosts,
      author: authors,
      category: categories,
    })
    .from(blogPosts)
    .leftJoin(authors, eq(blogPosts.authorId, authors.id))
    .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
    .where(eq(blogPosts.status, status))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const totalCountResult = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(eq(blogPosts.status, status));

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

      return {
        ...result.post,
        author: result.author!,
        category: result.category!,
        tags: postTags.map((pt) => pt.tag!),
        readingTime: calculateReadingTime(result.post.content),
      };
    })
  );

  return {
    posts: postsWithTags,
    totalPosts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Get a single blog post by slug with all relations
 */
export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPostWithRelations | null> => {
  const result = await db
    .select({
      post: blogPosts,
      author: authors,
      category: categories,
    })
    .from(blogPosts)
    .leftJoin(authors, eq(blogPosts.authorId, authors.id))
    .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const postData = result[0];

  // Get tags for the post
  const postTags = await db
    .select({ tag: tags })
    .from(blogPostsTags)
    .leftJoin(tags, eq(blogPostsTags.tagId, tags.id))
    .where(eq(blogPostsTags.postId, postData.post.id));

  return {
    ...postData.post,
    author: postData.author!,
    category: postData.category!,
    tags: postTags.map((pt) => pt.tag!),
    readingTime: calculateReadingTime(postData.post.content),
  };
};

/**
 * Get related blog posts based on category
 */
export const getRelatedBlogPosts = async (
  postId: string,
  limit: number = 3
): Promise<BlogPostWithRelations[]> => {
  // First get the current post's category
  const currentPost = await db
    .select({
      categoryId: blogPosts.categoryId,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1);

  if (currentPost.length === 0) {
    return [];
  }

  const categoryId = currentPost[0].categoryId;

  // Get posts from the same category, excluding the current post
  const relatedPosts = await db
    .select({
      post: blogPosts,
      author: authors,
      category: categories,
    })
    .from(blogPosts)
    .leftJoin(authors, eq(blogPosts.authorId, authors.id))
    .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
    .where(
      and(
        eq(blogPosts.categoryId, categoryId),
        eq(blogPosts.status, "published"),
        sql`${blogPosts.id} != ${postId}`
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);

  // Get tags for each related post
  const postsWithTags = await Promise.all(
    relatedPosts.map(async (result) => {
      const postTags = await db
        .select({ tag: tags })
        .from(blogPostsTags)
        .leftJoin(tags, eq(blogPostsTags.tagId, tags.id))
        .where(eq(blogPostsTags.postId, result.post.id));

      return {
        ...result.post,
        author: result.author!,
        category: result.category!,
        tags: postTags.map((pt) => pt.tag!),
        readingTime: calculateReadingTime(result.post.content),
      };
    })
  );

  return postsWithTags;
};

/**
 * Get all categories with post counts
 */
export const getBlogCategories = async () => {
  const categoriesResult = await db
    .select({
      category: categories,
      postCount: count(blogPosts.id),
    })
    .from(categories)
    .leftJoin(
      blogPosts,
      and(
        eq(categories.id, blogPosts.categoryId),
        eq(blogPosts.status, "published")
      )
    )
    .groupBy(categories.id)
    .orderBy(categories.name);

  // Get total posts count
  const totalPostsResult = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));

  const totalPosts = totalPostsResult[0]?.count || 0;

  // Add "All" category at the beginning
  return [
    {
      category: {
        id: "all",
        name: "All",
        slug: "all",
        description: "All blog posts",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      postCount: totalPosts,
    },
    ...categoriesResult,
  ];
};

/**
 * Get featured blog posts (latest published posts)
 */
export const getFeaturedBlogPosts = async (
  limit: number = 5
): Promise<BlogPostWithRelations[]> => {
  const result = await getBlogPosts({ limit, status: "published" });
  return result.posts;
};
