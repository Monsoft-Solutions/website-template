import { useState, useEffect, useCallback } from "react";
import type {
  AdminCommentWithAuthor,
  CreateCommentRequest,
  CommentEntityType,
} from "@/lib/types/admin/admin-comment.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

// Constants for error messages and validation
const ERROR_MESSAGES = {
  CONTENT_REQUIRED: "Comment content is required",
  FETCH_FAILED: "Failed to fetch comments",
  CREATE_FAILED: "Failed to create comment",
  GENERIC_ERROR: "An error occurred",
  INVALID_ENTITY_ID: "Entity ID must be a non-empty string",
  INVALID_CONTENT: "Comment content must be a non-empty string",
} as const;

const VALIDATION = {
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 10000,
} as const;

// Type definitions for hook return values
interface UseAdminCommentsReturn {
  // Data
  comments: AdminCommentWithAuthor[];
  pinnedComments: AdminCommentWithAuthor[];
  regularComments: AdminCommentWithAuthor[];
  commentsCount: number;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;

  // Actions
  createComment: (
    content: string,
    options?: {
      isInternal?: boolean;
      isPinned?: boolean;
    }
  ) => Promise<AdminCommentWithAuthor>;
  refetch: () => Promise<void>;
}

interface UseCreateCommentReturn {
  createComment: (
    entityType: CommentEntityType,
    entityId: string,
    content: string,
    options?: {
      isInternal?: boolean;
      isPinned?: boolean;
    }
  ) => Promise<AdminCommentWithAuthor>;
  isCreating: boolean;
  error: string | null;
  clearError: () => void;
}

interface CommentOptions {
  isInternal?: boolean;
  isPinned?: boolean;
}

/**
 * Validates comment content
 */
const validateContent = (content: string): void => {
  if (!content || typeof content !== "string") {
    throw new Error(ERROR_MESSAGES.CONTENT_REQUIRED);
  }

  const trimmedContent = content.trim();
  if (trimmedContent.length < VALIDATION.MIN_CONTENT_LENGTH) {
    throw new Error(ERROR_MESSAGES.INVALID_CONTENT);
  }

  if (trimmedContent.length > VALIDATION.MAX_CONTENT_LENGTH) {
    throw new Error(
      `Comment content must be less than ${VALIDATION.MAX_CONTENT_LENGTH} characters`
    );
  }
};

/**
 * Validates entity ID
 */
const validateEntityId = (entityId: string): void => {
  if (
    !entityId ||
    typeof entityId !== "string" ||
    entityId.trim().length === 0
  ) {
    throw new Error(ERROR_MESSAGES.INVALID_ENTITY_ID);
  }
};

/**
 * Hook for managing admin comments
 * Reusable across different entity types
 */
export function useAdminComments(
  entityType: CommentEntityType,
  entityId: string
): UseAdminCommentsReturn {
  const [comments, setComments] = useState<AdminCommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch comments from API
   */
  const fetchComments = useCallback(async (): Promise<void> => {
    // Validate inputs
    validateEntityId(entityId);

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
        setError(result.error || ERROR_MESSAGES.FETCH_FAILED);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      console.error("Error fetching comments:", err);
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
      options: CommentOptions = {}
    ): Promise<AdminCommentWithAuthor> => {
      // Validate inputs
      validateContent(content);
      validateEntityId(entityId);

      setIsCreating(true);

      try {
        const requestData: CreateCommentRequest = {
          entityType,
          entityId,
          content: content.trim(),
          isInternal: options.isInternal ?? true,
          isPinned: options.isPinned ?? false,
        };

        const response = await fetch("/api/admin/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || ERROR_MESSAGES.CREATE_FAILED);
        }

        const result: ApiResponse<AdminCommentWithAuthor> =
          await response.json();

        if (!result.success) {
          throw new Error(result.error || ERROR_MESSAGES.CREATE_FAILED);
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
  const commentsCount: number = comments.length;

  /**
   * Get pinned comments
   */
  const pinnedComments: AdminCommentWithAuthor[] = comments.filter(
    (comment: AdminCommentWithAuthor) => comment.isPinned
  );

  /**
   * Get regular comments (non-pinned)
   */
  const regularComments: AdminCommentWithAuthor[] = comments.filter(
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
export function useCreateComment(): UseCreateCommentReturn {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(
    async (
      entityType: CommentEntityType,
      entityId: string,
      content: string,
      options: CommentOptions = {}
    ): Promise<AdminCommentWithAuthor> => {
      // Validate inputs
      validateContent(content);
      validateEntityId(entityId);

      setIsCreating(true);
      setError(null);

      try {
        const requestData: CreateCommentRequest = {
          entityType,
          entityId,
          content: content.trim(),
          isInternal: options.isInternal ?? true,
          isPinned: options.isPinned ?? false,
        };

        const response = await fetch("/api/admin/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || ERROR_MESSAGES.CREATE_FAILED);
        }

        const result: ApiResponse<AdminCommentWithAuthor> =
          await response.json();

        if (!result.success) {
          throw new Error(result.error || ERROR_MESSAGES.CREATE_FAILED);
        }

        return result.data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_FAILED;
        setError(errorMessage);
        console.error("Error creating comment:", error);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    createComment,
    isCreating,
    error,
    clearError,
  };
}
