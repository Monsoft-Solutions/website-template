/**
 * React hook for Google Indexing operations
 * Provides functions to notify Google about content updates
 */

import { useState, useCallback } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import {
  IndexingOperationResponse,
  BulkIndexingRequest,
  IndexableContentType,
} from "@/lib/types/google-indexing.type";

type GoogleIndexingConfig = {
  isConfigured: boolean;
  hasClientEmail: boolean;
  hasPrivateKey: boolean;
};

type UseGoogleIndexingReturn = {
  // State
  isLoading: boolean;
  error: string | null;
  lastResult: IndexingOperationResponse | null;
  config: GoogleIndexingConfig | null;

  // Actions
  notifyAllUrls: () => Promise<IndexingOperationResponse>;
  notifyBlogPost: (
    slug: string,
    operation?: "URL_UPDATED" | "URL_DELETED"
  ) => Promise<IndexingOperationResponse>;
  notifyService: (
    slug: string,
    operation?: "URL_UPDATED" | "URL_DELETED"
  ) => Promise<IndexingOperationResponse>;
  notifySiteSettings: () => Promise<IndexingOperationResponse>;
  bulkNotify: (
    request: BulkIndexingRequest
  ) => Promise<IndexingOperationResponse>;
  notifyUrls: (
    urls: string[],
    operation?: "URL_UPDATED" | "URL_DELETED"
  ) => Promise<IndexingOperationResponse>;
  checkConfiguration: (force?: boolean) => Promise<void>;
  clearError: () => void;
};

export function useGoogleIndexing(): UseGoogleIndexingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] =
    useState<IndexingOperationResponse | null>(null);
  const [config, setConfig] = useState<GoogleIndexingConfig | null>(null);

  /**
   * Generic API call handler
   */
  const makeApiCall = async (
    action: string,
    params: Record<string, unknown> = {}
  ): Promise<IndexingOperationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/google-indexing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...params,
        }),
      });

      const result: ApiResponse<IndexingOperationResponse> =
        await response.json();

      if (result.success) {
        setLastResult(result.data);
        return result.data;
      } else {
        throw new Error(result.error || "Failed to notify Google");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Notify all URLs in sitemap
   */
  const notifyAllUrls = async (): Promise<IndexingOperationResponse> => {
    return makeApiCall("notify_all");
  };

  /**
   * Notify Google about blog post update
   */
  const notifyBlogPost = async (
    slug: string,
    operation: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<IndexingOperationResponse> => {
    return makeApiCall("notify_blog_post", { slug, operation });
  };

  /**
   * Notify Google about service update
   */
  const notifyService = async (
    slug: string,
    operation: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<IndexingOperationResponse> => {
    return makeApiCall("notify_service", { slug, operation });
  };

  /**
   * Notify Google about site settings update
   */
  const notifySiteSettings = async (): Promise<IndexingOperationResponse> => {
    return makeApiCall("notify_site_settings");
  };

  /**
   * Bulk notify content updates
   */
  const bulkNotify = async (
    request: BulkIndexingRequest
  ): Promise<IndexingOperationResponse> => {
    return makeApiCall("bulk_notify", request);
  };

  /**
   * Notify Google about specific URLs
   */
  const notifyUrls = async (
    urls: string[],
    operation: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<IndexingOperationResponse> => {
    return makeApiCall("notify_urls", { urls, operation });
  };

  /**
   * Check Google Indexing configuration
   * @param force - Force refresh even if config is already loaded
   */
  const checkConfiguration = useCallback(
    async (force = false): Promise<void> => {
      // Don't check if already loading (unless forced) or if config is already set
      if (isLoading || (!force && config)) return;

      try {
        const response = await fetch("/api/admin/google-indexing", {
          method: "GET",
        });

        const result = await response.json();

        if (result.success) {
          setConfig(result.data);
        } else {
          setError(result.error || "Failed to check configuration");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check configuration";
        setError(errorMessage);
      }
    },
    [isLoading, config]
  ); // Dependencies for optimization

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    // State
    isLoading,
    error,
    lastResult,
    config,

    // Actions
    notifyAllUrls,
    notifyBlogPost,
    notifyService,
    notifySiteSettings,
    bulkNotify,
    notifyUrls,
    checkConfiguration,
    clearError,
  };
}

/**
 * Hook for automatic content notification
 * Use this in forms to automatically notify Google when content is updated
 */
export function useAutoGoogleIndexing() {
  const { notifyBlogPost, notifyService, notifySiteSettings } =
    useGoogleIndexing();

  /**
   * Automatically notify Google about content update (async - doesn't block)
   */
  const autoNotify = async (
    contentType: IndexableContentType,
    contentId: string,
    operation: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<void> => {
    // Run in background - don't block the calling function
    setTimeout(async () => {
      try {
        switch (contentType) {
          case "blog_post":
            await notifyBlogPost(contentId, operation);
            break;
          case "service":
            await notifyService(contentId, operation);
            break;
          case "site_settings":
            await notifySiteSettings();
            break;
        }
      } catch (error) {
        // Log error but don't throw (background operation)
        console.error("Auto Google Indexing failed:", error);
      }
    }, 100);
  };

  return {
    autoNotify,
  };
}
