"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

// Constants for file validation
const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  IMAGE_DISPLAY_SIZE: {
    WIDTH: 400,
    HEIGHT: 200,
  },
} as const;

// Validation messages
const VALIDATION_MESSAGES = {
  INVALID_FILE_TYPE:
    "Please select a valid image file (JPEG, PNG, WebP, or GIF)",
  FILE_TOO_LARGE: "Image file must be smaller than 5MB",
  UPLOAD_FAILED: "Failed to upload image",
  UPLOAD_SUCCESS: "Image uploaded successfully",
  LOAD_FAILED: "Failed to load image",
  INVALID_URL: "Please enter a valid image URL",
  INVALID_RESPONSE: "Invalid response from server",
} as const;

// Loading states
const LOADING_STATES = {
  UPLOADING: "Uploading...",
  UPLOAD_BUTTON: "Upload Image",
} as const;

// Type definitions
interface ServiceImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
}

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
  };
  error?: string;
  message?: string;
}

/**
 * Validates file type
 */
const validateFileType = (file: File): boolean => {
  return (
    FILE_CONSTRAINTS.ALLOWED_TYPES.includes(
      file.type as (typeof FILE_CONSTRAINTS.ALLOWED_TYPES)[number]
    ) || file.type.startsWith("image/")
  );
};

/**
 * Validates file size
 */
const validateFileSize = (file: File): boolean => {
  return file.size <= FILE_CONSTRAINTS.MAX_FILE_SIZE;
};

/**
 * Validates URL format
 */
const validateUrl = (url: string): boolean => {
  if (!url.trim()) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Service image uploader component
 * Supports both file upload and direct URL input
 */
export function ServiceImageUploader({
  value,
  onChange,
  disabled = false,
  error,
  label = "Service Image",
  placeholder = "https://example.com/service-image.jpg",
}: ServiceImageUploaderProps): React.JSX.Element {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  /**
   * Handle file upload
   */
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!validateFileType(file)) {
      toast.error(VALIDATION_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    // Validate file size
    if (!validateFileSize(file)) {
      toast.error(VALIDATION_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    setIsUploading(true);

    try {
      // Upload to the server using Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload/service", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      // Parse response with error handling
      let result: UploadResponse;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse upload response:", parseError);
        throw new Error(VALIDATION_MESSAGES.INVALID_RESPONSE);
      }

      if (result.success && result.data) {
        // Use the Vercel Blob URL directly
        onChange(result.data.url);
        toast.success(result.message || VALIDATION_MESSAGES.UPLOAD_SUCCESS);
      } else {
        throw new Error(result.error || VALIDATION_MESSAGES.UPLOAD_FAILED);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : VALIDATION_MESSAGES.UPLOAD_FAILED;
      toast.error(errorMessage);
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  /**
   * Handle URL input change
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newUrl = e.target.value;

    // Basic URL validation for user feedback
    if (newUrl && !validateUrl(newUrl)) {
      // Don't block the input, just don't show validation error here
      // The error will be handled by the parent form validation
    }

    onChange(newUrl);
  };

  /**
   * Handle image removal
   */
  const handleRemoveImage = (): void => {
    onChange("");
  };

  /**
   * Handle image load error
   */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    toast.error(VALIDATION_MESSAGES.LOAD_FAILED);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={disabled || isUploading}
          className="hidden"
          id="service-image-upload"
        />
        <Label htmlFor="service-image-upload" className="cursor-pointer flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={disabled || isUploading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading
                ? LOADING_STATES.UPLOADING
                : LOADING_STATES.UPLOAD_BUTTON}
            </span>
          </Button>
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-image-url">{label} URL</Label>
        <Input
          id="service-image-url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? "border-destructive" : ""}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {value && (
        <div className="relative">
          <Image
            src={value}
            alt="Service"
            width={FILE_CONSTRAINTS.IMAGE_DISPLAY_SIZE.WIDTH}
            height={FILE_CONSTRAINTS.IMAGE_DISPLAY_SIZE.HEIGHT}
            className="w-full h-48 object-cover rounded border"
            onError={handleImageError}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
