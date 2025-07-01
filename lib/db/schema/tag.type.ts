import { tags } from "./tag.table";

/**
 * TypeScript types for Tag entity
 * Generated from the tags table schema
 */

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
