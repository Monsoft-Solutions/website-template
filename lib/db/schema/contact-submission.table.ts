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
 * Extended to support enhanced form with project details
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),

  // Enhanced form fields
  company: varchar("company", { length: 255 }),
  projectType: varchar("project_type", { length: 50 }),
  budget: varchar("budget", { length: 50 }),
  timeline: varchar("timeline", { length: 50 }),

  // System fields
  status: submissionStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
});
