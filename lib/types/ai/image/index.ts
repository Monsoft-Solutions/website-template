export * from "./image-generation.type";
export * from "./prompt-generation.type";

// Re-export commonly used types for convenience
export type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  GeneratedImage,
  ImageGenerationParams,
  ImageModel,
  ImageSize,
  ImageQuality,
  ImageStyle,
  DallE3Style,
} from "./image-generation.type";

// Re-export prompt generation types
export type {
  BlogContent,
  ImagePromptSuggestion,
  PromptGenerationRequest,
  UserImageParameters,
} from "./prompt-generation.type";

// Re-export schemas for validation
export {
  BlogContentSchema,
  ImagePromptSuggestionSchema,
  PromptGenerationRequestSchema,
  UserImageParametersSchema,
  UserImageStyleSchema,
  ImageMoodSchema,
  VisualAestheticSchema,
  ColorPaletteSchema,
  AspectRatioSchema,
  FocusLevelSchema,
  LightingStyleSchema,
  CameraAngleSchema,
} from "./prompt-generation.type";

// Re-export helper functions
export {
  getImageStyleOptions,
  getMoodOptions,
  getVisualAestheticOptions,
  getColorPaletteOptions,
  getAspectRatioOptions,
  getFocusLevelOptions,
  getLightingStyleOptions,
  getCameraAngleOptions,
  getDefaultUserImageParameters,
} from "./prompt-generation.type";

// Re-export generation types
export {
  ImageGenerationParamsSchema,
  ImageGenerationRequestSchema,
  GeneratedImageSchema,
  getDefaultParams,
  getSupportedConfigurations,
  getValidSizesForModel,
} from "./image-generation.type";
