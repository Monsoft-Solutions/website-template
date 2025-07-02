import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceTechnologies } from "@/lib/db/schema/service-technology.table";

/**
 * Type definitions for the service technologies table
 */
export type ServiceTechnology = InferSelectModel<typeof serviceTechnologies>;
export type NewServiceTechnology = InferInsertModel<typeof serviceTechnologies>;
