import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";
import { postStatusEnum } from "./post-status.enum";
import { authors } from "./author.table";
import { categories } from "./category.table";

/**
 * Blog posts table for storing article content
 * Each post belongs to one author and one category
 */
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    featuredImage: varchar("featured_image", { length: 500 }),
    authorId: uuid("author_id").notNull(),
    categoryId: uuid("category_id").notNull(),
    status: postStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),
  },
  (table) => ({
    authorFk: foreignKey({
      columns: [table.authorId],
      foreignColumns: [authors.id],
      name: "blog_posts_author_id_fk",
    }),
    categoryFk: foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "blog_posts_category_id_fk",
    }),
  })
);
