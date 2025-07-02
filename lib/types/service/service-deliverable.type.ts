import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceDeliverables } from "@/lib/db/schema/service-deliverable.table";

/**
 * Type definitions for the service deliverables table
 */
export type ServiceDeliverable = InferSelectModel<typeof serviceDeliverables>;
export type NewServiceDeliverable = InferInsertModel<
  typeof serviceDeliverables
>;
