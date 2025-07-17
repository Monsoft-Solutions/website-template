import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { galleryImageGroups } from "@/lib/db/schema/gallery-image-group.table";
import { requireAdmin, getCurrentUser } from "@/lib/auth/server";
import { uploadToBlob } from "@/lib/utils/blob-upload";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  GalleryImage,
  NewGalleryImage,
  ImageMetadata,
} from "@/lib/types/gallery-image.type";

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
  // Add gallery image database record
  galleryImage: GalleryImage;
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
async function getImageDimensions(file: File): Promise<{
  width?: number;
  height?: number;
}> {
  try {
    // For now, return undefined - can be enhanced later with image processing library
    // TODO: Implement actual image dimension detection
    console.log("Getting dimensions for file:", file.name); // Prevent unused parameter warning
    return { width: undefined, height: undefined };
  } catch (error) {
    console.warn("Failed to get image dimensions:", error);
    return { width: undefined, height: undefined };
  }
}

/**
 * POST endpoint - Upload gallery image file and save to database
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can upload gallery images
    await requireAdmin();

    // Get current user for metadata
    const currentUser = await getCurrentUser();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const altText = formData.get("altText") as string;
    const description = formData.get("description") as string;
    const groupIds = formData.get("groupIds") as string; // JSON string array
    const isAvailable = formData.get("isAvailable") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

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

    // Validate required metadata
    if (!name || !altText) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Name and alt text are required",
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

    // Parse group IDs if provided
    let parsedGroupIds: string[] = [];
    if (groupIds) {
      try {
        parsedGroupIds = JSON.parse(groupIds);
        if (!Array.isArray(parsedGroupIds)) {
          throw new Error("Group IDs must be an array");
        }
      } catch (parseError) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: `Invalid group IDs format: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
          } as ApiResponse<null>,
          { status: 400 }
        );
      }
    }

    // Get image dimensions
    const dimensions = await getImageDimensions(file);

    try {
      // Upload to Vercel Blob using the service
      const blobResult = await uploadToBlob(file, {
        folder: "gallery",
        contentType: file.type,
      });

      // Create metadata
      const metadata: ImageMetadata = {
        uploadedBy: currentUser?.id,
        uploadedAt: new Date().toISOString(),
        originalFileName: file.name,
        processingInfo: {
          resized: false,
          compressed: false,
          thumbnailGenerated: false,
        },
      };

      // Save image record to database
      const newImageData: NewGalleryImage = {
        name,
        altText,
        description: description || null,
        fileName: blobResult.pathname.split("/").pop() || file.name,
        originalUrl: blobResult.url,
        thumbnailUrl: null, // TODO: Generate thumbnail
        optimizedUrl: null, // TODO: Generate optimized version
        fileSize: file.size,
        width: dimensions.width || null,
        height: dimensions.height || null,
        mimeType: file.type,
        displayOrder: 0,
        isAvailable,
        isFeatured,
        metadata,
      };

      const [galleryImage] = await db
        .insert(galleryImages)
        .values(newImageData)
        .returning();

      // Associate with groups if provided
      if (parsedGroupIds.length > 0) {
        const groupAssociations = parsedGroupIds.map(
          (groupId: string, index: number) => ({
            imageId: galleryImage.id,
            groupId,
            displayOrder: index,
          })
        );

        await db.insert(galleryImageGroups).values(groupAssociations);
      }

      const response: UploadResponse = {
        url: blobResult.url,
        pathname: blobResult.pathname,
        size: file.size,
        contentType: blobResult.contentType,
        width: dimensions.width,
        height: dimensions.height,
        galleryImage,
      };

      return NextResponse.json(
        {
          success: true,
          data: response,
          message: "Gallery image uploaded and saved successfully",
        } as ApiResponse<UploadResponse>,
        { status: 200 }
      );
    } catch (uploadError) {
      console.error("Upload or database error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Failed to upload image",
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
