import { pgTable, uuid, text, integer, foreignKey } from "drizzle-orm/pg-core";
import { services } from "./service.table";

/**
 * Service FAQs table
 * Stores frequently asked questions for each service
 */
export const serviceFaqs = pgTable(
  "service_faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    serviceFk: foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "service_faqs_service_id_fk",
    }),
  })
);
