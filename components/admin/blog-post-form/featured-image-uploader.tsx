"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FeaturedImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Featured image uploader component for blog post form
 * Supports both file upload and direct URL input
 */
export function FeaturedImageUploader({
  value,
  onChange,
  disabled = false,
  error,
}: FeaturedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image file must be smaller than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Upload to the server using Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Use the Vercel Blob URL directly
        onChange(result.data.url);
        toast.success(result.message || "Image uploaded successfully");
      } else {
        throw new Error(result.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleRemoveImage = () => {
    onChange("");
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
          id="featured-image-upload"
        />
        <Label
          htmlFor="featured-image-upload"
          className="cursor-pointer flex-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={disabled || isUploading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured-image-url">Image URL</Label>
        <Input
          id="featured-image-url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          disabled={disabled}
          className={error ? "border-destructive" : ""}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {value && (
        <div className="relative">
          <Image
            src={value}
            alt="Featured"
            width={400}
            height={128}
            className="w-full h-32 object-cover rounded border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              toast.error("Failed to load image");
            }}
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
