import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { servicePricingFeatures } from "@/lib/db/schema/service-pricing-feature.table";

/**
 * Type definitions for the service pricing features table
 */
export type ServicePricingFeature = InferSelectModel<
  typeof servicePricingFeatures
>;
export type NewServicePricingFeature = InferInsertModel<
  typeof servicePricingFeatures
>;
