"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface PartialBlogObject {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  metaDescription?: string;
  slug?: string;
  category?: string;
}

interface StreamingContentDisplayProps {
  content: string | null;
  blogObject: PartialBlogObject | null;
  contentType: string;
  isGenerating: boolean;
  error?: string | null;
}

export function StreamingContentDisplay({
  content,
  blogObject,
  contentType,
  isGenerating,
  error,
}: StreamingContentDisplayProps) {
  const handleCopy = async () => {
    let textToCopy = "";

    if (contentType === "blog-post" && blogObject) {
      textToCopy = `${blogObject.title || ""}\n\n${blogObject.content || ""}`;
    } else if (content) {
      textToCopy = content;
    }

    if (!textToCopy.trim()) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Content copied to clipboard");
    } catch {
      toast.error("Failed to copy content");
    }
  };

  const handleDownload = () => {
    let downloadContent = "";

    if (contentType === "blog-post" && blogObject) {
      downloadContent = `# ${blogObject.title || "Untitled"}\n\n${
        blogObject.content || ""
      }`;
    } else if (content) {
      downloadContent = content;
    }

    if (!downloadContent.trim()) return;

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

  const hasContent = content || blogObject;

  if (!hasContent && !isGenerating) {
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
          <Badge variant="secondary">
            {isGenerating ? "Streaming..." : "Complete"}
          </Badge>
          {contentType === "blog-post" && (
            <Badge variant="outline">Blog Post</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!hasContent}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!hasContent}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {contentType === "blog-post" ? (
          <BlogPostDisplay
            blogObject={blogObject}
            isGenerating={isGenerating}
          />
        ) : (
          <TextContentDisplay content={content} isGenerating={isGenerating} />
        )}
      </div>
    </div>
  );
}

function BlogPostDisplay({
  blogObject,
  isGenerating,
}: {
  blogObject: PartialBlogObject | null;
  isGenerating: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="font-semibold mb-2">Title</h3>
        <div className="p-3 bg-muted/50 rounded-lg border min-h-[2.5rem]">
          {blogObject?.title ? (
            blogObject.title
          ) : isGenerating ? (
            <Skeleton className="h-6 w-3/4" />
          ) : (
            <span className="text-muted-foreground">
              No title generated yet
            </span>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <h3 className="font-semibold mb-2">Excerpt</h3>
        <div className="p-3 bg-muted/50 rounded-lg border min-h-[4rem]">
          {blogObject?.excerpt ? (
            blogObject.excerpt
          ) : isGenerating ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <span className="text-muted-foreground">
              No excerpt generated yet
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold mb-2">Content</h3>
        <div className="p-4 bg-muted/50 rounded-lg border min-h-[12rem]">
          {blogObject?.content ? (
            <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
              {blogObject.content}
            </div>
          ) : isGenerating ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <span className="text-muted-foreground">
              No content generated yet
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {(blogObject?.tags || isGenerating) && (
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blogObject?.tags ? (
              blogObject.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))
            ) : (
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meta Description */}
      {(blogObject?.metaDescription || isGenerating) && (
        <div>
          <h3 className="font-semibold mb-2">Meta Description</h3>
          <div className="p-3 bg-muted/50 rounded-lg border text-sm min-h-[3rem]">
            {blogObject?.metaDescription ? (
              blogObject.metaDescription
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TextContentDisplay({
  content,
  isGenerating,
}: {
  content: string | null;
  isGenerating: boolean;
}) {
  console.log(content);
  return (
    <div className="prose dark:prose-invert max-w-none">
      <div className="bg-muted/50 p-4 rounded-lg border min-h-[12rem]">
        {content ? (
          <pre className="whitespace-pre-wrap text-sm font-sans">{content}</pre>
        ) : isGenerating ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <span className="text-muted-foreground">
            No content generated yet
          </span>
        )}
      </div>
    </div>
  );
}
