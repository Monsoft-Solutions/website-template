/**
 * AI Library - Main Export File
 *
 * This file exports all AI functionality for easy importing
 */

// Core Infrastructure
export { ModelManager, MODEL_CONFIG } from "./core/model-manager";
export { MessageHandler } from "./core/message-handler";
export {
  AITransport,
  createAITransport,
  createChatTransport,
  createAgentTransport,
  createContentTransport,
  createImageTransport,
} from "./core/transport";

// Content Creation and Refinement
export { ContentCreator } from "./content/creator";
export { ContentRefiner } from "./content/refiner";

// Image Generation Services
export { ImageGenerator } from "./image/image-generator";
export { PromptGenerator } from "./image/prompt-generator";

// Types
export type {
  AIProvider,
  AIModelConfig,
  AIConfig,
  AIFeatureFlags,
  AIGenerationOptions,
} from "../types/ai/ai-config.type";

export type {
  ContentType,
  ContentTone,
  BlogPost,
  BlogPostSchema,
  ServiceDescriptionInput,
  ContentGenerationRequest,
  ContentGenerationResponse,
  ContentRefinementOptions,
  SEOOptimizationOptions,
} from "../types/ai/content-generation.type";

// Image Generation Types
export type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  GeneratedImage,
  ImagePromptSuggestion,
  BlogContent,
  ImageGenerationParams,
  ImageSize,
  ImageQuality,
  ImageStyle,
} from "../types/ai/image";

// Re-export AI SDK types for convenience
export type { UIMessage, ModelMessage } from "ai";

// Import classes for internal use
import { ModelManager } from "./core/model-manager";
import { PromptGenerator } from "./image/prompt-generator";
import { ImageGenerator } from "./image/image-generator";
import { getDefaultUserImageParameters } from "@/lib/types/ai/image";

/**
 * Main AI Library Class
 * Central interface for all AI operations
 */
export class AILibrary {
  private modelManager: ModelManager;
  private promptGenerator: PromptGenerator;
  private imageGenerator: ImageGenerator;

  constructor() {
    this.modelManager = new ModelManager();
    this.promptGenerator = new PromptGenerator();
    this.imageGenerator = new ImageGenerator();
  }

  /**
   * Get model manager instance
   */
  getModelManager() {
    return this.modelManager;
  }

  /**
   * Get prompt generator instance
   */
  getPromptGenerator() {
    return this.promptGenerator;
  }

  /**
   * Get image generator instance
   */
  getImageGenerator() {
    return this.imageGenerator;
  }

  /**
   * Generate image for blog post
   */
  async generateBlogImage(
    title: string,
    content: string,
    excerpt?: string,
    options?: {
      model?: string;
      style?: string;
      size?: string;
      quality?: string;
    }
  ) {
    // Generate prompt first with default user parameters
    const defaultUserParams = getDefaultUserImageParameters();
    const promptSuggestion = await this.promptGenerator.generatePrompt(
      {
        title,
        content,
        excerpt,
      },
      defaultUserParams
    );

    // Generate image with suggested prompt and options
    const model = (options?.model || "gpt-image-1") as
      | "dalle-3"
      | "gpt-image-1";

    // Create properly typed params based on the model
    if (model === "dalle-3") {
      const params = {
        model: "dalle-3" as const,
        style: (options?.style || "modern") as
          | "photorealistic"
          | "digital_art"
          | "illustration"
          | "minimalist"
          | "abstract"
          | "corporate"
          | "modern"
          | "artistic"
          | "natural",
        dalleStyle: "natural" as "natural" | "vivid",
        size: (options?.size || "1024x1024") as
          | "1024x1024"
          | "1792x1024"
          | "1024x1792",
        quality: (options?.quality || "standard") as "standard" | "hd",
      };
      return this.imageGenerator.generateImage(promptSuggestion.prompt, params);
    } else {
      const params = {
        model: "gpt-image-1" as const,
        style: (options?.style || "modern") as
          | "photorealistic"
          | "digital_art"
          | "illustration"
          | "minimalist"
          | "abstract"
          | "corporate"
          | "modern"
          | "artistic"
          | "natural",
        size: (options?.size || "1536x1024") as
          | "1024x1024"
          | "1536x1024"
          | "1024x1536",
        quality: (options?.quality || "medium") as "low" | "medium" | "high",
      };
      return this.imageGenerator.generateImage(promptSuggestion.prompt, params);
    }
  }

  /**
   * Generate multiple blog images with different styles
   */
  async generateBlogImageVariants(
    title: string,
    content: string,
    excerpt?: string,
    count: number = 3
  ) {
    const styles = ["modern", "artistic", "minimalist"];
    const promises = styles.slice(0, count).map((style) =>
      this.generateBlogImage(title, content, excerpt, {
        style,
        model: "gpt-image-1",
      })
    );

    return Promise.all(promises);
  }

  /**
   * Validate that the AI library is properly configured
   */
  validateSetup(): { valid: boolean; missing: string[]; errors: string[] } {
    const errors: string[] = [];
    const envValidation = this.modelManager.validateEnvironment();

    if (!envValidation.valid) {
      errors.push("Missing required environment variables");
    }

    // Check feature flags
    const featuresEnabled = {
      contentGeneration: process.env.AI_CONTENT_GENERATION_ENABLED === "true",
      chat: process.env.AI_CHAT_ENABLED === "true",
      imageGeneration: process.env.AI_IMAGE_GENERATION_ENABLED === "true",
      agents: process.env.AI_AGENTS_ENABLED === "true",
    };

    if (!Object.values(featuresEnabled).some(Boolean)) {
      errors.push("No AI features are enabled");
    }

    return {
      valid: envValidation.valid && errors.length === 0,
      missing: envValidation.missing,
      errors,
    };
  }

  /**
   * Get configuration summary
   */
  getConfig() {
    return {
      defaultModel:
        process.env.AI_DEFAULT_MODEL || "claude-3-5-sonnet-20241022",
      fallbackModel: process.env.AI_FALLBACK_MODEL || "gpt-4o",
      maxTokens: parseInt(process.env.AI_MAX_TOKENS || "4000"),
      temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
      features: {
        contentGeneration: process.env.AI_CONTENT_GENERATION_ENABLED === "true",
        chat: process.env.AI_CHAT_ENABLED === "true",
        imageGeneration: process.env.AI_IMAGE_GENERATION_ENABLED === "true",
        agents: process.env.AI_AGENTS_ENABLED === "true",
      },
      cache: {
        enabled: process.env.AI_CACHE_ENABLED === "true",
        ttl: parseInt(process.env.AI_CACHE_TTL || "3600"),
      },
      rateLimit: {
        requests: parseInt(process.env.AI_RATE_LIMIT_REQUESTS || "100"),
        window: parseInt(process.env.AI_RATE_LIMIT_WINDOW || "3600"),
      },
    };
  }
}

/**
 * Global AI library instance
 */
export const ai = new AILibrary();
