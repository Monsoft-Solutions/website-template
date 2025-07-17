import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Gallery groups for organizing images into logical categories
 * Examples: "Portfolio", "Team Photos", "Event Images", "Product Shots"
 */
export const galleryGroups = pgTable("gallery_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  coverImageId: uuid("cover_image_id"), // References a gallery image
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
