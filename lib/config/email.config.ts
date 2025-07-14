/**
 * Email service configuration
 *
 * This file contains all configuration for the email service
 * including Resend API setup and default values
 */

import { EmailServiceConfig } from "@/lib/types/email.type";

// Environment variables validation
const requiredEnvVars = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
} as const;

// Validate required environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

/**
 * Email service configuration
 */
export const emailConfig: EmailServiceConfig = {
  apiKey: requiredEnvVars.RESEND_API_KEY!,
  defaultFromEmail: requiredEnvVars.RESEND_FROM_EMAIL!,
  defaultFromName: process.env.RESEND_FROM_NAME || "Site Wave",
  defaultReplyTo: process.env.RESEND_REPLY_TO,
  baseUrl: requiredEnvVars.NEXT_PUBLIC_SITE_URL!,
  testMode: process.env.NODE_ENV === "development",
  maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES || "3", 10),
  retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY || "1000", 10),
  timeout: parseInt(process.env.EMAIL_TIMEOUT || "30000", 10),
};

/**
 * Email template configuration
 */
export const emailTemplateConfig = {
  companyName: process.env.COMPANY_NAME || "Site Wave",
  supportEmail: process.env.SUPPORT_EMAIL || "support@example.com",
  logoUrl: process.env.EMAIL_LOGO_URL || `${emailConfig.baseUrl}/logo.png`,
  primaryColor: process.env.EMAIL_PRIMARY_COLOR || "#1a73e8",
  secondaryColor: process.env.EMAIL_SECONDARY_COLOR || "#f1f3f4",
  fontFamily: process.env.EMAIL_FONT_FAMILY || "Inter, Arial, sans-serif",
  maxWidth: process.env.EMAIL_MAX_WIDTH || "600px",
  borderRadius: process.env.EMAIL_BORDER_RADIUS || "8px",
  buttonStyle: {
    backgroundColor: process.env.EMAIL_BUTTON_COLOR || "#1a73e8",
    color: process.env.EMAIL_BUTTON_TEXT_COLOR || "#ffffff",
    padding: process.env.EMAIL_BUTTON_PADDING || "12px 24px",
    borderRadius: process.env.EMAIL_BUTTON_BORDER_RADIUS || "6px",
    fontWeight: process.env.EMAIL_BUTTON_FONT_WEIGHT || "600",
    fontSize: process.env.EMAIL_BUTTON_FONT_SIZE || "14px",
    textDecoration: "none",
  },
  footerStyle: {
    backgroundColor: process.env.EMAIL_FOOTER_BG_COLOR || "#f8f9fa",
    color: process.env.EMAIL_FOOTER_TEXT_COLOR || "#6c757d",
    padding: process.env.EMAIL_FOOTER_PADDING || "24px",
    fontSize: process.env.EMAIL_FOOTER_FONT_SIZE || "12px",
  },
} as const;

/**
 * Email rate limiting configuration
 */
export const emailRateLimitConfig = {
  maxEmailsPerMinute: parseInt(
    process.env.EMAIL_RATE_LIMIT_PER_MINUTE || "50",
    10
  ),
  maxEmailsPerHour: parseInt(
    process.env.EMAIL_RATE_LIMIT_PER_HOUR || "500",
    10
  ),
  maxEmailsPerDay: parseInt(process.env.EMAIL_RATE_LIMIT_PER_DAY || "2000", 10),
  burstLimit: parseInt(process.env.EMAIL_BURST_LIMIT || "10", 10),
} as const;

/**
 * Email queue configuration
 */
export const emailQueueConfig = {
  enabled: process.env.EMAIL_QUEUE_ENABLED !== "false",
  maxConcurrentJobs: parseInt(
    process.env.EMAIL_QUEUE_MAX_CONCURRENT || "5",
    10
  ),
  defaultPriority: process.env.EMAIL_QUEUE_DEFAULT_PRIORITY || "normal",
  retryAttempts: parseInt(process.env.EMAIL_QUEUE_RETRY_ATTEMPTS || "3", 10),
  retryDelay: parseInt(process.env.EMAIL_QUEUE_RETRY_DELAY || "5000", 10),
  cleanupInterval: parseInt(
    process.env.EMAIL_QUEUE_CLEANUP_INTERVAL || "3600000",
    10
  ), // 1 hour
  maxJobAge: parseInt(process.env.EMAIL_QUEUE_MAX_JOB_AGE || "86400000", 10), // 24 hours
} as const;

/**
 * Email analytics configuration
 */
export const emailAnalyticsConfig = {
  enabled: process.env.EMAIL_ANALYTICS_ENABLED !== "false",
  trackOpens: process.env.EMAIL_TRACK_OPENS !== "false",
  trackClicks: process.env.EMAIL_TRACK_CLICKS !== "false",
  pixelTrackingUrl: process.env.EMAIL_PIXEL_TRACKING_URL,
  linkTrackingDomain: process.env.EMAIL_LINK_TRACKING_DOMAIN,
} as const;

/**
 * Template-specific configurations
 */
export const templateConfigs = {
  userInvitation: {
    expirationHours: parseInt(
      process.env.INVITATION_EXPIRATION_HOURS || "72",
      10
    ),
    maxResends: parseInt(process.env.INVITATION_MAX_RESENDS || "3", 10),
  },
  passwordReset: {
    expirationMinutes: parseInt(
      process.env.PASSWORD_RESET_EXPIRATION_MINUTES || "15",
      10
    ),
    maxResends: parseInt(process.env.PASSWORD_RESET_MAX_RESENDS || "5", 10),
  },
  emailVerification: {
    expirationHours: parseInt(
      process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS || "24",
      10
    ),
    maxResends: parseInt(process.env.EMAIL_VERIFICATION_MAX_RESENDS || "3", 10),
  },
  contactForm: {
    notifyAdmin: process.env.CONTACT_FORM_NOTIFY_ADMIN !== "false",
    adminEmails: process.env.CONTACT_FORM_ADMIN_EMAILS?.split(",") || [],
    autoReply: process.env.CONTACT_FORM_AUTO_REPLY !== "false",
  },
} as const;

/**
 * Development and testing configuration
 */
export const devEmailConfig = {
  previewMode: process.env.NODE_ENV === "development",
  testRecipient: process.env.TEST_EMAIL_RECIPIENT,
  logEmails: process.env.LOG_EMAILS !== "false",
  bypassRateLimit: process.env.NODE_ENV === "development",
  mockMode: process.env.EMAIL_MOCK_MODE === "true",
} as const;

/**
 * Security configuration
 */
export const emailSecurityConfig = {
  requireDomainVerification:
    process.env.EMAIL_REQUIRE_DOMAIN_VERIFICATION !== "false",
  allowedDomains: process.env.EMAIL_ALLOWED_DOMAINS?.split(",") || [],
  blockedDomains: process.env.EMAIL_BLOCKED_DOMAINS?.split(",") || [],
  maxAttachmentSize: parseInt(
    process.env.EMAIL_MAX_ATTACHMENT_SIZE || "10485760",
    10
  ), // 10MB
  allowedAttachmentTypes: process.env.EMAIL_ALLOWED_ATTACHMENT_TYPES?.split(
    ","
  ) || [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "text/csv",
  ],
} as const;
