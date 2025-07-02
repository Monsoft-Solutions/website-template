import {
  pgTable,
  uuid,
  varchar,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service gallery images table
 * Stores additional gallery images for each service
 */
export const serviceGalleryImages = pgTable(
  "service_gallery_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_gallery_images_service_id_fk",
    }),
  })
);
