import { db } from "../../index";
import { tags, type NewTag } from "../../schema/index";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Sample tag data for seeding
 */
const tagData: readonly NewTag[] = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Node.js", slug: "nodejs" },
  { name: "CSS", slug: "css" },
  { name: "Tailwind CSS", slug: "tailwind-css" },
  { name: "UI Design", slug: "ui-design" },
  { name: "UX Design", slug: "ux-design" },
  { name: "Startup", slug: "startup" },
  { name: "SEO", slug: "seo" },
  { name: "Performance", slug: "performance" },
] as const;

/**
 * Execute tags seeding operation
 */
const execute = async (): Promise<number> => {
  const insertedTags = await db
    .insert(tags)
    .values([...tagData])
    .returning();

  return insertedTags.length;
};

/**
 * Clear tags data
 */
const clear = async (): Promise<void> => {
  await db.delete(tags);
};

/**
 * Tags seed operation configuration
 */
export const tagsSeed: SeedOperation = {
  config: {
    name: "tags",
    order: 3,
    description: "Seed blog post tags",
  },
  execute,
  clear,
};
