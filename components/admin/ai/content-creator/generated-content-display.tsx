"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { BlogPost, Service } from "@/lib/types/ai/content-generation.type";

interface GeneratedContentDisplayProps {
  content: BlogPost | Service | string | null;
  metadata?: {
    wordCount: number;
    generationTime: number;
    model: string;
    tokensUsed: number;
  } | null;
  error?: string | null;
  contentType: string;
}

// Type guards to determine content type
const isBlogPost = (
  content: BlogPost | Service | string
): content is BlogPost => {
  return (
    typeof content === "object" && "content" in content && "excerpt" in content
  );
};

const isService = (
  content: BlogPost | Service | string
): content is Service => {
  return (
    typeof content === "object" &&
    "fullDescription" in content &&
    "shortDescription" in content
  );
};

export function GeneratedContentDisplay({
  content,
  metadata,
  error,
  contentType,
}: GeneratedContentDisplayProps) {
  const handleCopy = async () => {
    if (!content) return;

    let textToCopy = "";
    if (typeof content === "string") {
      textToCopy = content;
    } else if (isBlogPost(content)) {
      textToCopy = `# ${content.title}\n\n${content.content}`;
    } else if (isService(content)) {
      textToCopy = `# ${content.title}\n\n${content.fullDescription}`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Content copied to clipboard");
    } catch {
      toast.error("Failed to copy content");
    }
  };

  const handleDownload = () => {
    if (!content) return;

    let downloadContent = "";
    if (typeof content === "string") {
      downloadContent = content;
    } else if (isBlogPost(content)) {
      downloadContent = `# ${content.title}\n\n${content.content}`;
    } else if (isService(content)) {
      downloadContent = `# ${content.title}\n\n${content.fullDescription}`;
    }

    const blob = new Blob([downloadContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-generated-${contentType}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Content downloaded");
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-destructive rounded-full" />
          </div>
          <div>
            <h3 className="font-medium text-destructive">Generation Failed</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
          </div>
          <div>
            <h3 className="font-medium">Ready to create content</h3>
            <p className="text-sm text-muted-foreground">
              Configure your parameters and click &ldquo;Generate Content&rdquo;
              to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {metadata && (
            <>
              <Badge variant="secondary">{metadata.wordCount} words</Badge>
              <Badge variant="secondary">{metadata.generationTime}ms</Badge>
              <Badge variant="secondary">{metadata.model}</Badge>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {typeof content === "string" ? (
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        ) : isBlogPost(content) ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Title</h3>
              <div className="p-3 bg-muted/50 rounded-lg border">
                {content.title}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Excerpt</h3>
              <div className="p-3 bg-muted/50 rounded-lg border">
                {content.excerpt}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Content</h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="p-4 bg-muted/50 rounded-lg border text-sm whitespace-pre-wrap">
                  {content.content}
                </div>
              </div>
            </div>

            {content.tags && content.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {content.metaDescription && (
              <div>
                <h3 className="font-semibold mb-2">Meta Description</h3>
                <div className="p-3 bg-muted/50 rounded-lg border text-sm">
                  {content.metaDescription}
                </div>
              </div>
            )}
          </div>
        ) : isService(content) ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Title</h3>
              <div className="p-3 bg-muted/50 rounded-lg border">
                {content.title}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Short Description</h3>
              <div className="p-3 bg-muted/50 rounded-lg border">
                {content.shortDescription}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Full Description</h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="p-4 bg-muted/50 rounded-lg border text-sm whitespace-pre-wrap">
                  {content.fullDescription}
                </div>
              </div>
            </div>

            {content.features && content.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {content.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {content.benefits && content.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {content.benefits.map((benefit: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {content.metaDescription && (
              <div>
                <h3 className="font-semibold mb-2">Meta Description</h3>
                <div className="p-3 bg-muted/50 rounded-lg border text-sm">
                  {content.metaDescription}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
