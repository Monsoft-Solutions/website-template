import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service pricing tiers table
 * Stores pricing information for each service
 */
export const servicePricingTiers = pgTable(
  "service_pricing_tiers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    price: varchar("price", { length: 100 }).notNull(),
    description: text("description").notNull(),
    popular: boolean("popular").default(false),
    order: integer("order").notNull(),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_pricing_tiers_service_id_fk",
    }),
  })
);
