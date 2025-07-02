import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceBenefits } from "@/lib/db/schema/service-benefit.table";

/**
 * Type definitions for the service benefits table
 */
export type ServiceBenefit = InferSelectModel<typeof serviceBenefits>;
export type NewServiceBenefit = InferInsertModel<typeof serviceBenefits>;
