"use client";

import { useState, useEffect } from "react";
import {
  ApiResponse,
  AnalyticsResponse,
  AnalyticsTimePeriod,
} from "@/lib/types";
import { getBaseUrl } from "@/lib/utils/url.util";

/**
 * Hook for fetching analytics data for dashboard
 */
export function useAnalytics(period: AnalyticsTimePeriod = "month") {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true);
      try {
        // Build API URL with period parameter
        const apiParams = new URLSearchParams();
        apiParams.set("period", period);

        // Fetch data
        const response = await fetch(
          `${baseUrl}/api/admin/analytics?${apiParams.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const result: ApiResponse<AnalyticsResponse> = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch analytics data");
          setData(null);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [period, baseUrl]);

  return { data, isLoading, error };
}

/**
 * Hook for recording views
 */
export function useRecordView() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const baseUrl = getBaseUrl();

  const recordView = async (
    contentType: "blog_post" | "service",
    contentId: string
  ) => {
    setIsRecording(true);
    try {
      const response = await fetch(`${baseUrl}/api/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          contentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(
          "Failed to record view:",
          errorData.error || response.status
        );
        return false;
      }

      const result: ApiResponse<unknown> = await response.json();
      return result.success;
    } catch (error) {
      console.warn("Failed to record view:", error);
      return false;
    } finally {
      setIsRecording(false);
    }
  };

  return { recordView, isRecording };
}
