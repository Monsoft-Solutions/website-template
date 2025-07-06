"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";

interface TestimonialAvatarUploaderProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  uniqueId?: string;
}

/**
 * Testimonial avatar uploader component
 * Optimized for square avatar images
 */
export function TestimonialAvatarUploader({
  value,
  onChange,
  disabled = false,
  error,
  uniqueId = "testimonial-avatar-upload",
}: TestimonialAvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (2MB limit for avatars)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("Avatar image must be smaller than 2MB");
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

      const result = await response.json();

      if (result.success && result.data) {
        // Use the Vercel Blob URL directly
        onChange(result.data.url);
        toast.success("Avatar uploaded successfully");
      } else {
        throw new Error(result.error || "Failed to upload avatar");
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error("Avatar upload error:", error);
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
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {value ? (
            <div className="relative">
              <Image
                src={value}
                alt="Testimonial Avatar"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-full border-2 border-muted"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  toast.error("Failed to load avatar image");
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={handleRemoveImage}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
              <User className="w-8 h-8 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={disabled || isUploading}
              className="hidden"
              id={uniqueId}
            />
            <Label htmlFor={uniqueId} className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || isUploading}
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Avatar"}
                </span>
              </Button>
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${uniqueId}-url`}>Avatar URL</Label>
            <Input
              id={`${uniqueId}-url`}
              value={value}
              onChange={handleUrlChange}
              placeholder="https://example.com/avatar.jpg"
              disabled={disabled}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Recommended: Square image, 200x200px or larger. Max 2MB.
      </p>
    </div>
  );
}
