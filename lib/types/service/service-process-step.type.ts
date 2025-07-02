import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceProcessSteps } from "@/lib/db/schema/service-process-step.table";

/**
 * Type definitions for the service process steps table
 */
export type ServiceProcessStep = InferSelectModel<typeof serviceProcessSteps>;
export type NewServiceProcessStep = InferInsertModel<
  typeof serviceProcessSteps
>;
