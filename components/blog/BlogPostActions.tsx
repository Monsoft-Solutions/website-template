"use client";

import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";

interface BlogPostActionsProps {
  title: string;
  url: string;
}

export function BlogPostActions({ title, url }: BlogPostActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (platform in shareUrls) {
      window.open(
        shareUrls[platform as keyof typeof shareUrls],
        "_blank",
        "width=600,height=400"
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Share2 className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Share this article</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => handleShare("twitter")}
        >
          <Twitter className="size-4" />
          <span className="sr-only">Share on Twitter</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => handleShare("facebook")}
        >
          <Facebook className="size-4" />
          <span className="sr-only">Share on Facebook</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => handleShare("linkedin")}
        >
          <Linkedin className="size-4" />
          <span className="sr-only">Share on LinkedIn</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={handleCopy}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
