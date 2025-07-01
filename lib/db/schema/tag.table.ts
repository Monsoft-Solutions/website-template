import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

/**
 * Tags table for categorizing blog posts with keywords
 * Multiple tags can be associated with multiple blog posts (many-to-many)
 */
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
