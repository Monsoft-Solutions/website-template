import { z } from "zod";

/**
 * Supported AI image generation models
 */
export const ImageModelSchema = z.enum(["dalle-3", "gpt-image-1"]);

export type ImageModel = z.infer<typeof ImageModelSchema>;

/**
 * Image sizes for DALL-E 3 model
 */
export const DallE3SizeSchema = z.enum([
  "1024x1024", // Square
  "1792x1024", // Landscape
  "1024x1792", // Portrait
]);

/**
 * Image sizes for gpt-image-1 model
 */
export const GPTImage1SizeSchema = z.enum([
  "1024x1024", // Square
  "1536x1024", // Landscape
  "1024x1536", // Portrait
]);

/**
 * Combined image size schema
 */
export const ImageSizeSchema = z.union([DallE3SizeSchema, GPTImage1SizeSchema]);

export type ImageSize = z.infer<typeof ImageSizeSchema>;

/**
 * Quality options for DALL-E 3
 */
export const DallE3QualitySchema = z.enum(["standard", "hd"]);

/**
 * Quality options for gpt-image-1
 */
export const GPTImage1QualitySchema = z.enum(["low", "medium", "high"]);

/**
 * Combined quality schema
 */
export const ImageQualitySchema = z.union([
  DallE3QualitySchema,
  GPTImage1QualitySchema,
]);

export type ImageQuality = z.infer<typeof ImageQualitySchema>;

/**
 * Style options for DALL-E 3 (gpt-image-1 doesn't support style parameter)
 */
export const DallE3StyleSchema = z.enum(["natural", "vivid"]);

export type DallE3Style = z.infer<typeof DallE3StyleSchema>;

/**
 * Custom style guidance for both models (used in prompt construction)
 */
export const ImageStyleSchema = z.enum([
  "photorealistic",
  "digital_art",
  "illustration",
  "minimalist",
  "abstract",
  "corporate",
  "modern",
  "artistic",
  "natural",
]);

export type ImageStyle = z.infer<typeof ImageStyleSchema>;

/**
 * Base image generation parameters
 */
export const BaseImageGenerationParamsSchema = z.object({
  model: ImageModelSchema,
  size: ImageSizeSchema,
  quality: ImageQualitySchema,
  style: ImageStyleSchema.optional(), // Used for prompt construction
  seed: z.number().optional(),
});

/**
 * DALL-E 3 specific parameters
 */
export const DallE3ParamsSchema = z.object({
  model: z.literal("dalle-3"),
  size: DallE3SizeSchema,
  quality: DallE3QualitySchema,
  style: ImageStyleSchema.optional(), // Used for prompt construction
  dalleStyle: DallE3StyleSchema.optional(), // DALL-E 3 native style parameter
  seed: z.number().optional(),
});

/**
 * gpt-image-1 specific parameters
 */
export const GPTImage1ParamsSchema = z.object({
  model: z.literal("gpt-image-1"),
  size: GPTImage1SizeSchema,
  quality: GPTImage1QualitySchema,
  style: ImageStyleSchema.optional(), // Used for prompt construction
  seed: z.number().optional(),
});

/**
 * Image generation parameters (discriminated union)
 */
export const ImageGenerationParamsSchema = z.discriminatedUnion("model", [
  DallE3ParamsSchema,
  GPTImage1ParamsSchema,
]);

export type ImageGenerationParams = z.infer<typeof ImageGenerationParamsSchema>;

/**
 * Image generation request
 */
export const ImageGenerationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  params: ImageGenerationParamsSchema,
});

export type ImageGenerationRequest = z.infer<
  typeof ImageGenerationRequestSchema
>;

/**
 * Generated image result
 */
export const GeneratedImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  base64: z.string().optional(),
  size: ImageSizeSchema,
  quality: ImageQualitySchema,
  model: ImageModelSchema,
  prompt: z.string(),
  revisedPrompt: z.string().optional(),
  seed: z.number().optional(),
  generatedAt: z.date(),
  xmlPrompt: z.string().optional(), // Original XML prompt if used
});

export type GeneratedImage = z.infer<typeof GeneratedImageSchema>;

/**
 * Image generation response
 */
export const ImageGenerationResponseSchema = z.object({
  success: z.boolean(),
  data: GeneratedImageSchema.optional(),
  error: z.string().optional(),
  metadata: z
    .object({
      model: ImageModelSchema,
      tokensUsed: z.number().optional(),
      processingTimeMs: z.number(),
    })
    .optional(),
});

export type ImageGenerationResponse = z.infer<
  typeof ImageGenerationResponseSchema
>;

/**
 * Helper function to get valid sizes for a model
 */
export function getValidSizesForModel(model: ImageModel): string[] {
  switch (model) {
    case "dalle-3":
      return ["1024x1024", "1792x1024", "1024x1792"];
    case "gpt-image-1":
      return ["1024x1024", "1536x1024", "1024x1536"];
    default:
      return ["1024x1024"];
  }
}

/**
 * Helper function to get valid qualities for a model
 */
export function getValidQualitiesForModel(model: ImageModel): string[] {
  switch (model) {
    case "dalle-3":
      return ["standard", "hd"];
    case "gpt-image-1":
      return ["low", "medium", "high"];
    default:
      return ["standard"];
  }
}

/**
 * Helper function to validate parameters for a specific model
 */
export function validateParamsForModel(params: ImageGenerationParams): boolean {
  const validSizes = getValidSizesForModel(params.model);
  const validQualities = getValidQualitiesForModel(params.model);

  return (
    validSizes.includes(params.size) && validQualities.includes(params.quality)
  );
}

/**
 * Get default parameters for a model
 */
export function getDefaultParams(model: ImageModel): ImageGenerationParams {
  if (model === "dalle-3") {
    return {
      model: "dalle-3",
      size: "1024x1024",
      quality: "standard",
      style: "modern",
    };
  } else {
    // Default to gpt-image-1 with medium quality as requested
    return {
      model: "gpt-image-1",
      size: "1024x1024",
      quality: "medium",
      style: "modern",
    };
  }
}

/**
 * Get supported configurations for all models
 */
export function getSupportedConfigurations() {
  return {
    models: [
      {
        value: "gpt-image-1",
        label: "GPT Image 1",
        description: "Latest OpenAI image model with improved quality",
        default: true,
      },
      {
        value: "dalle-3",
        label: "DALL-E 3",
        description: "High-quality creative image generation",
        default: false,
      },
    ],
    dalle3: {
      sizes: [
        {
          value: "1024x1024",
          label: "Square (1024×1024)",
          aspectRatio: "1:1",
        },
        {
          value: "1792x1024",
          label: "Landscape (1792×1024)",
          aspectRatio: "7:4",
        },
        {
          value: "1024x1792",
          label: "Portrait (1024×1792)",
          aspectRatio: "4:7",
        },
      ],
      qualities: [
        { value: "standard", label: "Standard Quality", cost: 0.04 },
        { value: "hd", label: "HD Quality", cost: 0.08 },
      ],
      styles: [
        {
          value: "natural",
          label: "Natural",
          description: "More realistic style",
        },
        {
          value: "vivid",
          label: "Vivid",
          description: "Hyper-real and dramatic",
        },
      ],
    },
    gptImage1: {
      sizes: [
        {
          value: "1024x1024",
          label: "Square (1024×1024)",
          aspectRatio: "1:1",
        },
        {
          value: "1536x1024",
          label: "Landscape (1536×1024)",
          aspectRatio: "3:2",
        },
        {
          value: "1024x1536",
          label: "Portrait (1024×1536)",
          aspectRatio: "2:3",
        },
      ],
      qualities: [
        { value: "low", label: "Low Quality", cost: 0.02 },
        { value: "medium", label: "Medium Quality", cost: 0.04 },
        { value: "high", label: "High Quality", cost: 0.08 },
      ],
    },
    commonStyles: [
      {
        value: "photorealistic",
        label: "Photorealistic",
        description: "High-quality realistic images",
      },
      {
        value: "digital_art",
        label: "Digital Art",
        description: "Modern digital artwork style",
      },
      {
        value: "illustration",
        label: "Illustration",
        description: "Artistic illustrations",
      },
      {
        value: "minimalist",
        label: "Minimalist",
        description: "Clean, simple designs",
      },
      {
        value: "abstract",
        label: "Abstract",
        description: "Abstract artistic style",
      },
      {
        value: "corporate",
        label: "Corporate",
        description: "Professional business style",
      },
      {
        value: "modern",
        label: "Modern",
        description: "Contemporary design",
      },
      {
        value: "artistic",
        label: "Artistic",
        description: "Creative and expressive",
      },
      {
        value: "natural",
        label: "Natural",
        description: "Organic, natural appearance",
      },
    ],
  };
}
