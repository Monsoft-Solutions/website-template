"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Link, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AIImageGenerator } from "./ai-image-generator";

interface FeaturedImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  // New props for AI generation
  blogTitle?: string;
  blogContent?: string;
  blogExcerpt?: string;
  // New props for blog post updating
  blogPostId?: string;
  mode?: "create" | "edit";
  onBlogPostUpdate?: (blogPostId: string, imageUrl: string) => Promise<void>;
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
  blogTitle = "",
  blogContent = "",
  blogExcerpt = "",
  blogPostId,
  mode,
  onBlogPostUpdate,
}: FeaturedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState("upload");

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

  // Handle URL input
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      new URL(urlInput); // Validate URL
      onChange(urlInput);
      setUrlInput("");
      toast.success("Image URL set successfully!");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  // Handle removing current image
  const handleRemoveImage = () => {
    onChange("");
    toast.success("Image removed");
  };

  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="upload"
            className="flex items-center gap-2"
            type="button"
          >
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="flex items-center gap-2"
            type="button"
          >
            <Link className="h-4 w-4" />
            URL
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="flex items-center gap-2"
            type="button"
          >
            <Sparkles className="h-4 w-4" />
            AI Generate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={disabled || isUploading}
                    />
                  </label>
                </div>
                {isUploading && (
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading image...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={disabled}
                    />
                    <Button
                      type="button"
                      onClick={handleUrlSubmit}
                      disabled={disabled || !urlInput.trim()}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <AIImageGenerator
            title={blogTitle}
            content={blogContent}
            excerpt={blogExcerpt}
            onImageAccepted={onChange}
            disabled={disabled}
            blogPostId={blogPostId}
            mode={mode}
            onBlogPostUpdate={onBlogPostUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Current Image Preview */}
      {value && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Current Featured Image</Label>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="sm"
                  disabled={disabled}
                >
                  Remove
                </Button>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={value}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
