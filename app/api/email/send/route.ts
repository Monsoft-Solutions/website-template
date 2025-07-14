/**
 * Email sending API route
 *
 * This endpoint handles sending emails using the Email service
 * Supports various email templates including contact forms, user invitations, and notifications
 */

import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/email.service";
import {
  ContactFormNotificationEmailProps,
  UserInvitationEmailProps,
  SendEmailResponse,
} from "@/lib/types/email.type";
import { ApiResponse } from "@/lib/types/api-response.type";

// Request body validation schemas
type ContactFormRequest = {
  type: "contact-form";
  data: ContactFormNotificationEmailProps;
  recipients: string[];
};

type UserInvitationRequest = {
  type: "user-invitation";
  data: UserInvitationEmailProps;
  recipients: string[];
};

type SimpleEmailRequest = {
  type: "simple";
  data: {
    subject: string;
    content: string;
  };
  recipients: string[];
};

type EmailRequest =
  | ContactFormRequest
  | UserInvitationRequest
  | SimpleEmailRequest;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: EmailRequest = await request.json();

    // Validate request structure
    if (
      !body.type ||
      !body.data ||
      !body.recipients ||
      !Array.isArray(body.recipients)
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid request format. Expected: { type, data, recipients }",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate recipients
    if (body.recipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "At least one recipient is required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = body.recipients.filter(
      (email) => !emailRegex.test(email)
    );
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: `Invalid email addresses: ${invalidEmails.join(", ")}`,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Process email based on type
    const results: SendEmailResponse[] = [];

    for (const recipient of body.recipients) {
      let result: SendEmailResponse;

      switch (body.type) {
        case "contact-form":
          result = await emailService.sendTemplatedEmail(
            "contact-form-notification",
            body.data,
            {
              to: recipient,
            }
          );
          break;

        case "user-invitation":
          result = await emailService.sendTemplatedEmail(
            "user-invitation",
            body.data,
            {
              to: recipient,
            }
          );
          break;

        case "simple":
          result = await emailService.sendTemplatedEmail(
            "notification",
            {
              title: body.data.subject,
              message: body.data.content,
              severity: "info" as const,
              timestamp: new Date().toISOString(),
              companyName: "Site Wave",
              supportEmail: "support@monsoftlabs.com",
              siteUrl: "https://sitewave.com",
            },
            {
              to: recipient,
              subject: body.data.subject,
            }
          );
          break;

        default:
          return NextResponse.json(
            {
              success: false,
              data: null,
              error:
                "Invalid email type. Supported types: contact-form, user-invitation, simple",
            } as ApiResponse<null>,
            { status: 400 }
          );
      }

      results.push(result);
    }

    // Check if all emails were sent successfully
    const failedEmails = results.filter((result) => !result.success);
    if (failedEmails.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: {
            results,
            failedCount: failedEmails.length,
            successCount: results.length - failedEmails.length,
          },
          error: `Failed to send ${failedEmails.length} out of ${results.length} emails`,
        } as ApiResponse<{
          results: SendEmailResponse[];
          failedCount: number;
          successCount: number;
        }>,
        { status: 207 }
      ); // 207 Multi-Status
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        failedCount: 0,
        successCount: results.length,
      },
      message: `Successfully sent ${results.length} email(s)`,
    } as ApiResponse<{
      results: SendEmailResponse[];
      failedCount: number;
      successCount: number;
    }>);
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    data: {
      service: "email",
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    message: "Email service is operational",
  } as ApiResponse<{
    service: string;
    status: string;
    timestamp: string;
  }>);
}
