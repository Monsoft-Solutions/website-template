"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAIContentGeneration } from "@/hooks/useAIContentGeneration";
import { ContentConfigurationPanel } from "@/components/admin/ai/content-creator/content-configuration-panel";
import { GeneratedContentDisplay } from "@/components/admin/ai/content-creator/generated-content-display";
import type { ContentGenerationRequest } from "@/lib/types/ai/content-generation.type";

export default function AICreatorPage() {
  const {
    generateContent,
    isGenerating,
    generatedContent,
    error,
    progress,
    metadata,
  } = useAIContentGeneration();

  const [currentContentType, setCurrentContentType] = useState("blog-post");

  const handleGenerate = async (request: ContentGenerationRequest) => {
    setCurrentContentType(request.type);
    await generateContent(request);
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
            <h1 className="text-2xl font-bold">AI Content Creator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate high-quality content using advanced AI models. Create blog
            posts, service descriptions, marketing copy, and more.
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
                  Your AI-generated content will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <GeneratedContentDisplay
                  content={generatedContent}
                  metadata={metadata}
                  error={error}
                  contentType={currentContentType}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
