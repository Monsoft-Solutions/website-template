"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, ArrowLeft } from "lucide-react";
import { ImageVariantsPreview } from "./image-variants-preview";
import type { BlogContent } from "@/lib/types/ai/image";
import type { ApiResponse } from "@/lib/types/api-response.type";

interface ImageVariant {
  id: string;
  style: string;
  styleLabel: string;
  prompt: string;
  image: {
    url: string;
    revisedPrompt?: string;
    model: string;
    size: string;
    quality: string;
  } | null;
  error?: string;
}

interface ImageVariantsResponse {
  variants: ImageVariant[];
  metadata: {
    totalGenerationTime: number;
    successCount: number;
    errorCount: number;
  };
}

interface AIImageGeneratorProps {
  title: string;
  content: string;
  excerpt: string;
  onImageAccepted: (imageUrl: string) => void;
  disabled?: boolean;
  // New props for blog post updating
  blogPostId?: string;
  mode?: "create" | "edit";
  onBlogPostUpdate?: (blogPostId: string, imageUrl: string) => Promise<void>;
}

export function AIImageGenerator({
  title,
  content,
  excerpt,
  onImageAccepted,
  disabled = false,
  blogPostId,
  mode,
  onBlogPostUpdate,
}: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [variants, setVariants] = useState<ImageVariant[]>([]);

  // Generate 3 image variants with different styles
  const generateImageVariants = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and content before generating images");
      return;
    }

    setIsGenerating(true);
    setVariants([]); // Clear existing variants

    try {
      const blogContent: BlogContent = {
        title,
        content,
        excerpt,
      };

      const response = await fetch("/api/admin/blog/generate-image-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogContent,
        }),
      });

      const result: ApiResponse<ImageVariantsResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate image variants");
      }

      const variantsData = result.data;
      setVariants(variantsData.variants);

      const successCount = variantsData.metadata.successCount;
      const errorCount = variantsData.metadata.errorCount;

      if (successCount > 0) {
        toast.success(
          `Generated ${successCount} image variant${successCount > 1 ? "s" : ""} successfully!${
            errorCount > 0 ? ` (${errorCount} failed)` : ""
          }`
        );
      } else {
        toast.error("All image generation attempts failed. Please try again.");
      }
    } catch (error) {
      console.error("Image variants generation error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate image variants"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [title, content, excerpt]);

  // Handle image selection and upload
  const handleImageSelect = useCallback(
    async (imageUrl: string) => {
      try {
        // Download the image from the selected URL
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error("Failed to download selected image");
        }

        const imageBlob = await imageResponse.blob();

        // Create a file name based on the current timestamp
        const fileName = `ai-generated-${Date.now()}.png`;

        // Upload to our storage
        const formData = new FormData();
        formData.append("file", imageBlob, fileName);

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult: ApiResponse<{ url: string }> =
          await uploadResponse.json();

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        // Pass the uploaded image URL to parent
        onImageAccepted(uploadResult.data.url);

        // Reset state
        setVariants([]);
        setShowGenerator(false);

        toast.success("Image uploaded and applied successfully!");
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to save image"
        );
      }
    },
    [onImageAccepted]
  );

  const handleRegenerate = useCallback(() => {
    generateImageVariants();
  }, [generateImageVariants]);

  if (!showGenerator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Image Generator
            <Badge variant="secondary">One-Shot Generation</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate 3 different style variations of a featured image for your
              blog post using AI. Choose the style that best fits your content.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">✨ Simplified Flow:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI analyzes your blog content automatically</li>
                <li>
                  • Generates 3 different style variations (Professional,
                  Artistic, Minimalist)
                </li>
                <li>
                  • Choose your preferred image or regenerate all variants
                </li>
                <li>• Selected image is automatically uploaded and applied</li>
              </ul>
            </div>

            <Button
              type="button"
              onClick={() => setShowGenerator(true)}
              disabled={disabled || !title.trim() || !content.trim()}
              className="w-full"
              size="lg"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Image Variants
            </Button>

            {(!title.trim() || !content.trim()) && (
              <p className="text-xs text-muted-foreground text-center">
                Add a title and content to enable image generation
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Image Generation
              <Badge variant="outline">One-Shot Generation</Badge>
            </CardTitle>
            <Button
              type="button"
              onClick={() => setShowGenerator(false)}
              variant="ghost"
              size="sm"
              disabled={isGenerating}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Generate Button */}
      {variants.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Ready to Generate</h3>
                <p className="text-sm text-muted-foreground">
                  Click the button below to generate 3 image variants in
                  different styles. This process will analyze your blog content
                  and create tailored prompts for each style.
                </p>
              </div>

              <Button
                type="button"
                onClick={generateImageVariants}
                disabled={disabled || isGenerating}
                size="lg"
                className="w-full max-w-md"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate 3 Image Variants
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Variants Preview */}
      {(variants.length > 0 || isGenerating) && (
        <ImageVariantsPreview
          variants={variants}
          isGenerating={isGenerating}
          onSelectImage={handleImageSelect}
          onRegenerate={handleRegenerate}
          disabled={disabled}
          blogPostId={blogPostId}
          mode={mode}
          onBlogPostUpdate={onBlogPostUpdate}
        />
      )}
    </div>
  );
}
