import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { PromptGenerator } from "@/lib/ai/image/prompt-generator";
import { ImageGenerator } from "@/lib/ai/image/image-generator";
import {
  BlogContentSchema,
  type ImageGenerationParams,
  type GeneratedImage,
} from "@/lib/types/ai/image";
import { ApiResponse } from "@/lib/types/api-response.type";
import { uploadBase64ToBlob } from "@/lib/utils/blob-upload";

interface ImageVariant {
  id: string;
  style: string;
  styleLabel: string;
  prompt: string;
  image: GeneratedImage | null;
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

// Rate limiting configuration
const MAX_CONCURRENT_GENERATIONS = 3;
const GENERATION_TIMEOUT_MS = 60000 * 3; // 3 minutes per generation
const MAX_RETRIES = 2;

// Simple semaphore for controlling concurrency
class Semaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      if (next) {
        this.permits--;
        next();
      }
    }
  }
}

const generationSemaphore = new Semaphore(MAX_CONCURRENT_GENERATIONS);

// Retry wrapper with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain errors
      if (
        lastError.message.includes("rate limit") ||
        lastError.message.includes("quota") ||
        lastError.message.includes("unauthorized")
      ) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    await requireAdmin();

    const body = await request.json();
    const { blogContent } = body;

    // Validate blog content
    const validatedContent = BlogContentSchema.parse(blogContent);

    if (!validatedContent.title.trim() || !validatedContent.content.trim()) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Title and content are required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const promptGenerator = new PromptGenerator();
    const imageGenerator = new ImageGenerator();

    // Define 3 different styles to generate
    const styleVariants = [
      {
        id: "modern-professional",
        style: "modern",
        styleLabel: "Modern Professional",
        userParams: {
          imageStyle: "realistic_photo" as const,
          mood: "professional" as const,
          visualAesthetic: "modern_contemporary" as const,
          colorPalette: "cool_colors" as const,
          aspectRatio: "16:9" as const,
          focusLevel: "medium_shot" as const,
          textOverlayAreaNeeded: false,
        },
      },
      {
        id: "creative-artistic",
        style: "artistic",
        styleLabel: "Creative Artistic",
        userParams: {
          imageStyle: "flat_vector" as const,
          mood: "energetic" as const,
          visualAesthetic: "futuristic" as const,
          colorPalette: "warm_colors" as const,
          aspectRatio: "16:9" as const,
          focusLevel: "wide_scene" as const,
          textOverlayAreaNeeded: false,
        },
      },
      {
        id: "minimalist-clean",
        style: "minimalist",
        styleLabel: "Minimalist Clean",
        userParams: {
          imageStyle: "minimalist_illustration" as const,
          mood: "calm" as const,
          visualAesthetic: "minimalist" as const,
          colorPalette: "pastel_tones" as const,
          aspectRatio: "16:9" as const,
          focusLevel: "single_subject" as const,
          textOverlayAreaNeeded: false,
        },
      },
    ];

    const variants: ImageVariant[] = [];

    // Generate prompts and images for all variants in parallel with improved error handling
    console.log(
      "Generating prompts and images for all variants in parallel with rate limiting..."
    );

    const variantGenerationPromises = styleVariants.map(async (variant) => {
      // Acquire semaphore permit for rate limiting
      await generationSemaphore.acquire();

      try {
        return await withTimeout(
          withRetry(async () => {
            // Generate prompt
            const promptSuggestion = await promptGenerator.generatePrompt(
              validatedContent,
              variant.userParams
            );

            const prompt =
              promptSuggestion.xmlPrompt || promptSuggestion.prompt;

            if (!prompt) {
              throw new Error("Failed to generate prompt");
            }

            // Generate image immediately after prompt generation
            const params: ImageGenerationParams = {
              model: "gpt-image-1",
              style: variant.style as "modern" | "artistic" | "minimalist",
              size: "1536x1024", // Default to landscape for blog posts
              quality: "high",
            };

            const generatedImage = await imageGenerator.generateImageFromXML(
              prompt,
              params
            );

            // Upload the generated image to storage
            let uploadedImageUrl = generatedImage.url;
            if (generatedImage.base64) {
              try {
                const uploadResult = await uploadBase64ToBlob(
                  generatedImage.base64,
                  "image/png",
                  { folder: "ai-generated" }
                );
                uploadedImageUrl = uploadResult.url;
                generatedImage.url = uploadedImageUrl;

                // Clear base64 data to reduce memory usage
                generatedImage.base64 = "";
              } catch (uploadError) {
                console.error(
                  `Failed to upload generated image for ${variant.id}:`,
                  uploadError
                );
                // Continue with the original URL if upload fails
              }
            }

            return {
              id: variant.id,
              style: variant.style,
              styleLabel: variant.styleLabel,
              prompt,
              image: generatedImage,
            } as ImageVariant;
          }),
          GENERATION_TIMEOUT_MS
        );
      } catch (error) {
        console.error(`Failed to generate variant ${variant.id}:`, error);
        return {
          id: variant.id,
          style: variant.style,
          styleLabel: variant.styleLabel,
          prompt: "",
          image: null,
          error: error instanceof Error ? error.message : "Unknown error",
        } as ImageVariant;
      } finally {
        // Always release the semaphore permit
        generationSemaphore.release();
      }
    });

    // Wait for all variants to complete
    const generatedVariants = await Promise.all(variantGenerationPromises);
    variants.push(...generatedVariants);

    const totalGenerationTime = Date.now() - startTime;
    const successCount = variants.filter((v) => v.image && !v.error).length;
    const errorCount = variants.filter((v) => v.error).length;

    const response: ImageVariantsResponse = {
      variants,
      metadata: {
        totalGenerationTime,
        successCount,
        errorCount,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: `Generated ${successCount} image variants successfully`,
    } as ApiResponse<ImageVariantsResponse>);
  } catch (error) {
    console.error("Image variants generation failed:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate image variants",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
