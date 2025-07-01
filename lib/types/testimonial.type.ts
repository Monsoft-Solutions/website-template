/**
 * Represents a customer testimonial for a service
 */
export type Testimonial = {
  /** The testimonial quote/content */
  readonly quote: string;
  /** Name of the person giving the testimonial */
  readonly author: string;
  /** Company/organization of the testimonial author */
  readonly company: string;
  /** Optional avatar image URL for the testimonial author */
  readonly avatar?: string;
};
