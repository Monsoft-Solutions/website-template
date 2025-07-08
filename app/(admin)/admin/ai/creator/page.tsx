"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useCompletion } from "@ai-sdk/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentConfigurationPanel } from "@/components/admin/ai/content-creator/content-configuration-panel";
import { StreamingContentDisplay } from "@/components/admin/ai/content-creator/streaming-content-display";
import { BlogPostSchema } from "@/lib/types/ai/content-generation.type";
import type { ContentGenerationRequest } from "@/lib/types/ai/content-generation.type";

interface PartialBlogObject {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  metaDescription?: string;
  slug?: string;
  category?: string;
}

// Type-safe conversion function for AI SDK partial object to PartialBlogObject
const convertToPartialBlogObject = (obj: unknown): PartialBlogObject | null => {
  if (!obj) return null;

  const blogObj = obj as PartialBlogObject;
  return {
    title: blogObj.title || undefined,
    content: blogObj.content || undefined,
    excerpt: blogObj.excerpt || undefined,
    tags: blogObj.tags || undefined,
    metaDescription: blogObj.metaDescription || undefined,
    slug: blogObj.slug || undefined,
    category: blogObj.category || undefined,
  };
};

export default function AICreatorPage() {
  const [currentContentType, setCurrentContentType] = useState("blog-post");

  // Use AI SDK hooks for streaming
  const {
    object: blogObject,
    submit: submitBlogPost,
    isLoading: isBlogLoading,
    error: blogError,
  } = useObject({
    api: "/api/ai/content/stream-object",
    schema: BlogPostSchema,
  });

  const {
    completion,
    complete: submitCompletion,
    isLoading: isCompletionLoading,
    error: completionError,
  } = useCompletion({
    api: "/api/ai/content/stream-text",
    fetch: (url, options) => {
      console.log(url, options);
      return fetch(url, options);
    },
  });

  const handleGenerate = async (request: ContentGenerationRequest) => {
    setCurrentContentType(request.type);

    if (request.type === "blog-post") {
      // Use object streaming for blog posts
      await submitBlogPost(request);
    } else {
      // Use completion streaming for other content types
      await submitCompletion("", {
        body: request,
      });
    }
  };

  // Determine which content and metadata to show
  const isGenerating = isBlogLoading || isCompletionLoading;
  const error = blogError || completionError;
  const generatedContent =
    currentContentType === "blog-post"
      ? blogObject || null
      : completion || null;

  // Calculate progress based on content availability
  const progress = isGenerating ? (generatedContent ? 80 : 40) : 100;

  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">AI Content Creator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate high-quality content using advanced AI models. Create blog
            posts, service descriptions, marketing copy, and more with real-time
            streaming.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Content Configuration</CardTitle>
                <CardDescription>
                  Configure your content generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <ContentConfigurationPanel
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  progress={progress}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  Your AI-generated content appears here in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <StreamingContentDisplay
                  content={
                    currentContentType === "blog-post" ? null : completion
                  }
                  blogObject={
                    currentContentType === "blog-post"
                      ? convertToPartialBlogObject(blogObject)
                      : null
                  }
                  contentType={currentContentType}
                  isGenerating={isGenerating}
                  error={error?.message || null}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
