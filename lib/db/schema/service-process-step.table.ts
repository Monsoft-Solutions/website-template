import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service process steps table
 * Stores the step-by-step process for each service
 */
export const serviceProcessSteps = pgTable(
  "service_process_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    step: integer("step").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    duration: varchar("duration", { length: 100 }),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_process_steps_service_id_fk",
    }),
  })
);
