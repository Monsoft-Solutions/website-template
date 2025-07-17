import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types with corresponding extensions
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// MIME type to extension mapping for security validation
const MIME_TO_EXTENSION = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

interface UploadResponse {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
  width?: number;
  height?: number;
}

/**
 * Validate file extension against MIME type for security
 */
function validateFileExtension(mimeType: string, fileName: string): boolean {
  const expectedExtension =
    MIME_TO_EXTENSION[mimeType as keyof typeof MIME_TO_EXTENSION];
  if (!expectedExtension) return false;

  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  if (!fileExtension) return false;

  // Handle jpg/jpeg difference
  if (
    mimeType === "image/jpeg" &&
    (fileExtension === "jpg" || fileExtension === "jpeg")
  ) {
    return true;
  }

  return fileExtension === expectedExtension;
}

/**
 * Get image dimensions (basic implementation - could be enhanced with sharp/jimp)
 */
async function getImageDimensions(): Promise<{
  width?: number;
  height?: number;
}> {
  try {
    // For now, return undefined - can be enhanced later with image processing library
    // TODO: Implement actual image dimension detection with file parameter
    return { width: undefined, height: undefined };
  } catch (error) {
    console.warn("Failed to get image dimensions:", error);
    return { width: undefined, height: undefined };
  }
}

/**
 * POST endpoint - Upload gallery image file using Vercel Blob
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can upload gallery images
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "No file provided",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(
            ", "
          )}`,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: `File size exceeds maximum limit of ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate file extension against MIME type for security
    if (!validateFileExtension(file.type, file.name)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "File extension does not match file type",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Generate a secure filename using the validated extension
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension =
      MIME_TO_EXTENSION[file.type as keyof typeof MIME_TO_EXTENSION] || "jpg";
    const fileName = `${timestamp}-${randomId}.${fileExtension}`;

    // Get image dimensions
    const dimensions = await getImageDimensions();

    try {
      // Upload to Vercel Blob in gallery folder
      const blob = await put(`gallery/${fileName}`, file, {
        access: "public",
        contentType: file.type,
      });

      const response: UploadResponse = {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: blob.contentType,
        ...dimensions,
      };

      return NextResponse.json(
        {
          success: true,
          data: response,
          message: "Gallery image uploaded successfully",
        } as ApiResponse<UploadResponse>,
        { status: 200 }
      );
    } catch (uploadError) {
      console.error("Blob upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Failed to upload image to storage",
        } as ApiResponse<null>,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Gallery upload endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
