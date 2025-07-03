import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Enum for contact form submission status values
 * Used to track the processing state of contact form submissions
 */
export const submissionStatusEnum = pgEnum("submission_status", [
  "new",
  "read",
  "responded",
]);
