/**
 * Google Indexing Service
 * Handles Google Search Console Indexing API notifications for content updates
 */

import { GoogleIndexingClient } from "@monsoft/google-indexing";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/lib/config/site";
import { getBlogPostBySlug } from "@/lib/api/blog.service";
import { getServiceBySlug } from "@/lib/api/services.api";
import { ApiResponse } from "@/lib/types/api-response.type";
import {
  GoogleIndexingConfig,
  GoogleIndexingUrl,
  GoogleIndexingResult,
  IndexableContentType,
  IndexingOperationResponse,
  BulkIndexingRequest,
} from "@/lib/types/google-indexing.type";

/**
 * Google Indexing Service class
 */
export class GoogleIndexingService {
  private client: GoogleIndexingClient | null = null;
  private config: GoogleIndexingConfig;

  constructor(config?: GoogleIndexingConfig) {
    this.config = config || this.getDefaultConfig();
  }

  /**
   * Get default configuration from environment variables
   */
  private getDefaultConfig(): GoogleIndexingConfig {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      throw new Error(
        "Google Indexing credentials not found. Please set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables."
      );
    }

    return {
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
      baseUrl: siteConfig.url,
    };
  }

  /**
   * Initialize the Google Indexing client
   */
  private async initializeClient(): Promise<void> {
    if (!this.client) {
      this.client = new GoogleIndexingClient(this.config);
      await this.client.initialize();
    }
  }

  /**
   * Notify Google about all URLs in the sitemap
   */
  async notifyAllUrls(): Promise<ApiResponse<IndexingOperationResponse>> {
    try {
      await this.initializeClient();

      // Get URLs from the dynamic sitemap
      const sitemapData = await sitemap();
      const urls = sitemapData.map((item) => item.url);

      if (urls.length === 0) {
        return {
          success: false,
          data: {
            totalUrls: 0,
            successCount: 0,
            failedCount: 0,
            results: [],
          },
          error: "No URLs found in sitemap",
        };
      }

      const indexableUrls: GoogleIndexingUrl[] = urls.map((url) => ({
        url,
        type: "URL_UPDATED",
      }));

      const results = await this.client!.notifyUrlUpdates(indexableUrls);
      const successCount = results.filter((r) => r.success).length;

      return {
        success: true,
        data: {
          totalUrls: results.length,
          successCount,
          failedCount: results.length - successCount,
          results,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Notify Google about specific URLs
   */
  async notifyUrls(
    urls: string[],
    type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<ApiResponse<IndexingOperationResponse>> {
    try {
      await this.initializeClient();

      if (urls.length === 0) {
        return {
          success: true,
          data: {
            totalUrls: 0,
            successCount: 0,
            failedCount: 0,
            results: [],
            skippedUrls: [],
          },
        };
      }

      const indexableUrls: GoogleIndexingUrl[] = urls.map((url) => ({
        url,
        type,
      }));

      const results = await this.client!.notifyUrlUpdates(indexableUrls);
      const successCount = results.filter((r) => r.success).length;

      return {
        success: true,
        data: {
          totalUrls: results.length,
          successCount,
          failedCount: results.length - successCount,
          results,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Notify Google about a blog post update
   */
  async notifyBlogPostUpdate(
    slug: string,
    type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<ApiResponse<IndexingOperationResponse>> {
    try {
      const blogPost = await getBlogPostBySlug(slug);

      if (!blogPost) {
        return {
          success: false,
          data: {
            totalUrls: 0,
            successCount: 0,
            failedCount: 0,
            results: [],
          },
          error: "Blog post not found",
        };
      }

      // Generate URLs to notify
      const urls = [
        `${siteConfig.url}/blog/${slug}`, // Blog post URL
        `${siteConfig.url}/blog`, // Blog listing page
      ];

      // Add category and tag URLs if post is published
      if (blogPost.status === "published" && type === "URL_UPDATED") {
        if (blogPost.category) {
          urls.push(
            `${siteConfig.url}/blog/category/${blogPost.category.slug}`
          );
        }

        // Add tag URLs
        if (blogPost.tags && blogPost.tags.length > 0) {
          blogPost.tags.forEach((tag) => {
            urls.push(`${siteConfig.url}/blog/tag/${tag.slug}`);
          });
        }
      }

      return await this.notifyUrls(urls, type);
    } catch (error) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to notify blog post update",
      };
    }
  }

  /**
   * Notify Google about a service update
   */
  async notifyServiceUpdate(
    slug: string,
    type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
  ): Promise<ApiResponse<IndexingOperationResponse>> {
    try {
      const service = await getServiceBySlug(slug);

      if (!service.success || !service.data) {
        return {
          success: false,
          data: {
            totalUrls: 0,
            successCount: 0,
            failedCount: 0,
            results: [],
          },
          error: "Service not found",
        };
      }

      // Generate URLs to notify
      const urls = [
        `${siteConfig.url}/services/${slug}`, // Service URL
        `${siteConfig.url}/services`, // Services listing page
      ];

      return await this.notifyUrls(urls, type);
    } catch (error) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to notify service update",
      };
    }
  }

  /**
   * Notify Google about site settings update (home page and main pages)
   */
  async notifySiteSettingsUpdate(): Promise<
    ApiResponse<IndexingOperationResponse>
  > {
    try {
      const urls = [
        siteConfig.url, // Home page
        `${siteConfig.url}/about`,
        `${siteConfig.url}/contact`,
        `${siteConfig.url}/blog`,
        `${siteConfig.url}/services`,
      ];

      return await this.notifyUrls(urls, "URL_UPDATED");
    } catch (error) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to notify site settings update",
      };
    }
  }

  /**
   * Bulk notify content updates
   */
  async bulkNotify(
    request: BulkIndexingRequest
  ): Promise<ApiResponse<IndexingOperationResponse>> {
    try {
      const { contentType, contentIds, operation } = request;
      const allResults: GoogleIndexingResult[] = [];
      let totalSuccessCount = 0;
      let totalFailedCount = 0;

      for (const contentId of contentIds) {
        let result: ApiResponse<IndexingOperationResponse>;

        switch (contentType) {
          case "blog_post":
            result = await this.notifyBlogPostUpdate(contentId, operation);
            break;
          case "service":
            result = await this.notifyServiceUpdate(contentId, operation);
            break;
          case "site_settings":
            result = await this.notifySiteSettingsUpdate();
            break;
          default:
            continue;
        }

        if (result.success) {
          allResults.push(...result.data.results);
          totalSuccessCount += result.data.successCount;
          totalFailedCount += result.data.failedCount;
        } else {
          totalFailedCount += 1;
          allResults.push({
            url: contentId,
            success: false,
            error: result.error || "Unknown error",
          });
        }
      }

      return {
        success: true,
        data: {
          totalUrls: allResults.length,
          successCount: totalSuccessCount,
          failedCount: totalFailedCount,
          results: allResults,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to process bulk notification",
      };
    }
  }

  /**
   * Check if Google Indexing is properly configured
   */
  static isConfigured(): boolean {
    return !!(
      process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    );
  }

  /**
   * Get a singleton instance of the service
   */
  static getInstance(): GoogleIndexingService {
    if (!this.isConfigured()) {
      throw new Error("Google Indexing is not configured");
    }
    return new GoogleIndexingService();
  }
}

/**
 * Convenience functions for direct usage
 */

/**
 * Notify Google about content update (async - doesn't block)
 */
export async function notifyContentUpdate(
  contentType: IndexableContentType,
  contentId: string,
  operation: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<void> {
  // Run in background - don't block the calling function
  setImmediate(async () => {
    try {
      if (!GoogleIndexingService.isConfigured()) {
        console.warn(
          "Google Indexing is not configured, skipping notification"
        );
        return;
      }

      const service = GoogleIndexingService.getInstance();

      let result: ApiResponse<IndexingOperationResponse>;

      switch (contentType) {
        case "blog_post":
          result = await service.notifyBlogPostUpdate(contentId, operation);
          break;
        case "service":
          result = await service.notifyServiceUpdate(contentId, operation);
          break;
        case "site_settings":
          result = await service.notifySiteSettingsUpdate();
          break;
        default:
          return;
      }

      if (result.success) {
        console.log(
          `✅ Google Indexing: Successfully notified ${result.data.successCount}/${result.data.totalUrls} URLs for ${contentType}:${contentId}`
        );
      } else {
        console.error(
          `❌ Google Indexing: Failed to notify ${contentType}:${contentId} - ${result.error}`
        );
      }
    } catch (error) {
      console.error("❌ Google Indexing: Unexpected error:", error);
    }
  });
}

/**
 * Notify all sitemap URLs (for manual re-indexing)
 */
export async function notifyAllSitemapUrls(): Promise<
  ApiResponse<IndexingOperationResponse>
> {
  try {
    if (!GoogleIndexingService.isConfigured()) {
      return {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error: "Google Indexing is not configured",
      };
    }

    const service = GoogleIndexingService.getInstance();
    return await service.notifyAllUrls();
  } catch (error) {
    return {
      success: false,
      data: {
        totalUrls: 0,
        successCount: 0,
        failedCount: 0,
        results: [],
      },
      error:
        error instanceof Error ? error.message : "Failed to notify all URLs",
    };
  }
}
