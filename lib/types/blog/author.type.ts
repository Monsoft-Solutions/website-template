import { authors } from "@/lib/db/schema/author.table";

/**
 * TypeScript types for Author entity
 * Generated from the authors table schema
 */

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
