"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Download,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

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

interface ImageVariantsPreviewProps {
  variants: ImageVariant[];
  isGenerating: boolean;
  onSelectImage: (imageUrl: string) => void;
  onRegenerate: () => void;
  disabled?: boolean;
  // New props for blog post updating
  blogPostId?: string;
  mode?: "create" | "edit";
  onBlogPostUpdate?: (blogPostId: string, imageUrl: string) => Promise<void>;
}

export function ImageVariantsPreview({
  variants,
  isGenerating,
  onSelectImage,
  onRegenerate,
  disabled = false,
  blogPostId,
  mode,
  onBlogPostUpdate,
}: ImageVariantsPreviewProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [previewVariant, setPreviewVariant] = useState<ImageVariant | null>(
    null
  );
  const [updatingBlogPost, setUpdatingBlogPost] = useState(false);

  const handleSelectVariant = async (variant: ImageVariant) => {
    if (variant.image?.url) {
      setSelectedVariant(variant.id);

      // If we're in edit mode, directly update the blog post without calling onSelectImage
      if (mode === "edit" && blogPostId && onBlogPostUpdate) {
        try {
          setUpdatingBlogPost(true);
          await onBlogPostUpdate(blogPostId, variant.image.url);
          toast.success("Blog post updated with selected image!");
        } catch (error) {
          console.error("Failed to update blog post:", error);
          toast.error("Failed to update blog post. Please save manually.");
        } finally {
          setUpdatingBlogPost(false);
        }
      } else {
        // In create mode, just update the form field
        onSelectImage(variant.image.url);
      }
    }
  };

  const handlePreviewVariant = (
    variant: ImageVariant,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (variant.image?.url) {
      setPreviewVariant(variant);
    }
  };

  const closePreview = () => {
    setPreviewVariant(null);
  };

  const getVariantStatus = (variant: ImageVariant) => {
    if (variant.error) return "error";
    if (variant.image) return "success";
    return "loading";
  };

  const successCount = variants.filter((v) => v.image && !v.error).length;
  const errorCount = variants.filter((v) => v.error).length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Generated Image Variants
              {successCount > 0 && (
                <Badge variant="secondary">{successCount} Generated</Badge>
              )}
              {errorCount > 0 && (
                <Badge variant="destructive">{errorCount} Failed</Badge>
              )}
            </CardTitle>
            <Button
              onClick={onRegenerate}
              disabled={disabled || isGenerating}
              variant="outline"
              size="sm"
              type="button"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate All
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Click on any image to preview it, or use the select button to choose
            it as your featured image. Preview stays open for easy comparison.
            {mode === "edit" &&
              " The blog post will be automatically updated with your selection."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {variants.map((variant) => {
              const status = getVariantStatus(variant);
              const isSelected = selectedVariant === variant.id;

              return (
                <div
                  key={variant.id}
                  className={`relative border rounded-lg overflow-hidden transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {/* Style Label */}
                  <div className="p-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">
                        {variant.styleLabel}
                      </h3>
                      <div className="flex items-center gap-2">
                        {status === "success" && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {status === "error" && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Content */}
                  <div className="aspect-video bg-muted/20 relative group">
                    {status === "loading" || isGenerating ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                          <p className="text-xs text-muted-foreground">
                            Generating...
                          </p>
                        </div>
                      </div>
                    ) : status === "error" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2 p-4">
                          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                          <p className="text-xs text-red-600 font-medium">
                            Generation Failed
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {variant.error}
                          </p>
                        </div>
                      </div>
                    ) : variant.image ? (
                      <>
                        <div
                          className="cursor-pointer w-full h-full"
                          onClick={(e) => handlePreviewVariant(variant, e)}
                        >
                          <Image
                            src={variant.image.url}
                            alt={`${variant.styleLabel} style`}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Hover overlay with preview button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => handlePreviewVariant(variant, e)}
                            className="backdrop-blur-sm"
                            type="button"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center pointer-events-none">
                            <div className="bg-blue-500 text-white p-2 rounded-full">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>

                  {/* Image Details and Actions */}
                  {variant.image && (
                    <div className="p-3 bg-muted/10 space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{variant.image.size}</span>
                        <span>{variant.image.quality} quality</span>
                      </div>

                      {/* Select Button */}
                      <Button
                        onClick={() => handleSelectVariant(variant)}
                        disabled={disabled || isSelected || updatingBlogPost}
                        variant={isSelected ? "secondary" : "default"}
                        size="sm"
                        className="w-full"
                        type="button"
                      >
                        {updatingBlogPost ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : isSelected ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            {mode === "edit"
                              ? "Select & Save"
                              : "Select This Image"}
                          </>
                        )}
                      </Button>

                      {variant.image.revisedPrompt && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            View prompt
                          </summary>
                          <p className="mt-1 text-muted-foreground leading-relaxed">
                            {variant.image.revisedPrompt}
                          </p>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Loading State for Initial Generation */}
          {isGenerating && variants.every((v) => !v.image && !v.error) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-muted/30">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="aspect-video bg-muted/20">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-3 bg-muted/10 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Text */}
          {!isGenerating && successCount > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Select your preferred image
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Click on any generated image to preview it in full size, or
                    use the select button to choose it as your blog post&apos;s
                    featured image. You can continue browsing and comparing
                    images after making a selection.
                    {mode === "edit" &&
                      " In edit mode, the blog post will be automatically saved with your selection."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={!!previewVariant} onOpenChange={() => closePreview()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{previewVariant?.styleLabel} Preview</DialogTitle>
                <DialogDescription>
                  {previewVariant?.image?.size} •{" "}
                  {previewVariant?.image?.quality} quality
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {previewVariant?.image && (
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="relative w-full max-h-[60vh] bg-muted/20 rounded-lg overflow-hidden">
                <Image
                  src={previewVariant.image.url}
                  alt={`${previewVariant.styleLabel} preview`}
                  width={800}
                  height={533}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {selectedVariant === previewVariant.id && (
                    <Badge variant="default" className="text-xs">
                      Currently Selected
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={closePreview}
                    type="button"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleSelectVariant(previewVariant);
                      // Don't close preview - let users continue browsing
                    }}
                    disabled={
                      disabled ||
                      selectedVariant === previewVariant.id ||
                      updatingBlogPost
                    }
                    type="button"
                  >
                    {updatingBlogPost ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : selectedVariant === previewVariant.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {mode === "edit"
                          ? "Select & Save"
                          : "Select This Image"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Prompt Details */}
              {previewVariant.image.revisedPrompt && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">AI Prompt Used:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {previewVariant.image.revisedPrompt}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
