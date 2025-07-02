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
import { eq, desc, and, sql, count, like, or, exists } from "drizzle-orm";

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
 * Get published blog posts with filtering, search, and pagination
 */
export const getBlogPosts = async (
  options: BlogListOptions = {}
): Promise<BlogListResponse> => {
  const {
    page = 1,
    limit = 10,
    status = "published",
    categorySlug,
    tagSlug,
    searchQuery,
  } = options;

  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [eq(blogPosts.status, status)];

  // Add category filter
  if (categorySlug && categorySlug !== "all") {
    conditions.push(eq(categories.slug, categorySlug));
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
  if (tagSlug) {
    conditions.push(
      exists(
        db
          .select({ id: blogPostsTags.postId })
          .from(blogPostsTags)
          .leftJoin(tags, eq(blogPostsTags.tagId, tags.id))
          .where(
            and(eq(blogPostsTags.postId, blogPosts.id), eq(tags.slug, tagSlug))
          )
      )
    );
  }

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
    .where(and(...conditions))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count with same conditions
  const totalCountResult = await db
    .select({ count: count() })
    .from(blogPosts)
    .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
    .where(and(...conditions));

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
 * Get all tags with post counts
 */
export const getBlogTags = async () => {
  const tagsResult = await db
    .select({
      tag: tags,
      postCount: count(blogPosts.id),
    })
    .from(tags)
    .leftJoin(blogPostsTags, eq(tags.id, blogPostsTags.tagId))
    .leftJoin(
      blogPosts,
      and(
        eq(blogPostsTags.postId, blogPosts.id),
        eq(blogPosts.status, "published")
      )
    )
    .groupBy(tags.id)
    .having(sql`count(${blogPosts.id}) > 0`)
    .orderBy(desc(count(blogPosts.id)), tags.name);

  return tagsResult;
};

/**
 * Get posts by category slug
 */
export const getBlogPostsByCategory = async (
  categorySlug: string,
  options: Omit<BlogListOptions, "categorySlug"> = {}
): Promise<BlogListResponse> => {
  return getBlogPosts({ ...options, categorySlug });
};

/**
 * Get posts by tag slug
 */
export const getBlogPostsByTag = async (
  tagSlug: string,
  options: Omit<BlogListOptions, "tagSlug"> = {}
): Promise<BlogListResponse> => {
  return getBlogPosts({ ...options, tagSlug });
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return result[0] || null;
};

/**
 * Get tag by slug
 */
export const getTagBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);

  return result[0] || null;
};

/**
 * Featured blog posts (latest published posts)
 */
export const getFeaturedBlogPosts = async (
  limit: number = 5
): Promise<BlogPostWithRelations[]> => {
  const result = await getBlogPosts({ limit, status: "published" });
  return result.posts;
};
