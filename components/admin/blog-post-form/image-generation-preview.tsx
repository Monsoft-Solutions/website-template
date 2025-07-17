"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check, X, Copy, ExternalLink } from "lucide-react";
import { LoadingSpinner } from "@/components/layout/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { PromptGenerator } from "@/lib/ai/image/prompt-generator";
import type { GeneratedImage } from "@/lib/types/ai/image";

interface ImageGenerationPreviewProps {
  generatedImage?: GeneratedImage;
  isGenerating: boolean;
  onAccept: () => void;
  onRegenerate: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export function ImageGenerationPreview({
  generatedImage,
  isGenerating,
  onAccept,
  onRegenerate,
  onReject,
  disabled = false,
}: ImageGenerationPreviewProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopyPrompt = async () => {
    if (generatedImage?.prompt) {
      await navigator.clipboard.writeText(generatedImage.prompt);
      toast.success("Prompt copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (generatedImage?.url) {
      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = generatedImage.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `generated-image-${generatedImage.generatedAt}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generating Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <LoadingSpinner className="flex items-center justify-center" />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Creating your image using AI...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take 10-30 seconds depending on complexity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!generatedImage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Image Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Generated image will appear here
              </p>
              <p className="text-xs text-muted-foreground">
                Configure your settings and click &ldquo;Generate Image&rdquo;
                to start
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Image Preview</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">AI Generated</Badge>
            {generatedImage.quality === "hd" && (
              <Badge variant="outline">HD Quality</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Preview */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <LoadingSpinner className="flex items-center justify-center" />
            </div>
          )}
          <Image
            src={generatedImage.url}
            alt="Generated blog post image"
            fill
            className="object-cover"
            onLoad={() => setImageLoading(false)}
            onLoadStart={() => setImageLoading(true)}
            onError={() => {
              setImageLoading(false);
              toast.error("Failed to load generated image");
            }}
          />
        </div>

        {/* Image Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Image Details</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 font-medium">
                    {generatedImage.size}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="ml-2 font-medium capitalize">
                    {generatedImage.quality}
                  </span>
                </div>
                {generatedImage.seed && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Seed:</span>
                    <span className="ml-2 font-medium">
                      {generatedImage.seed}
                    </span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-muted-foreground">Generated:</span>
                  <span className="ml-2 font-medium">
                    {new Date(generatedImage.generatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Prompt Information */}
              <div className="space-y-2 border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Prompt Used:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPrompt}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy prompt to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-xs bg-background p-2 rounded border max-h-20 overflow-y-auto">
                  {PromptGenerator.isXMLPrompt(generatedImage.prompt) ? (
                    <div className="space-y-2">
                      <p className="text-green-600 font-medium">
                        XML Prompt Used
                      </p>
                      <p>
                        {PromptGenerator.extractDisplayPrompt(
                          generatedImage.prompt
                        )}
                      </p>
                    </div>
                  ) : (
                    <p>{generatedImage.prompt}</p>
                  )}
                </div>

                {generatedImage.xmlPrompt && (
                  <details className="mt-2">
                    <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
                      View Full XML Prompt Structure
                    </summary>
                    <pre className="text-xs bg-background p-2 rounded border mt-1 overflow-x-auto max-h-40 overflow-y-auto">
                      {generatedImage.xmlPrompt}
                    </pre>
                  </details>
                )}

                {generatedImage.revisedPrompt &&
                  generatedImage.revisedPrompt !== generatedImage.prompt && (
                    <div>
                      <span className="text-muted-foreground">
                        AI Revised Prompt:
                      </span>
                      <p className="text-xs bg-background p-2 rounded border max-h-20 overflow-y-auto mt-1">
                        {generatedImage.revisedPrompt}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onAccept}
            disabled={disabled || imageLoading}
            className="flex-1"
            variant="default"
          >
            <Check className="mr-2 h-4 w-4" />
            Accept & Use Image
          </Button>

          <Button
            type="button"
            onClick={onRegenerate}
            disabled={disabled || imageLoading}
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New
          </Button>

          <Button
            type="button"
            onClick={onReject}
            disabled={disabled || imageLoading}
            variant="ghost"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="pt-2 border-t space-y-2">
          <Button
            type="button"
            onClick={handleDownload}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Size
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
