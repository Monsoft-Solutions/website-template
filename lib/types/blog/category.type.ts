import { categories } from "@/lib/db/schema/category.table";

/**
 * TypeScript types for Category entity
 * Generated from the categories table schema
 */

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
