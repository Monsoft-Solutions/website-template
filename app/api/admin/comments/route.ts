import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminComments } from "@/lib/db/schema/admin-comment.table";
import { user } from "@/lib/db/schema/auth-schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  AdminCommentWithAuthor,
  CreateCommentRequest,
  CommentEntityType,
} from "@/lib/types/admin/admin-comment.type";

/**
 * GET endpoint - Get comments for a specific entity
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Authentication required",
        } as ApiResponse<AdminCommentWithAuthor[]>,
        { status: 401 }
      );
    }

    // Check admin privileges
    if (currentUser.role !== "admin" && currentUser.role !== "editor") {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Admin privileges required",
        } as ApiResponse<AdminCommentWithAuthor[]>,
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType") as CommentEntityType;
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Entity type and ID are required",
        } as ApiResponse<AdminCommentWithAuthor[]>,
        { status: 400 }
      );
    }

    // Get comments for the specified entity
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
          eq(adminComments.entityType, entityType),
          eq(adminComments.entityId, entityId),
          isNull(adminComments.deletedAt)
        )
      )
      .orderBy(desc(adminComments.createdAt));

    const result: ApiResponse<AdminCommentWithAuthor[]> = {
      success: true,
      data: commentsResult,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching comments:", error);

    const result: ApiResponse<AdminCommentWithAuthor[]> = {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch comments",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST endpoint - Create a new comment
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminCommentWithAuthor,
          error: "Authentication required",
        } as ApiResponse<AdminCommentWithAuthor>,
        { status: 401 }
      );
    }

    // Check admin privileges
    if (currentUser.role !== "admin" && currentUser.role !== "editor") {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminCommentWithAuthor,
          error: "Admin privileges required",
        } as ApiResponse<AdminCommentWithAuthor>,
        { status: 403 }
      );
    }

    const body: CreateCommentRequest = await request.json();
    const {
      entityType,
      entityId,
      content,
      isInternal = true,
      isPinned = false,
    } = body;

    if (!entityType || !entityId || !content) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminCommentWithAuthor,
          error: "Entity type, entity ID, and content are required",
        } as ApiResponse<AdminCommentWithAuthor>,
        { status: 400 }
      );
    }

    // Create the comment with the authenticated user's ID
    const newCommentResult = await db
      .insert(adminComments)
      .values({
        entityType,
        entityId,
        content,
        authorId: currentUser.id, // Use the authenticated user's ID
        isInternal,
        isPinned,
      })
      .returning();

    const newComment = newCommentResult[0];

    // Get the comment with author details
    const commentWithAuthor = await db
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
      .where(eq(adminComments.id, newComment.id))
      .limit(1);

    const result: ApiResponse<AdminCommentWithAuthor> = {
      success: true,
      data: commentWithAuthor[0],
      message: "Comment created successfully",
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);

    const result: ApiResponse<AdminCommentWithAuthor> = {
      success: false,
      data: {} as AdminCommentWithAuthor,
      error:
        error instanceof Error ? error.message : "Failed to create comment",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
