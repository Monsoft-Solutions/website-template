import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Enum for entity types that can have comments/notes
 * Used to track which type of entity a comment belongs to
 */
export const commentEntityTypeEnum = pgEnum("comment_entity_type", [
  "contact_submission",
  "blog_post",
  "service",
  "user",
  "order",
  "project",
]);
