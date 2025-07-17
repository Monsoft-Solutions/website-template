import OpenAI from "openai";
import type {
  GeneratedImage,
  ImageGenerationParams,
} from "@/lib/types/ai/image";
import {
  getValidSizesForModel,
  getValidQualitiesForModel,
  validateParamsForModel,
} from "@/lib/types/ai/image";
import { env } from "@/lib/env";

/**
 * Service for generating images using OpenAI's image models (DALL-E 3 and gpt-image-1)
 */
export class ImageGenerator {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate a single image from a prompt and parameters
   */
  async generateImage(
    prompt: string,
    params: ImageGenerationParams
  ): Promise<GeneratedImage> {
    const startTime = Date.now();

    try {
      // Validate parameters for the selected model
      if (!validateParamsForModel(params)) {
        throw new Error(`Invalid parameters for model ${params.model}`);
      }

      // Construct the full prompt with style guidance
      const styledPrompt = this.buildStyledPrompt(prompt, params.style);

      // Generate image based on the selected model
      const result = await this.generateWithModel(styledPrompt, params);

      if (!result.data || result.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }

      const imageData = result.data[0];

      // Create GeneratedImage object
      const generatedImage: GeneratedImage = {
        url: imageData.url || "",
        base64: imageData.b64_json || "",
        size: params.size,
        quality: params.quality,
        model: params.model,
        prompt: styledPrompt,
        revisedPrompt: imageData.revised_prompt || styledPrompt,
        seed: params.seed,
        generatedAt: new Date(),
      };

      return generatedImage;
    } catch (error) {
      const processingTime = Date.now() - startTime;

      console.error("Image generation failed:", {
        error: error instanceof Error ? error.message : String(error),
        prompt,
        params,
        processingTimeMs: processingTime,
      });

      throw new Error(
        `Image generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate an image using an XML-structured prompt directly
   * This method handles the XML prompt processing and generates the image
   */
  async generateImageFromXML(
    xmlPrompt: string,
    params: ImageGenerationParams
  ): Promise<GeneratedImage> {
    const startTime = Date.now();

    try {
      // Validate parameters for the selected model
      if (!validateParamsForModel(params)) {
        throw new Error(`Invalid parameters for model ${params.model}`);
      }

      // Validate that this is actually an XML prompt
      if (!this.isXMLPrompt(xmlPrompt)) {
        console.warn(
          "Warning: Prompt doesn't appear to be XML-structured, falling back to regular generation"
        );
        return this.generateImage(xmlPrompt, params);
      }

      // Process the XML prompt to extract the image generation prompt

      // Generate image based on the selected model
      const result = await this.generateWithModel(xmlPrompt, params);

      if (!result.data || result.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }

      const imageData = result.data[0];

      // Create GeneratedImage object with original XML prompt for reference
      const generatedImage: GeneratedImage = {
        url: imageData.url || "",
        base64: imageData.b64_json || "",
        size: params.size,
        quality: params.quality,
        model: params.model,
        prompt: xmlPrompt, // The processed prompt used for generation
        revisedPrompt: imageData.revised_prompt || xmlPrompt,
        seed: params.seed,
        generatedAt: new Date(),
        // Store original XML prompt as metadata
        xmlPrompt: xmlPrompt,
      };

      return generatedImage;
    } catch (error) {
      const processingTime = Date.now() - startTime;

      console.error("XML image generation failed:", {
        error: error instanceof Error ? error.message : String(error),
        xmlPrompt: xmlPrompt.substring(0, 200) + "...", // Log first 200 chars
        params,
        processingTimeMs: processingTime,
      });

      throw new Error(
        `XML image generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate image using the appropriate model with model-specific parameters
   */
  private async generateWithModel(
    prompt: string,
    params: ImageGenerationParams
  ) {
    if (params.model === "dalle-3") {
      return this.generateWithDallE3(prompt, params);
    } else if (params.model === "gpt-image-1") {
      return this.generateWithGPTImage1(prompt, params);
    } else {
      // This should never happen due to the discriminated union, but TypeScript needs this
      const exhaustiveCheck: never = params;
      throw new Error(`Unsupported model: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }

  /**
   * Generate image using DALL-E 3 model
   */
  private async generateWithDallE3(
    prompt: string,
    params: ImageGenerationParams
  ) {
    if (params.model !== "dalle-3") {
      throw new Error("Invalid model for DALL-E 3 generation");
    }

    const generateParams: OpenAI.Images.ImageGenerateParams = {
      model: "dall-e-3",
      prompt,
      size: params.size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: params.quality as "standard" | "hd",
      n: 1, // DALL-E 3 only supports n=1
      response_format: "b64_json",
    };

    // Add DALL-E 3 specific style parameter if provided
    if ("dalleStyle" in params && params.dalleStyle) {
      const extendedParams =
        generateParams as OpenAI.Images.ImageGenerateParams & {
          style?: string;
        };
      extendedParams.style = params.dalleStyle;
      return this.client.images.generate(extendedParams);
    }

    return this.client.images.generate(generateParams);
  }

  /**
   * Generate image using gpt-image-1 model
   */
  private async generateWithGPTImage1(
    prompt: string,
    params: ImageGenerationParams
  ) {
    if (params.model !== "gpt-image-1") {
      throw new Error("Invalid model for gpt-image-1 generation");
    }

    const generateParams: OpenAI.Images.ImageGenerateParams = {
      model: "gpt-image-1",
      prompt,
      size: params.size as "1024x1024" | "1536x1024" | "1024x1536",
      quality: params.quality as "low" | "medium" | "high",
      n: 1,
      // Note: gpt-image-1 always returns base64-encoded images
    };

    return this.client.images.generate(generateParams);
  }

  /**
   * Generate multiple images with the same prompt and parameters
   */
  async generateMultipleImages(
    prompt: string,
    params: ImageGenerationParams,
    count: number = 1
  ): Promise<GeneratedImage[]> {
    if (count <= 1) {
      return [await this.generateImage(prompt, params)];
    }

    // DALL-E 3 only supports n=1, so we need multiple calls
    if (params.model === "dalle-3") {
      const promises = Array.from({ length: count }, () =>
        this.generateImage(prompt, params)
      );
      return Promise.all(promises);
    }

    // gpt-image-1 supports multiple images in a single call (up to 10)
    if (params.model === "gpt-image-1" && count <= 10) {
      const styledPrompt = this.buildStyledPrompt(prompt, params.style);

      const result = await this.client.images.generate({
        model: "gpt-image-1",
        prompt: styledPrompt,
        size: params.size as "1024x1024" | "1536x1024" | "1024x1536",
        quality: params.quality as "low" | "medium" | "high",
        n: count,
      });

      if (!result.data) {
        throw new Error("No image data returned from OpenAI");
      }

      return result.data.map((imageData) => ({
        url: imageData.url || "",
        base64: imageData.b64_json || "",
        size: params.size,
        quality: params.quality,
        model: params.model,
        prompt: styledPrompt,
        revisedPrompt: imageData.revised_prompt || styledPrompt,
        seed: params.seed,
        generatedAt: new Date(),
      }));
    }

    // For larger counts, use parallel calls
    const promises = Array.from({ length: count }, () =>
      this.generateImage(prompt, params)
    );
    return Promise.all(promises);
  }

  /**
   * Build a styled prompt by combining the base prompt with style guidance
   * This method now handles both regular prompts and XML-structured prompts
   */
  private buildStyledPrompt(basePrompt: string, style?: string): string {
    // Check if the prompt is an XML template
    if (this.isXMLPrompt(basePrompt)) {
      return this.processXMLPrompt(basePrompt);
    }

    // Handle regular prompts with style guidance
    if (!style) {
      return `${basePrompt}. Create a professional image suitable for use as a blog post featured image, with no text or typography overlays.`;
    }

    const styleGuides = {
      photorealistic: "Create a highly realistic, professional photograph",
      digital_art:
        "Create a modern digital artwork with clean lines and vivid colors",
      illustration: "Create a detailed illustration with artistic flair",
      minimalist: "Create a clean, minimalist design with simple elements",
      abstract: "Create an abstract artistic interpretation",
      corporate: "Create a professional, business-appropriate image",
      modern: "Create a contemporary, stylish image with modern aesthetics",
      artistic: "Create an expressive, creative artistic piece",
      natural: "Create a natural, organic-looking image",
    };

    const styleGuide = styleGuides[style as keyof typeof styleGuides] || "";

    return styleGuide
      ? `${styleGuide}. ${basePrompt}. Ensure the image is suitable for use as a blog post featured image, with no text or typography overlays.`
      : `${basePrompt}. Create a professional image suitable for use as a blog post featured image, with no text or typography overlays.`;
  }

  /**
   * Check if a prompt is XML-structured
   */
  private isXMLPrompt(prompt: string): boolean {
    return (
      prompt.trim().startsWith("<promptTemplate>") &&
      prompt.includes("</promptTemplate>")
    );
  }

  /**
   * Process XML prompt and extract key information for image generation
   */
  private processXMLPrompt(xmlPrompt: string): string {
    try {
      // Extract key sections from XML for the actual image generation prompt
      const sections = this.extractXMLSections(xmlPrompt);

      // Build the final prompt by combining relevant sections
      const promptParts = [];

      // Add goal from instructions
      if (sections.goal) {
        promptParts.push(sections.goal);
      }

      // Add content description
      if (sections.description) {
        promptParts.push(sections.description);
      }

      // Add style information
      if (sections.vibe) {
        promptParts.push(`Style: ${sections.vibe}`);
      }

      // Add mood information
      if (sections.mood) {
        promptParts.push(`Mood: ${sections.mood}`);
      }

      // Add medium information
      if (sections.medium) {
        promptParts.push(`Medium: ${sections.medium}`);
      }

      // Add color palette
      if (sections.colorPalette) {
        promptParts.push(`Colors: ${sections.colorPalette}`);
      }

      // Add composition details
      if (sections.layout) {
        promptParts.push(`Layout: ${sections.layout}`);
      }

      if (sections.focus) {
        promptParts.push(`Focus: ${sections.focus}`);
      }

      // Add constraints from avoid section
      if (sections.avoid) {
        promptParts.push(`Avoid: ${sections.avoid}`);
      }

      // Join all parts and ensure no text/typography constraint
      const finalPrompt =
        promptParts.join(". ") +
        ". Ensure no text or typography overlays in the image.";

      return finalPrompt;
    } catch (error) {
      console.error("Error processing XML prompt:", error);
      // Fallback to using the XML as-is if parsing fails
      return xmlPrompt;
    }
  }

  /**
   * Extract sections from XML prompt using simple string parsing
   */
  private extractXMLSections(xmlPrompt: string): Record<string, string> {
    const sections: Record<string, string> = {};

    // Helper function to extract content between XML tags
    const extractTag = (tagName: string): string => {
      const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, "s");
      const match = xmlPrompt.match(regex);
      return match ? match[1].trim() : "";
    };

    // Extract key sections
    sections.goal = extractTag("goal");
    sections.description = extractTag("description");
    sections.vibe = extractTag("vibe");
    sections.mood = extractTag("mood");
    sections.medium = extractTag("medium");
    sections.colorPalette = extractTag("colorPalette");
    sections.layout = extractTag("layout");
    sections.focus = extractTag("focus");
    sections.avoid = extractTag("avoid");

    return sections;
  }

  /**
   * Validate generation parameters
   */
  validateParams(params: ImageGenerationParams): void {
    // Use the helper function from types
    if (!validateParamsForModel(params)) {
      const validSizes = getValidSizesForModel(params.model);
      const validQualities = getValidQualitiesForModel(params.model);

      throw new Error(
        `Invalid parameters for model ${params.model}. Valid sizes: ${validSizes.join(", ")}. Valid qualities: ${validQualities.join(", ")}`
      );
    }

    // Validate seed if provided
    if (params.seed !== undefined) {
      if (!Number.isInteger(params.seed) || params.seed < 0) {
        throw new Error("Seed must be a non-negative integer");
      }
    }
  }

  /**
   * Get estimated cost for image generation
   */
  getEstimatedCost(params: ImageGenerationParams, count: number = 1): number {
    // Pricing based on model and quality (as of implementation date)
    // Note: Pricing may change - check OpenAI's pricing page for current rates
    let baseCost: number;

    if (params.model === "dalle-3") {
      baseCost = params.quality === "hd" ? 0.08 : 0.04;
    } else if (params.model === "gpt-image-1") {
      // gpt-image-1 pricing structure
      switch (params.quality) {
        case "low":
          baseCost = 0.02;
          break;
        case "medium":
          baseCost = 0.04;
          break;
        case "high":
          baseCost = 0.08;
          break;
        default:
          baseCost = 0.04;
      }
    } else {
      baseCost = 0.04; // Default fallback
    }

    return baseCost * count;
  }
}
