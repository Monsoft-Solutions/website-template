import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceRelated } from "@/lib/db/schema/service-related.table";

/**
 * Type definitions for the service related junction table
 */
export type ServiceRelated = InferSelectModel<typeof serviceRelated>;
export type NewServiceRelated = InferInsertModel<typeof serviceRelated>;
