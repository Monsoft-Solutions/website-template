import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { serviceCategoryEnum } from "@/lib/types/enums/service-category.enum";

/**
 * Services table for storing service offerings
 * Contains core service information with related data in separate tables
 */
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  timeline: varchar("timeline", { length: 100 }).notNull(),
  category: serviceCategoryEnum("category").notNull(),
  featuredImage: varchar("featured_image", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
