import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema/contact-submission.table";
import { contactFormSchema } from "@/lib/utils/validation";

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
 * Basic spam detection heuristics
 */
function detectSpam(data: {
  name: string;
  email: string;
  message: string;
}): boolean {
  const { name, email, message } = data;

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /viagra|cialis|casino|lottery|winner/i,
    /click here|visit now|limited time/i,
    /money back guarantee|100% free/i,
  ];

  const text = `${name} ${email} ${message}`.toLowerCase();

  // Check for spam keywords
  if (suspiciousPatterns.some((pattern) => pattern.test(text))) {
    return true;
  }

  // Check for excessive URLs
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) {
    return true;
  }

  // Check for excessive repetition
  const words = message.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.5) {
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
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many submissions. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Spam detection
    if (detectSpam({ name, email, message })) {
      console.warn(`Spam detected from IP ${clientIp}:`, {
        name,
        email,
        subject,
      });

      // Return success to avoid revealing spam detection
      return NextResponse.json({
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
      });
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
        ipAddress: clientIp !== "unknown" ? clientIp : null,
        userAgent,
        status: "new",
      })
      .returning({ id: contactSubmissions.id });

    console.log(`New contact submission from ${email} (ID: ${submission.id})`);

    // TODO: Send email notification to admin
    // This would be implemented with your email service (Resend, NodeMailer, etc.)

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
