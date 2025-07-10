/**
 * AI configuration types
 */

/**
 * Supported AI model providers
 */
export type AIProvider = "anthropic" | "openai";

/**
 * AI model configuration
 */
export type AIModelConfig = {
  provider: AIProvider;
  maxTokens: number;
  temperature: number;
  capabilities: string[];
  costPer1kTokens?: number;
  costPerImage?: number;
};

/**
 * AI configuration settings
 */
export type AIConfig = {
  defaultModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  cacheEnabled: boolean;
  cacheTtl: number;
  rateLimitRequests: number;
  rateLimitWindow: number;
};

/**
 * Feature flags for AI functionality
 */
export type AIFeatureFlags = {
  contentGeneration: boolean;
  chat: boolean;
  imageGeneration: boolean;
  agents: boolean;
};

/**
 * AI generation options
 */
export type AIGenerationOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  cache?: boolean;
};
