import { blogPosts } from "./blog-post.table";

/**
 * TypeScript types for BlogPost entity
 * Generated from the blog_posts table schema
 */

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
