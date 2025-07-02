import {
  pgTable,
  uuid,
  varchar,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service benefits table
 * Stores individual benefits for each service
 */
export const serviceBenefits = pgTable(
  "service_benefits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    benefit: varchar("benefit", { length: 255 }).notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_benefits_service_id_fk",
    }),
  })
);
