import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Enum for content types that can be tracked for views
 * Used in view tracking system for different content types
 */
export const contentTypeEnum = pgEnum("content_type", ["blog_post", "service"]);
