import { pgTable, uuid, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { blogPosts } from "./blog-post.table";
import { tags } from "./tag.table";

/**
 * Junction table for many-to-many relationship between blog posts and tags
 * Associates tags with blog posts for better content organization
 */
export const blogPostsTags = pgTable(
  "blog_posts_tags",
  {
    postId: uuid("post_id").notNull(),
    tagId: uuid("tag_id").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [blogPosts.id],
      name: "blog_posts_tags_post_id_fk",
    }),
    tagFk: foreignKey({
      columns: [table.tagId],
      foreignColumns: [tags.id],
      name: "blog_posts_tags_tag_id_fk",
    }),
  })
);
