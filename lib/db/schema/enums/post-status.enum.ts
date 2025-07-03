import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Enum for blog post status values
 * Used to track the publication state of blog posts
 */
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);
