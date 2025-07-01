import type { ServiceCategory } from "../types";

/**
 * Array of all available service categories
 */
export const serviceCategories: readonly ServiceCategory[] = [
  "Development",
  "Design",
  "Consulting",
  "Marketing",
  "Support",
] as const;
