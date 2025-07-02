import { ApiResponse } from "./api-response.type";

/**
 * Contact submission response type
 * Contains the data returned after submitting a contact form
 */
export type ContactSubmissionResponse = {
  submissionId: string;
};

/**
 * Type for contact form API response
 */
export type ContactFormResponse = ApiResponse<ContactSubmissionResponse>;
