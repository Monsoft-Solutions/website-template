"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Database,
  Eye,
  Loader2,
  Briefcase,
} from "lucide-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ContentConfigurationPanel } from "./content-creator/content-configuration-panel";
import { AIBlogPostSavePanel } from "./content-creator/ai-blog-post-save-panel";
import { AIServiceSavePanel } from "./content-creator/ai-service-save-panel";
import {
  BlogPostSchema,
  ServiceSchema,
} from "@/lib/types/ai/content-generation.type";
import type {
  ContentGenerationRequest,
  BlogPost,
  Service,
  ContentType,
} from "@/lib/types/ai/content-generation.type";

type TabType = "generate" | "review" | "saved";

interface SavedContentInfo {
  id: string;
  slug: string;
  type: ContentType;
}

export function UnifiedAIContentGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>("generate");
  const [currentContentType, setCurrentContentType] =
    useState<ContentType>("blog-post");
  const [generatedContent, setGeneratedContent] = useState<
    BlogPost | Service | null
  >(null);
  const [savedContentInfo, setSavedContentInfo] =
    useState<SavedContentInfo | null>(null);

  // Use AI SDK hooks for streaming different content types
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
    object: serviceObject,
    submit: submitService,
    isLoading: isServiceLoading,
    error: serviceError,
  } = useObject({
    api: "/api/ai/content/stream-object",
    schema: ServiceSchema,
  });

  // Determine current loading state and error
  const isGenerating = isBlogLoading || isServiceLoading;
  const error = blogError || serviceError;
  const currentObject =
    currentContentType === "blog-post" ? blogObject : serviceObject;

  // Handle completion of generation
  useEffect(() => {
    if (!isGenerating && currentObject) {
      setGeneratedContent(currentObject as BlogPost | Service);
      setActiveTab("review");
      toast.success(
        `${
          currentContentType === "blog-post" ? "Blog post" : "Service"
        } generated successfully!`
      );
    }
  }, [isGenerating, currentObject, currentContentType]);

  const handleGenerate = async (request: ContentGenerationRequest) => {
    setCurrentContentType(request.type);

    try {
      if (request.type === "blog-post") {
        await submitBlogPost(request);
      } else if (request.type === "service-description") {
        await submitService(request);
      } else {
        toast.error(
          "This content type is not yet supported for structured generation"
        );
        return;
      }
    } catch (error) {
      toast.error(`Failed to generate ${request.type}`);
      console.error("Generation error:", error);
    }
  };

  const handleContentSaved = (id: string, slug: string) => {
    setSavedContentInfo({ id, slug, type: currentContentType });
    setActiveTab("saved");
  };

  const handleStartNew = () => {
    setGeneratedContent(null);
    setSavedContentInfo(null);
    setActiveTab("generate");
  };

  // Calculate progress based on content availability
  const progress = isGenerating
    ? currentObject
      ? 80
      : 40
    : generatedContent
    ? 100
    : 0;

  const tabs = [
    {
      id: "generate" as const,
      label: "Generate",
      icon: Sparkles,
      description: "Create AI-generated content",
      disabled: false,
    },
    {
      id: "review" as const,
      label: "Review & Save",
      icon: FileText,
      description: "Review generated content and save to database",
      disabled: !generatedContent,
    },
    {
      id: "saved" as const,
      label: "Saved",
      icon: Database,
      description: "View saved content information",
      disabled: !savedContentInfo,
    },
  ];

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const renderStreamingContent = () => {
    if (!isGenerating && !currentObject && !generatedContent) {
      return (
        <div className="h-full flex items-center justify-center text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Configure your content settings and click &ldquo;Generate
                Content&rdquo; to start
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (currentContentType === "blog-post" && blogObject) {
      return (
        <div className="space-y-6">
          {blogObject.title && (
            <div>
              <Badge variant="outline" className="mb-2">
                Title
              </Badge>
              <h2 className="text-xl font-bold">{blogObject.title}</h2>
            </div>
          )}
          {blogObject.excerpt && (
            <div>
              <Badge variant="outline" className="mb-2">
                Excerpt
              </Badge>
              <p className="text-muted-foreground">{blogObject.excerpt}</p>
            </div>
          )}
          {blogObject.metaDescription && (
            <div>
              <Badge variant="outline" className="mb-2">
                Meta Description
              </Badge>
              <p className="text-sm bg-muted p-2 rounded">
                {blogObject.metaDescription}
              </p>
            </div>
          )}
          {blogObject.tags && blogObject.tags.length > 0 && (
            <div>
              <Badge variant="outline" className="mb-2">
                Tags
              </Badge>
              <div className="flex flex-wrap gap-2">
                {blogObject.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {blogObject.content && (
            <div>
              <Badge variant="outline" className="mb-2">
                Content ({getWordCount(blogObject.content)} words)
              </Badge>
              <div className="prose prose-sm max-w-none bg-muted/50 p-4 rounded">
                {blogObject.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
          {blogObject.category && (
            <div>
              <Badge variant="outline" className="mb-2">
                Suggested Category
              </Badge>
              <Badge variant="secondary">{blogObject.category}</Badge>
            </div>
          )}
        </div>
      );
    }

    if (currentContentType === "service-description" && serviceObject) {
      return (
        <div className="space-y-6">
          {serviceObject.title && (
            <div>
              <Badge variant="outline" className="mb-2">
                Title
              </Badge>
              <h2 className="text-xl font-bold">{serviceObject.title}</h2>
            </div>
          )}
          {serviceObject.shortDescription && (
            <div>
              <Badge variant="outline" className="mb-2">
                Short Description
              </Badge>
              <p className="text-muted-foreground">
                {serviceObject.shortDescription}
              </p>
            </div>
          )}
          {serviceObject.category && (
            <div>
              <Badge variant="outline" className="mb-2">
                Category
              </Badge>
              <Badge variant="secondary">{serviceObject.category}</Badge>
            </div>
          )}
          {serviceObject.features && serviceObject.features.length > 0 && (
            <div>
              <Badge variant="outline" className="mb-2">
                Features
              </Badge>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {serviceObject.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          {serviceObject.benefits && serviceObject.benefits.length > 0 && (
            <div>
              <Badge variant="outline" className="mb-2">
                Benefits
              </Badge>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {serviceObject.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          {serviceObject.timeline && (
            <div>
              <Badge variant="outline" className="mb-2">
                Timeline
              </Badge>
              <p className="text-sm">{serviceObject.timeline}</p>
            </div>
          )}
          {serviceObject.fullDescription && (
            <div>
              <Badge variant="outline" className="mb-2">
                Full Description ({getWordCount(serviceObject.fullDescription)}{" "}
                words)
              </Badge>
              <div className="prose prose-sm max-w-none bg-muted/50 p-4 rounded">
                {serviceObject.fullDescription
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          )}
          {serviceObject.deliverables &&
            serviceObject.deliverables.length > 0 && (
              <div>
                <Badge variant="outline" className="mb-2">
                  Deliverables
                </Badge>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {serviceObject.deliverables.map((deliverable, index) => (
                    <li key={index}>{deliverable}</li>
                  ))}
                </ul>
              </div>
            )}
          {serviceObject.targetAudience && (
            <div>
              <Badge variant="outline" className="mb-2">
                Target Audience
              </Badge>
              <p className="text-sm">{serviceObject.targetAudience}</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "blog-post":
        return FileText;
      case "service-description":
        return Briefcase;
      default:
        return FileText;
    }
  };

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
            <h1 className="text-2xl font-bold">AI Content Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate high-quality content using AI with real-time streaming.
            Create blog posts, service descriptions, and more with database
            integration.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-muted p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className="relative"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Content based on active tab */}
        {activeTab === "generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Content Configuration
                  </CardTitle>
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

            {/* Streaming Output Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Generated Content
                    {isGenerating && (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    )}
                  </CardTitle>
                  {isGenerating && (
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        Generating{" "}
                        {currentContentType === "blog-post"
                          ? "blog post"
                          : "service description"}{" "}
                        with AI... {progress}%
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {renderStreamingContent()}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Review Tab */}
        {activeTab === "review" && generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentContentType === "blog-post" && (
              <AIBlogPostSavePanel
                blogPost={generatedContent as BlogPost}
                onSaved={handleContentSaved}
              />
            )}
            {currentContentType === "service-description" && (
              <AIServiceSavePanel
                service={generatedContent as Service}
                onSaved={handleContentSaved}
              />
            )}
          </motion.div>
        )}

        {/* Saved Tab */}
        {activeTab === "saved" && savedContentInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = getContentTypeIcon(savedContentInfo.type);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  Content Saved Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-900">
                        Your{" "}
                        {savedContentInfo.type === "blog-post"
                          ? "blog post"
                          : "service"}{" "}
                        has been saved to the database!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        ID: {savedContentInfo.id}
                      </p>
                      <p className="text-sm text-green-700">
                        Slug: {savedContentInfo.slug}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleStartNew} variant="default">
                    Generate Another
                  </Button>
                  {savedContentInfo.type === "blog-post" && (
                    <>
                      <Button
                        onClick={() =>
                          window.open(
                            `/admin/blog/${savedContentInfo.id}`,
                            "_blank"
                          )
                        }
                        variant="outline"
                      >
                        Edit Blog Post
                      </Button>
                      <Button
                        onClick={() =>
                          window.open(
                            `/blog/${savedContentInfo.slug}`,
                            "_blank"
                          )
                        }
                        variant="outline"
                      >
                        View Published Post
                      </Button>
                    </>
                  )}
                  {savedContentInfo.type === "service-description" && (
                    <>
                      <Button
                        onClick={() =>
                          window.open(
                            `/admin/services/${savedContentInfo.id}`,
                            "_blank"
                          )
                        }
                        variant="outline"
                      >
                        Edit Service
                      </Button>
                      <Button
                        onClick={() =>
                          window.open(
                            `/services/${savedContentInfo.slug}`,
                            "_blank"
                          )
                        }
                        variant="outline"
                      >
                        View Service Page
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
