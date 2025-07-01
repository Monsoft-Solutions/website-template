import { db } from "../../index";
import {
  blogPostsTags,
  blogPosts,
  tags,
  type NewBlogPostTag,
} from "../../schema/index";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Get blog post tag relationships with dynamic references
 */
const getBlogPostTagData = async (): Promise<NewBlogPostTag[]> => {
  // Fetch existing blog posts and tags
  const [postsData, tagsData] = await Promise.all([
    db.select().from(blogPosts),
    db.select().from(tags),
  ]);

  if (postsData.length === 0 || tagsData.length === 0) {
    throw new Error("Blog posts and tags must be seeded before blog post tags");
  }

  // Helper function to find entities by slug/identifier
  const findPost = (slug: string) => postsData.find((p) => p.slug === slug);
  const findTag = (slug: string) => tagsData.find((t) => t.slug === slug);

  const postTagRelations: NewBlogPostTag[] = [];

  // Next.js post tags
  const nextjsPost = findPost("getting-started-nextjs-15");
  if (nextjsPost) {
    const nextjsTag = findTag("nextjs");
    const reactTag = findTag("react");
    const typescriptTag = findTag("typescript");

    if (nextjsTag)
      postTagRelations.push({ postId: nextjsPost.id, tagId: nextjsTag.id });
    if (reactTag)
      postTagRelations.push({ postId: nextjsPost.id, tagId: reactTag.id });
    if (typescriptTag)
      postTagRelations.push({ postId: nextjsPost.id, tagId: typescriptTag.id });
  }

  // Web design post tags
  const designPost = findPost("future-web-design-trends-2024");
  if (designPost) {
    const uiDesignTag = findTag("ui-design");
    const uxDesignTag = findTag("ux-design");
    const cssTag = findTag("css");

    if (uiDesignTag)
      postTagRelations.push({ postId: designPost.id, tagId: uiDesignTag.id });
    if (uxDesignTag)
      postTagRelations.push({ postId: designPost.id, tagId: uxDesignTag.id });
    if (cssTag)
      postTagRelations.push({ postId: designPost.id, tagId: cssTag.id });
  }

  // Startup post tags
  const startupPost = findPost("building-successful-tech-startup-lessons");
  if (startupPost) {
    const startupTag = findTag("startup");

    if (startupTag)
      postTagRelations.push({ postId: startupPost.id, tagId: startupTag.id });
  }

  // TypeScript post tags
  const typescriptPost = findPost(
    "typescript-best-practices-large-applications"
  );
  if (typescriptPost) {
    const typescriptTag = findTag("typescript");
    const javascriptTag = findTag("javascript");

    if (typescriptTag)
      postTagRelations.push({
        postId: typescriptPost.id,
        tagId: typescriptTag.id,
      });
    if (javascriptTag)
      postTagRelations.push({
        postId: typescriptPost.id,
        tagId: javascriptTag.id,
      });
  }

  return postTagRelations;
};

/**
 * Execute blog post tags seeding operation
 */
const execute = async (): Promise<number> => {
  const postTagData = await getBlogPostTagData();

  if (postTagData.length === 0) {
    console.log("No blog post tag relationships to create");
    return 0;
  }

  await db.insert(blogPostsTags).values(postTagData);

  return postTagData.length;
};

/**
 * Clear blog post tags data
 */
const clear = async (): Promise<void> => {
  await db.delete(blogPostsTags);
};

/**
 * Blog post tags seed operation configuration
 */
export const blogPostTagsSeed: SeedOperation = {
  config: {
    name: "blog-post-tags",
    order: 5,
    description: "Seed blog post tag relationships (many-to-many)",
  },
  execute,
  clear,
};
