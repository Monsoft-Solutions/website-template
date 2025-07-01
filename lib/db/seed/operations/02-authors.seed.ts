import { db } from "../../index";
import { authors, type NewAuthor } from "../../schema/index";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Sample author data for seeding
 */
const authorData: readonly NewAuthor[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    bio: "Senior Full-Stack Developer with 10+ years of experience in web technologies.",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    bio: "UX/UI Designer passionate about creating beautiful and functional user experiences.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b563?w=150",
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    bio: "Tech entrepreneur and startup founder with expertise in business strategy.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
] as const;

/**
 * Execute authors seeding operation
 */
const execute = async (): Promise<number> => {
  const insertedAuthors = await db
    .insert(authors)
    .values([...authorData])
    .returning();

  return insertedAuthors.length;
};

/**
 * Clear authors data
 */
const clear = async (): Promise<void> => {
  await db.delete(authors);
};

/**
 * Authors seed operation configuration
 */
export const authorsSeed: SeedOperation = {
  config: {
    name: "authors",
    order: 2,
    description: "Seed blog post authors",
  },
  execute,
  clear,
};
