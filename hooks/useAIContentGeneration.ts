import { useState, useCallback } from "react";
import type {
  ContentGenerationRequest,
  ContentGenerationResponse,
  BlogPost,
} from "@/lib/types/ai/content-generation.type";

interface UseAIContentGenerationResult {
  generateContent: (request: ContentGenerationRequest) => Promise<void>;
  isGenerating: boolean;
  generatedContent: string | BlogPost | null;
  error: string | null;
  progress: number;
  metadata: {
    wordCount: number;
    generationTime: number;
    model: string;
    tokensUsed: number;
  } | null;
}

export function useAIContentGeneration(): UseAIContentGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<
    string | BlogPost | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<{
    wordCount: number;
    generationTime: number;
    model: string;
    tokensUsed: number;
  } | null>(null);

  const generateContent = useCallback(
    async (request: ContentGenerationRequest) => {
      setIsGenerating(true);
      setError(null);
      setProgress(0);
      setGeneratedContent(null);
      setMetadata(null);

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 20;
          });
        }, 500);

        const response = await fetch("/api/ai/content/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data: {
          success: boolean;
          data: ContentGenerationResponse;
          error?: string;
        } = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate content");
        }

        setGeneratedContent(data.data.content);
        setMetadata({
          wordCount: data.data.wordCount,
          generationTime: data.data.generationTime,
          model: data.data.model,
          tokensUsed: data.data.tokensUsed,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        setProgress(0);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    generateContent,
    isGenerating,
    generatedContent,
    error,
    progress,
    metadata,
  };
}
