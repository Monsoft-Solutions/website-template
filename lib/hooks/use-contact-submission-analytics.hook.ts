import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { ContactSubmissionAnalyticsResponse } from "@/app/api/admin/contact-submissions/analytics/route";

type AnalyticsTimePeriod = "today" | "week" | "month" | "quarter" | "year";

interface UseContactSubmissionAnalyticsOptions {
  period?: AnalyticsTimePeriod;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseContactSubmissionAnalyticsReturn {
  data: ContactSubmissionAnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching contact submission analytics data
 */
export function useContactSubmissionAnalytics(
  options: UseContactSubmissionAnalyticsOptions = {}
): UseContactSubmissionAnalyticsReturn {
  const {
    period = "month",
    autoRefresh = false,
    refreshInterval = 30000,
  } = options;

  const [data, setData] = useState<ContactSubmissionAnalyticsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (period) searchParams.set("period", period);

      const response = await fetch(
        `/api/admin/contact-submissions/analytics?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ContactSubmissionAnalyticsResponse> =
        await response.json();

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(
          result.error || "Failed to fetch contact submission analytics"
        );
        setData(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchAnalytics, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
