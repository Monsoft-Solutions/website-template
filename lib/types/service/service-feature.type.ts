import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceFeatures } from "@/lib/db/schema/service-feature.table";

/**
 * Type definitions for the service features table
 */
export type ServiceFeature = InferSelectModel<typeof serviceFeatures>;
export type NewServiceFeature = InferInsertModel<typeof serviceFeatures>;
