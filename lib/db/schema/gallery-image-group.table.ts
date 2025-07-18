import {
  pgTable,
  uuid,
  foreignKey,
  primaryKey,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { galleryImages } from "./gallery-image.table";
import { galleryGroups } from "./gallery-group.table";

/**
 * Junction table for many-to-many relationship between gallery images and groups
 * Allows images to belong to multiple groups
 */
export const galleryImageGroups = pgTable(
  "gallery_image_groups",
  {
    imageId: uuid("image_id").notNull(),
    groupId: uuid("group_id").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.imageId, table.groupId] }),
    imageFk: foreignKey({
      columns: [table.imageId],
      foreignColumns: [galleryImages.id],
      name: "gallery_image_groups_image_id_fk",
    }),
    groupFk: foreignKey({
      columns: [table.groupId],
      foreignColumns: [galleryGroups.id],
      name: "gallery_image_groups_group_id_fk",
    }),
  })
);
