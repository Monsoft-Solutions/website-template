import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types/api-response.type";
import {
  GoogleIndexingService,
  notifyAllSitemapUrls,
} from "@/lib/services/google-indexing.service";
import {
  IndexingOperationResponse,
  BulkIndexingRequest,
} from "@/lib/types/google-indexing.type";

/**
 * POST /api/admin/google-indexing - Notify Google about content updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (!GoogleIndexingService.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          data: {
            totalUrls: 0,
            successCount: 0,
            failedCount: 0,
            results: [],
          },
          error:
            "Google Indexing is not configured. Please set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.",
        } as ApiResponse<IndexingOperationResponse>,
        { status: 500 }
      );
    }

    const service = GoogleIndexingService.getInstance();
    let result: ApiResponse<IndexingOperationResponse>;

    switch (action) {
      case "notify_all": {
        // Notify all URLs in sitemap
        result = await notifyAllSitemapUrls();
        break;
      }

      case "notify_blog_post": {
        const { slug, operation = "URL_UPDATED" } = params;
        if (!slug) {
          return NextResponse.json(
            {
              success: false,
              data: {
                totalUrls: 0,
                successCount: 0,
                failedCount: 0,
                results: [],
              },
              error: "Blog post slug is required",
            } as ApiResponse<IndexingOperationResponse>,
            { status: 400 }
          );
        }

        result = await service.notifyBlogPostUpdate(slug, operation);
        break;
      }

      case "notify_service": {
        const { slug, operation = "URL_UPDATED" } = params;
        if (!slug) {
          return NextResponse.json(
            {
              success: false,
              data: {
                totalUrls: 0,
                successCount: 0,
                failedCount: 0,
                results: [],
              },
              error: "Service slug is required",
            } as ApiResponse<IndexingOperationResponse>,
            { status: 400 }
          );
        }

        result = await service.notifyServiceUpdate(slug, operation);
        break;
      }

      case "notify_site_settings": {
        result = await service.notifySiteSettingsUpdate();
        break;
      }

      case "bulk_notify": {
        const bulkRequest = params as BulkIndexingRequest;
        if (
          !bulkRequest.contentType ||
          !bulkRequest.contentIds ||
          !Array.isArray(bulkRequest.contentIds)
        ) {
          return NextResponse.json(
            {
              success: false,
              data: {
                totalUrls: 0,
                successCount: 0,
                failedCount: 0,
                results: [],
              },
              error:
                "Invalid bulk request format. contentType and contentIds array are required",
            } as ApiResponse<IndexingOperationResponse>,
            { status: 400 }
          );
        }

        result = await service.bulkNotify(bulkRequest);
        break;
      }

      case "notify_urls": {
        const { urls, operation = "URL_UPDATED" } = params;
        if (!urls || !Array.isArray(urls)) {
          return NextResponse.json(
            {
              success: false,
              data: {
                totalUrls: 0,
                successCount: 0,
                failedCount: 0,
                results: [],
              },
              error: "URLs array is required",
            } as ApiResponse<IndexingOperationResponse>,
            { status: 400 }
          );
        }

        result = await service.notifyUrls(urls, operation);
        break;
      }

      default: {
        return NextResponse.json(
          {
            success: false,
            data: {
              totalUrls: 0,
              successCount: 0,
              failedCount: 0,
              results: [],
            },
            error: `Unknown action: ${action}`,
          } as ApiResponse<IndexingOperationResponse>,
          { status: 400 }
        );
      }
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Google Indexing API error:", error);

    return NextResponse.json(
      {
        success: false,
        data: {
          totalUrls: 0,
          successCount: 0,
          failedCount: 0,
          results: [],
        },
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse<IndexingOperationResponse>,
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/google-indexing - Get Google indexing configuration status
 */
export async function GET() {
  try {
    const isConfigured = GoogleIndexingService.isConfigured();

    return NextResponse.json({
      success: true,
      data: {
        isConfigured,
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: {
          isConfigured: false,
          hasClientEmail: false,
          hasPrivateKey: false,
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to check configuration",
      },
      { status: 500 }
    );
  }
}
