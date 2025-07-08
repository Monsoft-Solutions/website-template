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
  AITransportFactory,
  createAITransport,
} from "./core/transport";

// Content Creation and Refinement
export { ContentCreator } from "./content/creator";
export { ContentRefiner } from "./content/refiner";

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

// Re-export AI SDK types for convenience
export type { UIMessage, ModelMessage } from "ai";

// Import classes for internal use
import { ModelManager } from "./core/model-manager";
import { MessageHandler } from "./core/message-handler";

/**
 * Main AI Library class - Central hub for all AI functionality
 */
export class AILibrary {
  public modelManager: ModelManager;
  public messageHandler: MessageHandler;

  constructor() {
    this.modelManager = new ModelManager();
    this.messageHandler = new MessageHandler();
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
