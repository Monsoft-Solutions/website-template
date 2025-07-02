import { pgTable, uuid, text, varchar, foreignKey } from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service testimonials table
 * Stores customer testimonials for each service
 */
export const serviceTestimonials = pgTable(
  "service_testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    quote: text("quote").notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    avatar: varchar("avatar", { length: 500 }),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_testimonials_service_id_fk",
    }),
  })
);
