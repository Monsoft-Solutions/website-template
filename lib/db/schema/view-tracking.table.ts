import { pgTable, uuid, varchar, timestamp, inet } from "drizzle-orm/pg-core";
import { contentTypeEnum } from "./enums/content-type.enum";

/**
 * View tracking table for monitoring content engagement
 * Tracks individual views for blog posts and services with visitor metadata
 *
 * Note: Foreign key constraints removed to allow flexible content_id references
 * based on content_type. Application-level validation ensures referential integrity.
 */
export const viewTracking = pgTable("view_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentType: contentTypeEnum("content_type").notNull(),
  contentId: uuid("content_id").notNull(),
  ipAddress: inet("ip_address"),
  userAgent: varchar("user_agent", { length: 1000 }),
  referer: varchar("referer", { length: 500 }),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
