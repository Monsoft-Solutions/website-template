"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Plus, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ServiceGalleryUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
  maxImages?: number;
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
  maxImages = 10,
}: ServiceGalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding files would exceed max limit
    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      toast.error("Please select only valid image files");
      return;
    }

    // Validate file sizes (5MB limit per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error("All image files must be smaller than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload/service", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          return result.data.url;
        } else {
          throw new Error(result.error || "Failed to upload image");
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newGallery = [...value, ...uploadedUrls];
      onChange(newGallery);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    // Check if URL already exists
    if (value.includes(urlInput)) {
      toast.error("This image URL is already in the gallery");
      return;
    }

    const newGallery = [...value, urlInput];
    onChange(newGallery);
    setUrlInput("");
    toast.success("Image URL added to gallery");
  };

  const handleRemoveImage = (index: number) => {
    const newGallery = value.filter((_, i) => i !== index);
    onChange(newGallery);
    toast.success("Image removed from gallery");
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
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
