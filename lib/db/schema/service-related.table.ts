import { pgTable, uuid, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Junction table for many-to-many relationship between services and related services
 * Stores which services are related to each other
 */
export const serviceRelated = pgTable(
  "service_related",
  {
    serviceId: uuid("service_id").notNull(),
    relatedServiceId: uuid("related_service_id").notNull(),
  },
  (table) => ({
    // Composite primary key
    pk: primaryKey({ columns: [table.serviceId, table.relatedServiceId] }),

    // Foreign keys
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_related_service_id_fk",
    }),
    relatedServiceFk: foreignKey({
      columns: [table.relatedServiceId],
      foreignColumns: [services.id],
      name: "service_related_related_service_id_fk",
    }),
  })
);
