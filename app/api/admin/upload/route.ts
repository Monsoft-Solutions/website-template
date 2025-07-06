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
}

/**
 * Safely extract file extension from filename
 * @param filename - The filename to extract extension from
 * @returns The file extension or null if invalid
 */
function extractFileExtension(filename: string): string | null {
  if (!filename || typeof filename !== "string") {
    return null;
  }

  const parts = filename.split(".");
  if (parts.length < 2) {
    return null;
  }

  const extension = parts[parts.length - 1].toLowerCase();

  // Validate extension against allowed list
  const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!validExtensions.includes(extension)) {
    return null;
  }

  return extension;
}

/**
 * Validate file extension matches MIME type
 * @param mimeType - The MIME type of the file
 * @param filename - The filename to validate
 * @returns true if valid, false otherwise
 */
function validateFileExtension(mimeType: string, filename: string): boolean {
  const extractedExtension = extractFileExtension(filename);
  if (!extractedExtension) {
    return false;
  }

  const expectedExtension =
    MIME_TO_EXTENSION[mimeType as keyof typeof MIME_TO_EXTENSION];
  if (!expectedExtension) {
    return false;
  }

  // Allow both 'jpg' and 'jpeg' for JPEG files
  if (expectedExtension === "jpg") {
    return extractedExtension === "jpg" || extractedExtension === "jpeg";
  }

  return extractedExtension === expectedExtension;
}

/**
 * POST endpoint - Upload image file using Vercel Blob
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can upload files
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

    try {
      // Upload to Vercel Blob
      const blob = await put(`blog/${fileName}`, file, {
        access: "public",
        contentType: file.type,
      });

      const response: UploadResponse = {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: blob.contentType,
      };

      return NextResponse.json(
        {
          success: true,
          data: response,
          message: "Image uploaded successfully",
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
    console.error("Upload endpoint error:", error);
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

/**
 * GET endpoint - Health check
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: null,
      message: "Upload endpoint is working",
    } as ApiResponse<null>,
    { status: 200 }
  );
}

/**
 * DELETE endpoint - Method not allowed
 */
export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: "Method not allowed",
    } as ApiResponse<null>,
    { status: 405 }
  );
}
