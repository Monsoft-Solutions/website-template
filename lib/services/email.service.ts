/**
 * Email service using Resend API
 *
 * This service handles all email sending functionality including:
 * - Template rendering
 * - Email sending
 * - Error handling and retries
 * - Rate limiting
 * - Analytics tracking
 */

import { Resend } from "resend";
import { render } from "@react-email/render";
import {
  EmailConfig,
  EmailTemplateType,
  EmailTemplateProps,
  SendEmailResponse,
  EmailStatusResponse,
  EmailTemplateValidation,
  EmailAnalytics,
  BulkEmailOperation,
  UserInvitationEmailProps,
  ContactFormNotificationEmailProps,
  ContactFormConfirmationEmailProps,
  WelcomeEmailProps,
  PasswordResetEmailProps,
  EmailVerificationProps,
  NotificationEmailProps,
} from "@/lib/types/email.type";
import {
  emailConfig,
  devEmailConfig,
  emailSecurityConfig,
} from "@/lib/config/email.config";
import { ReactElement } from "react";

// Initialize Resend client
const resend = new Resend(emailConfig.apiKey);

/**
 * Email service class
 */
export class EmailService {
  private static instance: EmailService;
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> =
    new Map();

  constructor() {
    if (EmailService.instance) {
      return EmailService.instance;
    }
    EmailService.instance = this;
  }

  /**
   * Send an email using a template
   */
  async sendTemplatedEmail(
    templateType: EmailTemplateType,
    templateProps: EmailTemplateProps,
    config: Partial<EmailConfig> = {}
  ): Promise<SendEmailResponse> {
    try {
      // Validate template props
      const validation = this.validateTemplateProps(
        templateType,
        templateProps
      );
      if (!validation.isValid) {
        return {
          success: false,
          data: {} as SendEmailResponse["data"],
          error: `Template validation failed: ${validation.errors.join(", ")}`,
        };
      }

      // Get template component
      const template = await this.getTemplateComponent(
        templateType,
        templateProps
      );
      if (!template) {
        return {
          success: false,
          data: {} as SendEmailResponse["data"],
          error: `Template not found: ${templateType}`,
        };
      }

      // Render template to HTML
      const html = await this.renderTemplate(template);

      // Prepare email configuration
      const emailConfig = this.prepareEmailConfig(config);

      // Check rate limits
      const rateLimitCheck = this.checkRateLimit(emailConfig.to);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          data: {} as SendEmailResponse["data"],
          error: `Rate limit exceeded. Reset in ${rateLimitCheck.resetIn} seconds`,
        };
      }

      // Send email
      return await this.sendEmail({
        ...emailConfig,
        html,
        subject: config.subject || this.getDefaultSubject(templateType),
      });
    } catch (error) {
      console.error("Failed to send templated email:", error);
      return {
        success: false,
        data: {} as SendEmailResponse["data"],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Send a raw email
   */
  async sendEmail(
    config: EmailConfig & { html: string }
  ): Promise<SendEmailResponse> {
    try {
      // Security checks
      if (!this.isEmailAllowed(config.to)) {
        return {
          success: false,
          data: {} as SendEmailResponse["data"],
          error: "Email recipient not allowed",
        };
      }

      // Override recipient in development
      const finalConfig = {
        ...config,
        to: config.to,
      };

      // Prepare Resend payload
      const resendPayload = {
        from: finalConfig.from,
        to: Array.isArray(finalConfig.to) ? finalConfig.to : [finalConfig.to],
        subject: finalConfig.subject,
        html: finalConfig.html,
        replyTo: finalConfig.replyTo,
        cc: finalConfig.cc,
        bcc: finalConfig.bcc,
        attachments: finalConfig.attachments,
        headers: finalConfig.headers,
        scheduledAt: finalConfig.scheduledAt,
        tags: finalConfig.tags,
      };

      // Send email with retries
      const result = await this.sendWithRetries(resendPayload);

      if (result.error) {
        return {
          success: false,
          data: {} as SendEmailResponse["data"],
          error: result.error.message || "Failed to send email",
        };
      }

      // Update rate limit tracker
      this.updateRateLimit(finalConfig.to);

      // Log in development
      if (devEmailConfig.logEmails) {
        console.log("📧 Email sent successfully:", {
          id: result.data?.id,
          to: finalConfig.to,
          subject: finalConfig.subject,
        });
      }

      return {
        success: true,
        data: {
          id: result.data?.id || "",
          messageId: result.data?.id || "",
          to: Array.isArray(finalConfig.to) ? finalConfig.to : [finalConfig.to],
          from: finalConfig.from,
          subject: finalConfig.subject,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        data: {} as SendEmailResponse["data"],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get email status
   */
  async getEmailStatus(emailId: string): Promise<EmailStatusResponse> {
    try {
      // Note: Resend doesn't provide email status API yet
      // This is a placeholder for future implementation
      return {
        success: true,
        data: {
          id: emailId,
          status: "sent",
          events: [],
          createdAt: new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {} as EmailStatusResponse["data"],
        error:
          error instanceof Error ? error.message : "Failed to get email status",
      };
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(
    operation: BulkEmailOperation
  ): Promise<SendEmailResponse[]> {
    const results: SendEmailResponse[] = [];
    const {
      recipients,
      templateType,
      commonConfig,
      batchSize = 10,
      delayBetweenBatches = 1000,
    } = operation;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const batchPromises = batch.map((recipient) =>
        this.sendTemplatedEmail(templateType, recipient.templateProps, {
          ...commonConfig,
          to: recipient.email,
        })
      );

      const batchResults = await Promise.allSettled(batchPromises);

      results.push(
        ...batchResults.map((result) =>
          result.status === "fulfilled"
            ? result.value
            : {
                success: false,
                data: {} as SendEmailResponse["data"],
                error: result.reason?.message || "Failed to send email",
              }
        )
      );

      // Add delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenBatches)
        );
      }
    }

    return results;
  }

  /**
   * Get email analytics
   */
  async getEmailAnalytics(
    startDate: string,
    endDate: string
  ): Promise<EmailAnalytics> {
    // Note: This is a placeholder as Resend doesn't provide analytics API yet
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalBounced: 0,
      totalComplaints: 0,
      deliveryRate: 0,
      bounceRate: 0,
      complaintRate: 0,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Private helper methods
   */
  private async sendWithRetries(
    payload: Parameters<typeof resend.emails.send>[0]
  ): Promise<{ data?: { id: string } | null; error?: Error | null }> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= emailConfig.maxRetries; attempt++) {
      try {
        const result = await resend.emails.send(payload);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (attempt < emailConfig.maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, emailConfig.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError;
  }

  private checkRateLimit(recipient: string | string[]): {
    allowed: boolean;
    resetIn: number;
  } {
    if (devEmailConfig.bypassRateLimit) {
      return { allowed: true, resetIn: 0 };
    }

    const key = Array.isArray(recipient) ? recipient[0] : recipient;
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(key);

    if (!tracker || now > tracker.resetTime) {
      this.rateLimitTracker.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute
      return { allowed: true, resetIn: 0 };
    }

    if (tracker.count >= 10) {
      // 10 emails per minute limit
      return {
        allowed: false,
        resetIn: Math.ceil((tracker.resetTime - now) / 1000),
      };
    }

    tracker.count++;
    return { allowed: true, resetIn: 0 };
  }

  private updateRateLimit(recipient: string | string[]): void {
    if (devEmailConfig.bypassRateLimit) return;

    const key = Array.isArray(recipient) ? recipient[0] : recipient;
    const tracker = this.rateLimitTracker.get(key);

    if (tracker) {
      tracker.count++;
    }
  }

  private isEmailAllowed(recipient: string | string[]): boolean {
    const emails = Array.isArray(recipient) ? recipient : [recipient];

    for (const email of emails) {
      // Check blocked domains
      if (emailSecurityConfig.blockedDomains.length > 0) {
        const domain = email.split("@")[1];
        if (emailSecurityConfig.blockedDomains.includes(domain)) {
          return false;
        }
      }
    }

    return true;
  }

  private prepareEmailConfig(config: Partial<EmailConfig>): EmailConfig {
    const output = {
      from:
        config.from ||
        `${emailConfig.defaultFromName} <${emailConfig.defaultFromEmail}>`,
      to: config.to || "",
      subject: config.subject || "",
      replyTo: config.replyTo || emailConfig.defaultReplyTo,
      cc: config.cc,
      bcc: config.bcc,
      attachments: config.attachments,
      headers: config.headers,
      scheduledAt: config.scheduledAt,
      tags: config.tags,
    };

    console.log(" EMail Config output", output);

    return output;
  }

  private validateTemplateProps(
    templateType: EmailTemplateType,
    props: EmailTemplateProps
  ): EmailTemplateValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Add template-specific validation logic here
    switch (templateType) {
      case "user-invitation":
        if ("inviterName" in props && !props.inviterName)
          errors.push("inviterName is required");
        if ("invitationUrl" in props && !props.invitationUrl)
          errors.push("invitationUrl is required");
        break;
      case "contact-form-notification":
        if ("senderName" in props && !props.senderName)
          errors.push("senderName is required");
        if ("senderEmail" in props && !props.senderEmail)
          errors.push("senderEmail is required");
        if ("message" in props && !props.message)
          errors.push("message is required");
        break;
      // Add more validations as needed
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private async getTemplateComponent(
    templateType: EmailTemplateType,
    props: EmailTemplateProps
  ): Promise<ReactElement | null> {
    try {
      // Dynamic import of template components
      const {
        UserInvitationTemplate,
        ContactFormNotificationTemplate,
        ContactFormConfirmationTemplate,
        WelcomeTemplate,
        PasswordResetTemplate,
        EmailVerificationTemplate,
        NotificationTemplate,
      } = await import("@/lib/email/templates");

      switch (templateType) {
        case "user-invitation":
          return UserInvitationTemplate(props as UserInvitationEmailProps);
        case "contact-form-notification":
          return ContactFormNotificationTemplate(
            props as ContactFormNotificationEmailProps
          );
        case "contact-form-confirmation":
          return ContactFormConfirmationTemplate(
            props as ContactFormConfirmationEmailProps
          );
        case "welcome":
          return WelcomeTemplate(props as WelcomeEmailProps);
        case "password-reset":
          return PasswordResetTemplate(props as PasswordResetEmailProps);
        case "email-verification":
          return EmailVerificationTemplate(props as EmailVerificationProps);
        case "notification":
          return NotificationTemplate(props as NotificationEmailProps);
        default:
          return null;
      }
    } catch (error) {
      console.error("Failed to load template component:", error);
      return null;
    }
  }

  private async renderTemplate(template: ReactElement): Promise<string> {
    try {
      return await render(template);
    } catch (error) {
      console.error("Failed to render template:", error);
      throw new Error("Template rendering failed");
    }
  }

  private getDefaultSubject(templateType: EmailTemplateType): string {
    const subjects = {
      "user-invitation": "You're invited to join our platform",
      "contact-form-notification": "New contact form submission",
      "contact-form-confirmation": "We've received your message - Thank you!",
      welcome: "Welcome to our platform",
      "password-reset": "Reset your password",
      "email-verification": "Verify your email address",
      notification: "Important notification",
    };

    return subjects[templateType] || "Notification";
  }
}

// Export singleton instance
export const emailService = new EmailService();
