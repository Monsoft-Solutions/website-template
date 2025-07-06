import { useState, useEffect, useCallback } from "react";
import type { ContactSubmission } from "@/lib/types/contact/contact-submission.type";
import type { AdminCommentWithAuthor } from "@/lib/types/admin/admin-comment.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { ContactSubmissionDetailResponse } from "@/app/api/admin/contact-submissions/[id]/route";

interface UseContactSubmissionDetailReturn {
  submission: ContactSubmission | null;
  comments: AdminCommentWithAuthor[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateStatus: (status: "new" | "read" | "responded") => Promise<void>;
  isUpdatingStatus: boolean;
}

/**
 * Custom hook for fetching contact submission details with comments
 */
export function useContactSubmissionDetail(
  id: string
): UseContactSubmissionDetailReturn {
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [comments, setComments] = useState<AdminCommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch submission details from API
   */
  const fetchSubmissionDetails = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Contact submission not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ContactSubmissionDetailResponse> =
        await response.json();

      if (result.success) {
        setSubmission(result.data.submission);
        setComments(result.data.comments);
      } else {
        setError(result.error || "Failed to fetch submission details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  /**
   * Update submission status
   */
  const updateStatus = useCallback(
    async (status: "new" | "read" | "responded") => {
      if (!id || !submission) return;

      setIsUpdatingStatus(true);

      try {
        const response = await fetch(`/api/admin/contact-submissions/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update status");
        }

        const result: ApiResponse<null> = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to update status");
        }

        // Update the submission status locally
        setSubmission((prev) => (prev ? { ...prev, status } : null));
      } catch (error) {
        console.error("Error updating submission status:", error);
        throw error;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [id, submission]
  );

  // Fetch submission details on mount and when ID changes
  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

  return {
    submission,
    comments,
    isLoading,
    error,
    refetch: fetchSubmissionDetails,
    updateStatus,
    isUpdatingStatus,
  };
}
