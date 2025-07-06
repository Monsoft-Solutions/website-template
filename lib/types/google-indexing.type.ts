/**
 * Google Indexing Types
 * Types for Google Indexing API notifications and configuration
 */

/**
 * Google Indexing URL notification type
 */
export type GoogleIndexingUrlType = "URL_UPDATED" | "URL_DELETED";

/**
 * Google Indexing URL configuration
 */
export type GoogleIndexingUrl = {
  url: string;
  type: GoogleIndexingUrlType;
};

/**
 * Google Indexing notification result
 */
export type GoogleIndexingResult = {
  url: string;
  success: boolean;
  error?: string;
};

/**
 * Google Indexing service configuration
 */
export type GoogleIndexingConfig = {
  clientEmail: string;
  privateKey: string;
  baseUrl: string;
};

/**
 * Content types that can trigger indexing notifications
 */
export type IndexableContentType = "blog_post" | "service" | "site_settings";

/**
 * Google Indexing notification status
 */
export type IndexingNotificationStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "skipped";

/**
 * Indexing notification record
 */
export type IndexingNotification = {
  id: string;
  contentType: IndexableContentType;
  contentId: string;
  urls: string[];
  status: IndexingNotificationStatus;
  attempts: number;
  lastAttemptAt?: Date;
  successAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Bulk indexing operation request
 */
export type BulkIndexingRequest = {
  contentType: IndexableContentType;
  contentIds: string[];
  operation: GoogleIndexingUrlType;
};

/**
 * Indexing operation response
 */
export type IndexingOperationResponse = {
  totalUrls: number;
  successCount: number;
  failedCount: number;
  results: GoogleIndexingResult[];
  skippedUrls?: string[];
};
