"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Plus, ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Constants for file validation
const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  MAX_IMAGES_DEFAULT: 10,
} as const;

const VALIDATION_MESSAGES = {
  MAX_IMAGES: (max: number) => `Maximum ${max} images allowed`,
  INVALID_FILE_TYPE: "Please select only valid image files",
  FILE_TOO_LARGE: "All image files must be smaller than 5MB",
  INVALID_URL: "Please enter a valid URL",
  DUPLICATE_URL: "This image URL is already in the gallery",
  UPLOAD_FAILED: "Failed to upload images",
  SUCCESS_UPLOAD: (count: number) => `${count} image(s) uploaded successfully`,
  SUCCESS_URL_ADDED: "Image URL added to gallery",
  SUCCESS_REMOVED: "Image removed from gallery",
} as const;

interface ServiceGalleryUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
  maxImages?: number;
}

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
  };
  error?: string;
}

/**
 * Service gallery uploader component
 * Supports multiple image uploads and direct URL input
 */
export function ServiceGalleryUploader({
  value = [],
  onChange,
  disabled = false,
  error,
  maxImages = FILE_SIZE_LIMITS.MAX_IMAGES_DEFAULT,
}: ServiceGalleryUploaderProps): React.JSX.Element {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>("");

  /**
   * Validates file type and size
   */
  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      return false;
    }
    if (file.size > FILE_SIZE_LIMITS.MAX_FILE_SIZE) {
      return false;
    }
    return true;
  };

  /**
   * Validates URL format
   */
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Uploads a single file to the server
   */
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload/service", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const result: UploadResponse = await response.json();

    if (result.success && result.data) {
      return result.data.url;
    } else {
      throw new Error(result.error || "Failed to upload image");
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding files would exceed max limit
    if (value.length + files.length > maxImages) {
      toast.error(VALIDATION_MESSAGES.MAX_IMAGES(maxImages));
      return;
    }

    // Validate file types
    const invalidFiles = files.filter((file) => !validateFile(file));
    if (invalidFiles.length > 0) {
      toast.error(VALIDATION_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(
      (file) => file.size > FILE_SIZE_LIMITS.MAX_FILE_SIZE
    );
    if (oversizedFiles.length > 0) {
      toast.error(VALIDATION_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);
      const newGallery = [...value, ...uploadedUrls];
      onChange(newGallery);
      toast.success(VALIDATION_MESSAGES.SUCCESS_UPLOAD(uploadedUrls.length));
    } catch (error) {
      toast.error(VALIDATION_MESSAGES.UPLOAD_FAILED);
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleUrlAdd = (): void => {
    if (!urlInput.trim()) return;

    if (value.length >= maxImages) {
      toast.error(VALIDATION_MESSAGES.MAX_IMAGES(maxImages));
      return;
    }

    // Validate URL format
    if (!validateUrl(urlInput)) {
      toast.error(VALIDATION_MESSAGES.INVALID_URL);
      return;
    }

    // Check if URL already exists
    if (value.includes(urlInput)) {
      toast.error(VALIDATION_MESSAGES.DUPLICATE_URL);
      return;
    }

    const newGallery = [...value, urlInput];
    onChange(newGallery);
    setUrlInput("");
    toast.success(VALIDATION_MESSAGES.SUCCESS_URL_ADDED);
  };

  const handleRemoveImage = (index: number): void => {
    const newGallery = value.filter((_, i) => i !== index);
    onChange(newGallery);
    toast.success(VALIDATION_MESSAGES.SUCCESS_REMOVED);
  };

  const handleMoveImage = (fromIndex: number, toIndex: number): void => {
    const newGallery = [...value];
    const [movedImage] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedImage);
    onChange(newGallery);
  };

  return (
    <div className="space-y-4">
      {/* Upload Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={disabled || isUploading || value.length >= maxImages}
            className="hidden"
            id="service-gallery-upload"
          />
          <Label
            htmlFor="service-gallery-upload"
            className="cursor-pointer flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={disabled || isUploading || value.length >= maxImages}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Images"}
              </span>
            </Button>
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Add image URL"
            disabled={disabled || value.length >= maxImages}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlAdd();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUrlAdd}
            disabled={disabled || !urlInput.trim() || value.length >= maxImages}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {value.length}/{maxImages} images • Max 5MB per image
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Gallery Grid */}
      {value.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  toast.error(`Failed to load image ${index + 1}`);
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMoveImage(index, index - 1)}
                      disabled={disabled}
                    >
                      ←
                    </Button>
                  )}
                  {index < value.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMoveImage(index, index + 1)}
                      disabled={disabled}
                    >
                      →
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No images in gallery</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload images or add URLs to build your service gallery
          </p>
        </div>
      )}
    </div>
  );
}
