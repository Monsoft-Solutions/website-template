import { db } from "../../index";
import { categories } from "../../schema/index";
import type { NewCategory } from "@/lib/types/blog";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Sample category data for seeding
 */
const categoryData: readonly NewCategory[] = [
  {
    name: "Technology",
    slug: "technology",
    description: "Latest trends and insights in technology",
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and full-stack development topics",
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design, visual design, and design systems",
  },
  {
    name: "Business",
    slug: "business",
    description: "Business strategies, entrepreneurship, and market insights",
  },
] as const;

/**
 * Execute categories seeding operation
 */
const execute = async (): Promise<number> => {
  const insertedCategories = await db
    .insert(categories)
    .values([...categoryData])
    .returning();

  return insertedCategories.length;
};

/**
 * Clear categories data
 */
const clear = async (): Promise<void> => {
  await db.delete(categories);
};

/**
 * Categories seed operation configuration
 */
export const categoriesSeed: SeedOperation = {
  config: {
    name: "categories",
    order: 1,
    description: "Seed blog post categories",
  },
  execute,
  clear,
};
