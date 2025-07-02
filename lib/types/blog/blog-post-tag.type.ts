import { blogPostsTags } from "@/lib/db/schema/blog-post-tag.table";

/**
 * TypeScript types for BlogPostTag junction entity
 * Generated from the blog_posts_tags table schema
 */

export type BlogPostTag = typeof blogPostsTags.$inferSelect;
export type NewBlogPostTag = typeof blogPostsTags.$inferInsert;
