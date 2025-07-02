import {
  pgTable,
  uuid,
  varchar,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service technologies table
 * Stores technologies used for each service
 */
export const serviceTechnologies = pgTable(
  "service_technologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    technology: varchar("technology", { length: 100 }).notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_technologies_service_id_fk",
    }),
  })
);
