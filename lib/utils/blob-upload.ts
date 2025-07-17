import { put } from "@vercel/blob";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// MIME type to extension mapping
const MIME_TO_EXTENSION = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

interface UploadOptions {
  folder?: string;
  contentType?: string;
  filename?: string;
}

interface UploadResult {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
}

/**
 * Upload a file to Vercel Blob storage
 * @param file - File object or Buffer to upload
 * @param options - Upload configuration options
 * @returns Upload result with URL and metadata
 */
export async function uploadToBlob(
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folder = "blog", contentType = "image/png", filename } = options;

  // Validate file size
  const fileSize = file instanceof File ? file.size : file.length;
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  // Generate secure filename
  const timestamp = Date.now();
  const hash = Buffer.from(`${timestamp}-${fileSize}-${contentType}`)
    .toString("base64url")
    .substring(0, 15);
  const fileExtension = getExtensionFromContentType(contentType);
  const finalFilename = filename || `${timestamp}-${hash}.${fileExtension}`;

  try {
    // Upload to Vercel Blob
    const blob = await put(`${folder}/${finalFilename}`, file, {
      access: "public",
      contentType,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: fileSize,
      contentType: blob.contentType,
    };
  } catch (error) {
    console.error("Blob upload error:", error);
    throw new Error("Failed to upload to blob storage");
  }
}

/**
 * Upload base64 image data to Vercel Blob storage
 * @param base64Data - Base64 encoded image data (with or without data URL prefix)
 * @param contentType - MIME type of the image
 * @param options - Upload configuration options
 * @returns Upload result with URL and metadata
 */
export async function uploadBase64ToBlob(
  base64Data: string,
  contentType: string = "image/png",
  options: UploadOptions = {}
): Promise<UploadResult> {
  // Validate content type
  if (!ALLOWED_TYPES.includes(contentType as (typeof ALLOWED_TYPES)[number])) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  // Remove data URL prefix if present (e.g., "data:image/png;base64,")
  const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

  // Convert base64 to Buffer
  let buffer: Buffer;
  try {
    buffer = Buffer.from(cleanBase64, "base64");
  } catch (error) {
    throw new Error(
      `Invalid base64 data: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Validate decoded size
  if (buffer.length === 0) {
    throw new Error("Empty image data");
  }

  return uploadToBlob(buffer, { ...options, contentType });
}

/**
 * Get file extension from content type
 */
function getExtensionFromContentType(contentType: string): string {
  return (
    MIME_TO_EXTENSION[contentType as keyof typeof MIME_TO_EXTENSION] || "png"
  );
}

/**
 * Validate file extension matches MIME type
 */
export function validateFileExtension(
  mimeType: string,
  filename: string
): boolean {
  const parts = filename.split(".");
  if (parts.length < 2) {
    return false;
  }

  const extension = parts[parts.length - 1].toLowerCase();
  const expectedExtension = getExtensionFromContentType(mimeType);

  // Allow both 'jpg' and 'jpeg' for JPEG files
  if (expectedExtension === "jpg") {
    return extension === "jpg" || extension === "jpeg";
  }

  return extension === expectedExtension;
}
