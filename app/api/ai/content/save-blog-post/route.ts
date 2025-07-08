import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { categories } from "@/lib/db/schema/category.table";
import { tags } from "@/lib/db/schema/tag.table";
import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";
import { eq, or } from "drizzle-orm";
import {
  BlogPostSaveRequestSchema,
  type BlogPostSaveResponse,
} from "@/lib/types/ai/content-generation.type";

/**
 * Generate a unique slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 255);
}

/**
 * Generate a unique slug by checking database and adding suffix if needed
 */
async function generateUniqueSlug(
  title: string,
  existingSlug?: string
): Promise<string> {
  const baseSlug = existingSlug || generateSlug(title);
  let finalSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, finalSlug))
      .limit(1);

    if (existing.length === 0) {
      break;
    }

    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

/**
 * Find or create category by name and return its ID
 */
async function findOrCreateCategory(categoryName: string): Promise<string> {
  // First try to find existing category
  const existingCategory = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, categoryName))
    .limit(1);

  if (existingCategory.length > 0) {
    return existingCategory[0].id;
  }

  // Create new category if it doesn't exist
  const slug = generateSlug(categoryName);
  const newCategories = await db
    .insert(categories)
    .values({
      name: categoryName,
      slug: slug,
      description: `Category for ${categoryName} related posts`,
    })
    .returning({ id: categories.id });

  return newCategories[0].id;
}

/**
 * Find or create tags by name and return their IDs
 */
async function findOrCreateTags(tagNames: string[]): Promise<string[]> {
  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    // First try to find existing tag
    const existingTag = await db
      .select({ id: tags.id })
      .from(tags)
      .where(or(eq(tags.name, tagName), eq(tags.slug, tagName)))
      .limit(1);

    if (existingTag.length > 0) {
      tagIds.push(existingTag[0].id);
    } else {
      // Create new tag if it doesn't exist
      const slug = generateSlug(tagName);
      const newTags = await db
        .insert(tags)
        .values({
          name: tagName,
          slug: slug,
        })
        .returning({ id: tags.id });

      tagIds.push(newTags[0].id);
    }
  }

  return tagIds;
}

/**
 * POST /api/ai/content/save-blog-post - Save AI-generated blog post to database
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body = await request.json();

    // Validate request data
    const validatedData = BlogPostSaveRequestSchema.parse(body);

    // Generate unique slug
    const finalSlug = await generateUniqueSlug(
      validatedData.title,
      validatedData.slug
    );

    // Handle category mapping
    let finalCategoryId = validatedData.categoryId;
    if (validatedData.category && !validatedData.categoryId) {
      finalCategoryId = await findOrCreateCategory(validatedData.category);
    }

    // Handle tags mapping
    const tagIds = await findOrCreateTags(validatedData.tags);

    // Prepare blog post data
    const blogPostData: typeof blogPosts.$inferInsert = {
      title: validatedData.title,
      slug: finalSlug,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      authorId: validatedData.authorId,
      categoryId: finalCategoryId,
      status: validatedData.status || "draft",
      metaTitle: validatedData.metaTitle || null,
      metaDescription: validatedData.metaDescription,
      metaKeywords: validatedData.metaKeywords || null,
      featuredImage: validatedData.featuredImage || null,
    };

    // Set publishedAt if status is published
    if (validatedData.status === "published") {
      blogPostData.publishedAt = new Date();
    }

    // Insert blog post
    const newPosts = await db
      .insert(blogPosts)
      .values(blogPostData)
      .returning({ id: blogPosts.id, slug: blogPosts.slug });

    const newPostId = newPosts[0].id;
    const newPostSlug = newPosts[0].slug;

    // Insert tag associations
    if (tagIds.length > 0) {
      await db.insert(blogPostsTags).values(
        tagIds.map((tagId) => ({
          postId: newPostId,
          tagId: tagId,
        }))
      );
    }

    const response: BlogPostSaveResponse = {
      success: true,
      data: {
        id: newPostId,
        slug: newPostSlug,
      },
      message: "Blog post saved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error saving blog post:", error);

    const response: BlogPostSaveResponse = {
      success: false,
      data: null,
      message: "Failed to save blog post",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
