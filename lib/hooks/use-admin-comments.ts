import { useState, useEffect, useCallback } from "react";
import type {
  AdminCommentWithAuthor,
  CreateCommentRequest,
  CommentEntityType,
} from "@/lib/types/admin/admin-comment.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

/**
 * Hook for managing admin comments
 * Reusable across different entity types
 */
export function useAdminComments(
  entityType: CommentEntityType,
  entityId: string
) {
  const [comments, setComments] = useState<AdminCommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch comments from API
   */
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("entityType", entityType);
      searchParams.set("entityId", entityId);

      const response = await fetch(
        `/api/admin/comments?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AdminCommentWithAuthor[]> =
        await response.json();

      if (result.success) {
        setComments(result.data);
      } else {
        setError(result.error || "Failed to fetch comments");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  /**
   * Create a new comment
   */
  const createComment = useCallback(
    async (
      content: string,
      options?: {
        isInternal?: boolean;
        isPinned?: boolean;
      }
    ) => {
      if (!content.trim()) {
        throw new Error("Comment content is required");
      }

      setIsCreating(true);

      try {
        const requestData: CreateCommentRequest = {
          entityType,
          entityId,
          content: content.trim(),
          isInternal: options?.isInternal ?? true,
          isPinned: options?.isPinned ?? false,
        };

        const response = await fetch("/api/admin/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create comment");
        }

        const result: ApiResponse<AdminCommentWithAuthor> =
          await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create comment");
        }

        // Refresh comments after successful creation
        await fetchComments();

        return result.data;
      } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [entityType, entityId, fetchComments]
  );

  // Fetch comments on mount and when dependencies change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /**
   * Get comments count
   */
  const commentsCount = comments.length;

  /**
   * Get pinned comments
   */
  const pinnedComments = comments.filter(
    (comment: AdminCommentWithAuthor) => comment.isPinned
  );

  /**
   * Get regular comments (non-pinned)
   */
  const regularComments = comments.filter(
    (comment: AdminCommentWithAuthor) => !comment.isPinned
  );

  return {
    // Data
    comments,
    pinnedComments,
    regularComments,
    commentsCount,

    // Loading states
    isLoading,
    isCreating,
    error,

    // Actions
    createComment,
    refetch: fetchComments,
  };
}

/**
 * Hook for creating comments without fetching existing ones
 * Useful for forms where you only need to create comments
 */
export function useCreateComment() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(
    async (
      entityType: CommentEntityType,
      entityId: string,
      content: string,
      options?: {
        isInternal?: boolean;
        isPinned?: boolean;
      }
    ) => {
      if (!content.trim()) {
        throw new Error("Comment content is required");
      }

      setIsCreating(true);
      setError(null);

      try {
        const requestData: CreateCommentRequest = {
          entityType,
          entityId,
          content: content.trim(),
          isInternal: options?.isInternal ?? true,
          isPinned: options?.isPinned ?? false,
        };

        const response = await fetch("/api/admin/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create comment");
        }

        const result: ApiResponse<AdminCommentWithAuthor> =
          await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create comment");
        }

        return result.data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create comment";
        setError(errorMessage);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  return {
    createComment,
    isCreating,
    error,
    clearError: () => setError(null),
  };
}
