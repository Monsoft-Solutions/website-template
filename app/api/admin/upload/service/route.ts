import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import type { ApiResponse } from "@/lib/types/api-response.type";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

interface UploadResponse {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
}

/**
 * POST endpoint - Upload service image file using Vercel Blob
 */
export async function POST(request: NextRequest) {
  try {
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
    if (!ALLOWED_TYPES.includes(file.type)) {
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

    // Generate a unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomId}.${fileExtension}`;

    try {
      // Upload to Vercel Blob in services folder
      const blob = await put(`services/${fileName}`, file, {
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
          message: "Service image uploaded successfully",
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
    console.error("Service upload endpoint error:", error);
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
