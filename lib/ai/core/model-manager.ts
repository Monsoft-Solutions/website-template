import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { AIProvider, AIModelConfig } from "@/lib/types/ai/ai-config.type";

/**
 * Model configuration mapping
 */
export const MODEL_CONFIG: Record<string, AIModelConfig> = {
  "claude-sonnet-4-20250514": {
    provider: "anthropic",
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ["text", "analysis", "reasoning", "code"],
    costPer1kTokens: 0.003,
  },
  "claude-3-5-sonnet-20241022": {
    provider: "anthropic",
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ["text", "analysis", "reasoning", "code"],
    costPer1kTokens: 0.003,
  },
  "claude-3-haiku-20240307": {
    provider: "anthropic",
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ["text", "analysis", "fast-response"],
    costPer1kTokens: 0.00025,
  },
  "gpt-4.1": {
    provider: "openai",
    maxTokens: 1047576,
    temperature: 0.7,
    capabilities: ["text", "analysis", "reasoning", "code"],
    costPer1kTokens: 0.005,
  },
  "gpt-4.1-mini": {
    provider: "openai",
    maxTokens: 1047576,
    temperature: 0.7,
    capabilities: ["text", "analysis", "fast-response"],
    costPer1kTokens: 0.00015,
  },
  "dall-e-3": {
    provider: "openai",
    maxTokens: 0,
    temperature: 0,
    capabilities: ["image-generation"],
    costPerImage: 0.04,
  },
  "text-embedding-3-small": {
    provider: "openai",
    maxTokens: 0,
    temperature: 0,
    capabilities: ["embedding"],
    costPer1kTokens: 0.00002,
  },
};

/**
 * Core model manager class
 */
export class ModelManager {
  private defaultModel: string;
  private fallbackModel: string;

  constructor() {
    this.defaultModel =
      process.env.AI_DEFAULT_MODEL || "claude-3-5-sonnet-20241022";
    this.fallbackModel = process.env.AI_FALLBACK_MODEL || "gpt-4o";
  }

  /**
   * Get model instance with provider detection
   */
  getModel(
    modelName?: string
  ): ReturnType<typeof anthropic> | ReturnType<typeof openai> {
    const model = modelName || this.defaultModel;
    const config = MODEL_CONFIG[model];

    if (!config) {
      console.warn(
        `Unknown model: ${model}, falling back to default: ${this.defaultModel}`
      );
      return this.getModel(this.defaultModel);
    }

    try {
      if (config.provider === "anthropic") {
        return anthropic(model);
      } else if (config.provider === "openai") {
        return openai(model);
      }
    } catch (error) {
      console.error(`Failed to initialize model ${model}:`, error);

      // Try fallback model if different from current
      if (model !== this.fallbackModel) {
        console.info(`Falling back to: ${this.fallbackModel}`);
        return this.getModel(this.fallbackModel);
      }

      throw new Error(
        `Failed to initialize any model. Last attempted: ${model}`
      );
    }

    throw new Error(`Unsupported provider for model: ${model}`);
  }

  /**
   * Get model configuration
   */
  getModelConfig(modelName?: string): AIModelConfig {
    const model = modelName || this.defaultModel;
    const config = MODEL_CONFIG[model];

    if (!config) {
      throw new Error(`Configuration not found for model: ${model}`);
    }

    return config;
  }

  /**
   * Check if model has specific capability
   */
  hasCapability(capability: string, modelName?: string): boolean {
    const config = this.getModelConfig(modelName);
    return config.capabilities.includes(capability);
  }

  /**
   * Get all available models by provider
   */
  getModelsByProvider(provider: AIProvider): string[] {
    return Object.entries(MODEL_CONFIG)
      .filter(([, config]) => config.provider === provider)
      .map(([modelName]) => modelName);
  }

  /**
   * Get models by capability
   */
  getModelsByCapability(capability: string): string[] {
    return Object.entries(MODEL_CONFIG)
      .filter(([, config]) => config.capabilities.includes(capability))
      .map(([modelName]) => modelName);
  }

  /**
   * Get the most cost-effective model for a capability
   */
  getCheapestModel(capability: string): string {
    const models = this.getModelsByCapability(capability);

    if (models.length === 0) {
      throw new Error(`No models found with capability: ${capability}`);
    }

    return models.reduce((cheapest, current) => {
      const cheapestConfig = MODEL_CONFIG[cheapest];
      const currentConfig = MODEL_CONFIG[current];

      const cheapestCost =
        cheapestConfig.costPer1kTokens || cheapestConfig.costPerImage || 0;
      const currentCost =
        currentConfig.costPer1kTokens || currentConfig.costPerImage || 0;

      return currentCost < cheapestCost ? current : cheapest;
    });
  }

  /**
   * Validate environment variables
   */
  validateEnvironment(): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    // TODO: Take from @env.ts
    if (!process.env.ANTHROPIC_API_KEY) {
      missing.push("ANTHROPIC_API_KEY");
    }

    if (!process.env.OPENAI_API_KEY) {
      missing.push("OPENAI_API_KEY");
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}
