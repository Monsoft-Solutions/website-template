import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  jsonb,
} from "drizzle-orm/pg-core";
import { user as users } from "./auth-schema";

/**
 * Admin activity logs table
 * Tracks all admin actions for audit purposes
 */
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
