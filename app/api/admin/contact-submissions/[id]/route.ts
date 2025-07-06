import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema/contact-submission.table";
import { adminComments } from "@/lib/db/schema/admin-comment.table";
import { user } from "@/lib/db/schema/auth-schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { ContactSubmission } from "@/lib/types/contact/contact-submission.type";
import type { AdminCommentWithAuthor } from "@/lib/types/admin/admin-comment.type";

/**
 * Contact submission detail response type with comments
 */
export interface ContactSubmissionDetailResponse {
  submission: ContactSubmission;
  comments: AdminCommentWithAuthor[];
}

/**
 * GET endpoint - Get single contact submission with comments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can access contact submission details
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: { submission: {} as ContactSubmission, comments: [] },
          error: "Submission ID is required",
        } as ApiResponse<ContactSubmissionDetailResponse>,
        { status: 400 }
      );
    }

    // Get the contact submission
    const submissionResult = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    const submission = submissionResult[0];

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          data: { submission: {} as ContactSubmission, comments: [] },
          error: "Contact submission not found",
        } as ApiResponse<ContactSubmissionDetailResponse>,
        { status: 404 }
      );
    }

    // Get comments for this submission
    const commentsResult = await db
      .select({
        id: adminComments.id,
        entityType: adminComments.entityType,
        entityId: adminComments.entityId,
        content: adminComments.content,
        authorId: adminComments.authorId,
        isInternal: adminComments.isInternal,
        isPinned: adminComments.isPinned,
        createdAt: adminComments.createdAt,
        updatedAt: adminComments.updatedAt,
        deletedAt: adminComments.deletedAt,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(adminComments)
      .innerJoin(user, eq(adminComments.authorId, user.id))
      .where(
        and(
          eq(adminComments.entityType, "contact_submission"),
          eq(adminComments.entityId, id),
          isNull(adminComments.deletedAt)
        )
      )
      .orderBy(desc(adminComments.createdAt));

    // Automatically mark as read if status is 'new'
    if (submission.status === "new") {
      await db
        .update(contactSubmissions)
        .set({ status: "read" })
        .where(eq(contactSubmissions.id, id));

      // Update the submission object to reflect the change
      submission.status = "read";
    }

    const response: ContactSubmissionDetailResponse = {
      submission,
      comments: commentsResult,
    };

    const result: ApiResponse<ContactSubmissionDetailResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching contact submission details:", error);

    const result: ApiResponse<ContactSubmissionDetailResponse> = {
      success: false,
      data: { submission: {} as ContactSubmission, comments: [] },
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch submission details",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Update contact submission status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add authentication check - only admin users can update contact submissions
    await requireAdmin();

    const { id } = await params;
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["new", "read", "responded"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if submission exists
    const existingSubmission = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    if (existingSubmission.length === 0) {
      return NextResponse.json(
        { success: false, error: "Contact submission not found" },
        { status: 404 }
      );
    }

    // Update the submission status
    await db
      .update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Submission status updated to ${status}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating submission status:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update submission status",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
