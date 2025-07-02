import { contactSubmissions } from "@/lib/db/schema/contact-submission.table";

/**
 * TypeScript types for ContactSubmission entity
 * Generated from the contact_submissions table schema
 */

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
