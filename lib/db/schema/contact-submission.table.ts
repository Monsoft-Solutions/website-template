import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  inet,
} from "drizzle-orm/pg-core";
import { submissionStatusEnum } from "@/lib/db/schema/enums/submission-status.enum";

/**
 * Contact form submissions table for storing user inquiries
 * Tracks contact form data with metadata for administration
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: submissionStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
});
