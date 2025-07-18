import { useState, useEffect, useCallback } from "react";
import type { ContactSubmission } from "@/lib/types/contact/contact-submission.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { AdminContactSubmissionsListResponse } from "@/app/api/admin/contact-submissions/route";

interface UseAdminContactSubmissionsOptions {
  page?: number;
  limit?: number;
  status?: "new" | "read" | "responded";
  searchQuery?: string;
  projectType?: string;
  budget?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "name" | "email" | "status" | "company" | "createdAt";
  sortOrder?: "asc" | "desc";
}

interface UseAdminContactSubmissionsReturn {
  submissions: ContactSubmission[];
  totalSubmissions: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  statusCounts: {
    new: number;
    read: number;
    responded: number;
  };
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching admin contact submissions with pagination and filtering
 */
export function useAdminContactSubmissions(
  options: UseAdminContactSubmissionsOptions = {}
): UseAdminContactSubmissionsReturn {
  const [data, setData] = useState<AdminContactSubmissionsListResponse>({
    submissions: [],
    totalSubmissions: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    statusCounts: { new: 0, read: 0, responded: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      // Add parameters to search params
      if (options.page) searchParams.set("page", options.page.toString());
      if (options.limit) searchParams.set("limit", options.limit.toString());
      if (options.status) searchParams.set("status", options.status);
      if (options.searchQuery)
        searchParams.set("searchQuery", options.searchQuery);
      if (options.projectType)
        searchParams.set("projectType", options.projectType);
      if (options.budget) searchParams.set("budget", options.budget);
      if (options.dateFrom) searchParams.set("dateFrom", options.dateFrom);
      if (options.dateTo) searchParams.set("dateTo", options.dateTo);
      if (options.sortBy) searchParams.set("sortBy", options.sortBy);
      if (options.sortOrder) searchParams.set("sortOrder", options.sortOrder);

      const response = await fetch(
        `/api/admin/contact-submissions?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AdminContactSubmissionsListResponse> =
        await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch contact submissions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [
    options.page,
    options.limit,
    options.status,
    options.searchQuery,
    options.projectType,
    options.budget,
    options.dateFrom,
    options.dateTo,
    options.sortBy,
    options.sortOrder,
  ]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions: data.submissions,
    totalSubmissions: data.totalSubmissions,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    hasNextPage: data.hasNextPage,
    hasPreviousPage: data.hasPreviousPage,
    statusCounts: data.statusCounts,
    isLoading,
    error,
    refetch: fetchSubmissions,
  };
}
