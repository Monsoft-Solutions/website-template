import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/**
 * Gallery images for business website
 * Stores all uploaded images with metadata and organization
 */
export const galleryImages = pgTable(
  "gallery_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    altText: varchar("alt_text", { length: 500 }).notNull(),
    description: text("description"),

    // File information
    fileName: varchar("file_name", { length: 500 }).notNull(),
    originalUrl: varchar("original_url", { length: 1000 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
    optimizedUrl: varchar("optimized_url", { length: 1000 }),

    // File metadata
    fileSize: integer("file_size").notNull(), // in bytes
    width: integer("width"),
    height: integer("height"),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),

    // Organization and availability
    displayOrder: integer("display_order").notNull().default(0),
    isAvailable: boolean("is_available").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),

    // Additional metadata (EXIF data, upload info, etc.)
    metadata: jsonb("metadata"),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("is_available_idx").on(table.isAvailable),
    index("is_featured_idx").on(table.isFeatured),
    index("display_order_idx").on(table.displayOrder),
  ]
);
