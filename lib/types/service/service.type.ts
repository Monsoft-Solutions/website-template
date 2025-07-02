import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { services } from "@/lib/db/schema/service.table";

/**
 * Type definitions for the services table
 */
export type Service = InferSelectModel<typeof services>;
export type NewService = InferInsertModel<typeof services>;
