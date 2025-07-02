import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { servicePricingTiers } from "@/lib/db/schema/service-pricing-tier.table";

/**
 * Type definitions for the service pricing tiers table
 */
export type ServicePricingTier = InferSelectModel<typeof servicePricingTiers>;
export type NewServicePricingTier = InferInsertModel<
  typeof servicePricingTiers
>;
