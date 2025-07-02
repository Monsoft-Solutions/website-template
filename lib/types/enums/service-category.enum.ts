import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Enum for service category values
 * Used to categorize different types of services offered
 */
export const serviceCategoryEnum = pgEnum("service_category", [
  "Development",
  "Design",
  "Consulting",
  "Marketing",
  "Support",
]);

export type ServiceCategory =
  | "Development"
  | "Design"
  | "Consulting"
  | "Marketing"
  | "Support";
