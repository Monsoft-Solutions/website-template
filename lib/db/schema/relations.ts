import { relations } from "drizzle-orm";
import { categories } from "./category.table";
import { authors } from "./author.table";
import { blogPosts } from "./blog-post.table";
import { tags } from "./tag.table";
import { blogPostsTags } from "./blog-post-tag.table";

/**
 * Database relations definitions
 * Defines the relationships between different tables
 */

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(authors, {
    fields: [blogPosts.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
  tags: many(blogPostsTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(blogPostsTags),
}));

export const blogPostsTagsRelations = relations(blogPostsTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostsTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(tags, {
    fields: [blogPostsTags.tagId],
    references: [tags.id],
  }),
}));
