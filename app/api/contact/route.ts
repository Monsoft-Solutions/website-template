import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema/contact-submission.table";
import {
  contactFormSchema,
  enhancedContactFormSchema,
  type EnhancedContactFormData,
} from "@/lib/utils/contact-form-validation";
import { ApiResponse } from "@/lib/types/api-response.type";
import { ContactSubmissionResponse } from "@/lib/types/contact-submission.type";

// Rate limiting storage (in production, use Redis or a database)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per 15 minutes per IP

/**
 * Simple in-memory rate limiting
 * In production, use Redis or a proper rate limiting service
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rateLimitData = rateLimitMap.get(ip);

  if (!rateLimitData) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  // Reset count if window has passed
  if (now - rateLimitData.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  // Check if limit exceeded
  if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Increment count
  rateLimitData.count++;
  return false;
}

/**
 * Simple spam detection for contact forms
 * This is just a basic implementation and should be expanded
 * with a more robust solution in production
 */
function detectSpam(data: {
  name: string;
  email: string;
  message: string;
}): boolean {
  const { name, email, message } = data;

  // Check for common spam indicators
  const spamPatterns = [
    /\b(viagra|cialis|crypto|casino|porn|xxx|seo|loan|dating|sex|free money)\b/i,
    /\b(buy|cheap|free|discount|wholesale|sell)\b.{0,20}\b(watches|drugs|medicine|pills)\b/i,
    /https?:\/\/\S+/g, // Multiple links in message
  ];

  // Check content against patterns
  for (const pattern of spamPatterns) {
    if (pattern.test(name) || pattern.test(email) || pattern.test(message)) {
      return true;
    }
  }

  // Count links in message - too many links is often spam
  const linkMatches = message.match(/https?:\/\/\S+/g);
  if (linkMatches && linkMatches.length > 3) {
    return true;
  }

  return false;
}

/**
 * GET endpoint - Method not allowed
 */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/**
 * POST endpoint - Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP address
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown";

    // Apply rate limiting
    if (isRateLimited(clientIp)) {
      const response: ApiResponse<ContactSubmissionResponse> = {
        success: false,
        data: {} as ContactSubmissionResponse,
        error: "Rate limit exceeded",
        message: "Too many submissions. Please try again later.",
      };
      return NextResponse.json(response, { status: 429 });
    }

    // Parse and validate request body
    const body = await request.json();

    // Try enhanced schema first, fallback to basic schema for backward compatibility
    let validationResult = enhancedContactFormSchema.safeParse(body);
    let isEnhanced = true;

    if (!validationResult.success) {
      validationResult = contactFormSchema.safeParse(body);
      isEnhanced = false;
    }

    if (!validationResult.success) {
      const response: ApiResponse<ContactSubmissionResponse> = {
        success: false,
        data: {} as ContactSubmissionResponse,
        error: "Validation failed",
        message: validationResult.error.errors.map((e) => e.message).join(", "),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { name, email, subject, message } = validationResult.data;

    // Extract enhanced fields if available
    const enhancedData = isEnhanced
      ? (validationResult.data as EnhancedContactFormData)
      : null;
    const company = enhancedData?.company || null;
    const projectType = enhancedData?.projectType || null;
    const budget = enhancedData?.budget || null;
    const timeline = enhancedData?.timeline || null;

    // Spam detection
    if (detectSpam({ name, email, message })) {
      console.warn(`Spam detected from IP ${clientIp}:`, {
        name,
        email,
        subject,
      });

      // Return success to avoid revealing spam detection
      const response: ApiResponse<ContactSubmissionResponse> = {
        success: true,
        data: { submissionId: "generated" }, // Fake ID to avoid revealing spam detection
        message: "Thank you for your message. We'll get back to you soon!",
      };
      return NextResponse.json(response);
    }

    // Get user agent for tracking
    const userAgent = headersList.get("user-agent") || null;

    // Insert into database
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        name,
        email,
        subject: subject || null,
        message,
        company,
        projectType,
        budget,
        timeline,
        ipAddress: clientIp !== "unknown" ? clientIp : null,
        userAgent,
        status: "new",
      })
      .returning({ id: contactSubmissions.id });

    console.log(`New contact submission from ${email} (ID: ${submission.id})`);

    // TODO: Send email notification to admin
    // This would be implemented with your email service (Resend, NodeMailer, etc.)

    const response: ApiResponse<ContactSubmissionResponse> = {
      success: true,
      data: {
        submissionId: submission.id,
      },
      message: "Thank you for your message. We'll get back to you soon!",
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Contact form submission error:", error);

    const response: ApiResponse<ContactSubmissionResponse> = {
      success: false,
      data: {} as ContactSubmissionResponse,
      error: "Internal server error",
      message: "Something went wrong. Please try again later.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
