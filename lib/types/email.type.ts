/**
 * Email service type definitions
 *
 * This file contains all type definitions for the email service
 * including email templates, configuration, and API responses
 */

import { ApiResponse } from "@/lib/types/api-response.type";

/**
 * Base email configuration
 */
export type EmailConfig = {
  from: string;
  to: string | string[];
  subject: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  scheduledAt?: string;
  tags?: EmailTag[];
};

/**
 * Email attachment type
 */
export type EmailAttachment = {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  encoding?: string;
};

/**
 * Email tag for categorization and tracking
 */
export type EmailTag = {
  name: string;
  value: string;
};

/**
 * Email template base props
 */
export type BaseEmailTemplateProps = {
  recipientName?: string;
  companyName?: string;
  siteUrl?: string;
  supportEmail?: string;
  unsubscribeUrl?: string;
};

/**
 * User invitation email template props
 */
export type UserInvitationEmailProps = BaseEmailTemplateProps & {
  inviterName: string;
  inviterEmail: string;
  invitationUrl: string;
  role: string;
  expiresAt: string;
};

/**
 * Contact form notification email template props
 */
export type ContactFormNotificationEmailProps = BaseEmailTemplateProps & {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  formUrl?: string;
  submittedAt: string;
  userAgent?: string;
  ipAddress?: string;
};

/**
 * Contact form confirmation email template props
 */
export type ContactFormConfirmationEmailProps = BaseEmailTemplateProps & {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submittedAt: string;
  responseTime?: string;
};

/**
 * Welcome email template props
 */
export type WelcomeEmailProps = BaseEmailTemplateProps & {
  userName: string;
  userEmail: string;
  dashboardUrl: string;
  onboardingUrl?: string;
  resourcesUrl?: string;
};

/**
 * Password reset email template props
 */
export type PasswordResetEmailProps = BaseEmailTemplateProps & {
  resetUrl: string;
  expiresAt: string;
  userEmail: string;
  ipAddress?: string;
};

/**
 * Email verification template props
 */
export type EmailVerificationProps = BaseEmailTemplateProps & {
  verificationUrl: string;
  userEmail: string;
  expiresAt: string;
};

/**
 * Notification email template props
 */
export type NotificationEmailProps = BaseEmailTemplateProps & {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  severity: "info" | "warning" | "error" | "success";
  timestamp: string;
};

/**
 * Union type for all email template props
 */
export type EmailTemplateProps =
  | UserInvitationEmailProps
  | ContactFormNotificationEmailProps
  | ContactFormConfirmationEmailProps
  | WelcomeEmailProps
  | PasswordResetEmailProps
  | EmailVerificationProps
  | NotificationEmailProps;

/**
 * Email template types
 */
export type EmailTemplateType =
  | "user-invitation"
  | "contact-form-notification"
  | "contact-form-confirmation"
  | "welcome"
  | "password-reset"
  | "email-verification"
  | "notification";

/**
 * Email service response types
 */
export type SendEmailResponse = ApiResponse<{
  id: string;
  messageId: string;
  to: string[];
  from: string;
  subject: string;
  createdAt: string;
}>;

/**
 * Email status check response
 */
export type EmailStatusResponse = ApiResponse<{
  id: string;
  status: "sent" | "delivered" | "bounced" | "complained" | "failed";
  events: EmailEvent[];
  createdAt: string;
  lastUpdate: string;
}>;

/**
 * Email event for tracking
 */
export type EmailEvent = {
  type: "sent" | "delivered" | "bounced" | "complained" | "clicked" | "opened";
  timestamp: string;
  data?: Record<string, string | number | boolean>;
};

/**
 * Email template validation result
 */
export type EmailTemplateValidation = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Email service configuration
 */
export type EmailServiceConfig = {
  apiKey: string;
  defaultFromEmail: string;
  defaultFromName: string;
  defaultReplyTo?: string;
  baseUrl: string;
  testMode: boolean;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
};

/**
 * Email queue job
 */
export type EmailQueueJob = {
  id: string;
  templateType: EmailTemplateType;
  templateProps: EmailTemplateProps;
  emailConfig: EmailConfig;
  priority: "low" | "normal" | "high" | "urgent";
  scheduledAt?: string;
  maxAttempts: number;
  createdAt: string;
  status: "pending" | "processing" | "completed" | "failed";
  attempts: number;
  lastAttempt?: string;
  error?: string;
};

/**
 * Bulk email operation
 */
export type BulkEmailOperation = {
  templateType: EmailTemplateType;
  recipients: Array<{
    email: string;
    templateProps: EmailTemplateProps;
  }>;
  commonConfig: Partial<EmailConfig>;
  batchSize: number;
  delayBetweenBatches: number;
};

/**
 * Email analytics data
 */
export type EmailAnalytics = {
  totalSent: number;
  totalDelivered: number;
  totalBounced: number;
  totalComplaints: number;
  deliveryRate: number;
  bounceRate: number;
  complaintRate: number;
  openRate?: number;
  clickRate?: number;
  period: {
    startDate: string;
    endDate: string;
  };
};
