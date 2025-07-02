import {
  pgTable,
  uuid,
  varchar,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service deliverables table
 * Stores deliverables provided for each service
 */
export const serviceDeliverables = pgTable(
  "service_deliverables",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    deliverable: varchar("deliverable", { length: 255 }).notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_deliverables_service_id_fk",
    }),
  })
);
