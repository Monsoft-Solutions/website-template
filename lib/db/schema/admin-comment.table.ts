import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { commentEntityTypeEnum } from "@/lib/db/schema/enums/comment-entity-type.enum";
import { user } from "@/lib/db/schema/auth-schema";

/**
 * Admin comments table for storing internal notes and comments
 * Can be used across different entity types (submissions, posts, services, etc.)
 * Provides a reusable comment system for admin tracking
 */
export const adminComments = pgTable("admin_comments", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Entity relationship - polymorphic design
  entityType: commentEntityTypeEnum("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),

  // Comment content
  content: text("content").notNull(),

  // Author relationship
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Metadata
  isInternal: boolean("is_internal").notNull().default(true), // true for admin notes, false for public comments
  isPinned: boolean("is_pinned").notNull().default(false), // for important notes

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  // Soft delete support
  deletedAt: timestamp("deleted_at"),
});
