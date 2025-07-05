import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

/**
 * Verification tokens table for Better Auth
 * Used for email verification and password reset tokens
 */
export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
