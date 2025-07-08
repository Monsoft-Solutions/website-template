import { DefaultChatTransport, UIMessage } from "ai";

/**
 * Transport configuration options
 */
export type AITransportConfig = {
  api: string;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onFinish?: () => void;
  maxRetries?: number;
  retryDelay?: number;
};

/**
 * Enhanced AI transport wrapper with custom error handling and retry logic
 */
export class AITransport {
  private transport: DefaultChatTransport<UIMessage>;
  private maxRetries: number;
  private retryDelay: number;
  private onError?: (error: Error) => void;
  private onStart?: () => void;
  private onFinish?: () => void;

  constructor(config: AITransportConfig) {
    const {
      onError,
      onStart,
      onFinish,
      maxRetries = 3,
      retryDelay = 1000,
      ...transportConfig
    } = config;

    this.transport = new DefaultChatTransport<UIMessage>({
      ...transportConfig,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
    this.onError = onError;
    this.onStart = onStart;
    this.onFinish = onFinish;
  }

  /**
   * Get the underlying transport
   */
  getTransport(): DefaultChatTransport<UIMessage> {
    return this.transport;
  }

  /**
   * Execute a request with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> {
    this.onStart?.();

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();
        this.onFinish?.();
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        console.warn(
          `AI transport attempt ${attempt} failed${
            context ? ` (${context})` : ""
          }:`,
          lastError.message
        );

        // Don't retry on certain errors
        if (this.shouldNotRetry(lastError)) {
          break;
        }

        // Wait before retry (except on last attempt)
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    // All retries failed
    this.onError?.(lastError!);
    this.onFinish?.();
    throw lastError;
  }

  /**
   * Determine if an error should not be retried
   */
  private shouldNotRetry(error: Error): boolean {
    const message = error.message.toLowerCase();

    // Don't retry on authentication errors
    if (message.includes("unauthorized") || message.includes("401")) {
      return true;
    }

    // Don't retry on bad request errors
    if (message.includes("bad request") || message.includes("400")) {
      return true;
    }

    // Don't retry on quota/rate limit errors that are permanent
    if (message.includes("quota exceeded")) {
      return true;
    }

    return false;
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a configured AI transport instance
 */
export function createAITransport(
  config: Partial<AITransportConfig> = {}
): AITransport {
  const defaultConfig: AITransportConfig = {
    api: "/api/ai/chat",
    headers: {},
    maxRetries: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error("AI Transport Error:", error);
    },
    onStart: () => {
      console.debug("AI request started");
    },
    onFinish: () => {
      console.debug("AI request finished");
    },
  };

  return new AITransport({ ...defaultConfig, ...config });
}

/**
 * Transport factory for different AI endpoints
 */
export class AITransportFactory {
  /**
   * Create transport for chat endpoint
   */
  static createChatTransport(
    config: Partial<AITransportConfig> = {}
  ): AITransport {
    return createAITransport({
      api: "/api/ai/chat",
      ...config,
    });
  }

  /**
   * Create transport for content generation endpoint
   */
  static createContentTransport(
    config: Partial<AITransportConfig> = {}
  ): AITransport {
    return createAITransport({
      api: "/api/ai/content/generate",
      ...config,
    });
  }

  /**
   * Create transport for image generation endpoint
   */
  static createImageTransport(
    config: Partial<AITransportConfig> = {}
  ): AITransport {
    return createAITransport({
      api: "/api/ai/images/generate",
      ...config,
    });
  }

  /**
   * Create transport for agents endpoint
   */
  static createAgentTransport(
    config: Partial<AITransportConfig> = {}
  ): AITransport {
    return createAITransport({
      api: "/api/ai/agents",
      ...config,
    });
  }
}
