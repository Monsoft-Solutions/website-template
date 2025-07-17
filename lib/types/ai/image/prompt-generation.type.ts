import { z } from "zod";
import { ImageStyleSchema } from "./image-generation.type";

/**
 * Blog content for prompt generation
 */
export const BlogContentSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

export type BlogContent = z.infer<typeof BlogContentSchema>;

/**
 * User-defined image parameters for tailored prompt generation
 */
export const UserImageStyleSchema = z.enum([
  "realistic_photo",
  "flat_vector",
  "3d_render",
  "watercolor_painting",
  "cartoon_comic",
  "minimalist_illustration",
  "abstract_conceptual",
  "hand_drawn_sketch",
]);

export const ImageMoodSchema = z.enum([
  "professional",
  "playful",
  "calm",
  "energetic",
  "serious",
  "warm",
  "mysterious",
  "inspirational",
]);

export const VisualAestheticSchema = z.enum([
  "modern_contemporary",
  "futuristic",
  "retro",
  "vintage",
  "minimalist",
  "brutalist",
  "cyberpunk",
  "synthwave_vaporwave",
  "y2k",
  "organic_hand_drawn",
]);

export const ColorPaletteSchema = z.enum([
  "pastel_tones",
  "bold_contrast",
  "earth_tones",
  "monochrome",
  "warm_colors",
  "cool_colors",
  "brand_specific",
]);

export const AspectRatioSchema = z.enum([
  "1:1", // Square
  "16:9", // Wide
  "4:5", // Portrait
  "9:16", // Story
]);

export const FocusLevelSchema = z.enum([
  "single_subject",
  "wide_scene",
  "medium_shot",
]);

export const LightingStyleSchema = z.enum([
  "natural_light",
  "studio_light",
  "sunset_golden_hour",
  "nighttime",
  "soft_ambient",
  "harsh_contrast",
]);

export const CameraAngleSchema = z.enum([
  "eye_level",
  "top_down_flat_lay",
  "close_up",
  "wide_angle",
  "isometric",
]);

/**
 * Comprehensive user-defined image parameters
 */
export const UserImageParametersSchema = z.object({
  imageStyle: UserImageStyleSchema,
  mood: ImageMoodSchema,
  visualAesthetic: VisualAestheticSchema,
  sceneDescription: z.string().optional(),
  mainObjects: z.string().optional(),
  colorPalette: ColorPaletteSchema,
  aspectRatio: AspectRatioSchema,
  focusLevel: FocusLevelSchema,
  textOverlayAreaNeeded: z.boolean().default(false),
  lightingStyle: LightingStyleSchema.optional(),
  cameraAngle: CameraAngleSchema.optional(),
  artistInfluence: z.string().optional(),
  brandColors: z.array(z.string()).optional(), // hex codes for brand-specific palette
});

export type UserImageParameters = z.infer<typeof UserImageParametersSchema>;

/**
 * AI-generated image prompt suggestion with XML structure
 */
export const ImagePromptSuggestionSchema = z.object({
  prompt: z
    .string()
    .describe("Detailed XML-structured image generation prompt"),
  xmlPrompt: z
    .string()
    .describe("XML-formatted prompt with all parameters for image generation"),
});

export type ImagePromptSuggestion = z.infer<typeof ImagePromptSuggestionSchema>;

/**
 * Enhanced prompt generation request with user parameters
 */
export const PromptGenerationRequestSchema = z.object({
  blogContent: BlogContentSchema,
  userParameters: UserImageParametersSchema,
  options: z
    .object({
      targetAudience: z.string().optional(),
      brandGuidelines: z.string().optional(),
      preferredStyle: ImageStyleSchema.optional(),
    })
    .optional(),
});

export type PromptGenerationRequest = z.infer<
  typeof PromptGenerationRequestSchema
>;

/**
 * Helper functions for parameter options
 */
export const getImageStyleOptions = () => [
  {
    value: "realistic_photo",
    label: "Realistic Photo",
    description: "High-quality photographic style",
  },
  {
    value: "flat_vector",
    label: "Flat Vector",
    description: "Clean, modern vector illustrations",
  },
  {
    value: "3d_render",
    label: "3D Render",
    description: "Three-dimensional rendered graphics",
  },
  {
    value: "watercolor_painting",
    label: "Watercolor Painting",
    description: "Soft, artistic watercolor style",
  },
  {
    value: "cartoon_comic",
    label: "Cartoon / Comic",
    description: "Fun, animated comic book style",
  },
  {
    value: "minimalist_illustration",
    label: "Minimalist Illustration",
    description: "Simple, clean illustrations",
  },
  {
    value: "abstract_conceptual",
    label: "Abstract / Conceptual",
    description: "Abstract artistic interpretations",
  },
  {
    value: "hand_drawn_sketch",
    label: "Hand-drawn Sketch",
    description: "Organic, sketched appearance",
  },
];

export const getMoodOptions = () => [
  {
    value: "professional",
    label: "Professional",
    description: "Clean, business-appropriate",
  },
  { value: "playful", label: "Playful", description: "Fun and engaging" },
  { value: "calm", label: "Calm", description: "Peaceful and serene" },
  {
    value: "energetic",
    label: "Energetic",
    description: "Dynamic and vibrant",
  },
  { value: "serious", label: "Serious", description: "Formal and important" },
  { value: "warm", label: "Warm", description: "Inviting and friendly" },
  {
    value: "mysterious",
    label: "Mysterious",
    description: "Intriguing and enigmatic",
  },
  {
    value: "inspirational",
    label: "Inspirational",
    description: "Uplifting and motivating",
  },
];

export const getVisualAestheticOptions = () => [
  {
    value: "modern_contemporary",
    label: "Modern / Contemporary",
    description: "Current, up-to-date design",
  },
  {
    value: "futuristic",
    label: "Futuristic",
    description: "Forward-thinking, sci-fi inspired",
  },
  { value: "retro", label: "Retro", description: "Vintage, throwback style" },
  {
    value: "vintage",
    label: "Vintage",
    description: "Classic, aged appearance",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Clean, simple design",
  },
  {
    value: "brutalist",
    label: "Brutalist",
    description: "Bold, raw architectural style",
  },
  {
    value: "cyberpunk",
    label: "Cyberpunk",
    description: "High-tech, dystopian aesthetic",
  },
  {
    value: "synthwave_vaporwave",
    label: "Synthwave / Vaporwave",
    description: "80s-inspired neon aesthetics",
  },
  { value: "y2k", label: "Y2K", description: "Early 2000s digital aesthetic" },
  {
    value: "organic_hand_drawn",
    label: "Organic / Hand-drawn",
    description: "Natural, handcrafted look",
  },
];

export const getColorPaletteOptions = () => [
  {
    value: "pastel_tones",
    label: "Pastel Tones",
    description: "Soft, muted colors",
  },
  {
    value: "bold_contrast",
    label: "Bold Contrast",
    description: "High contrast, striking colors",
  },
  {
    value: "earth_tones",
    label: "Earth Tones",
    description: "Natural, earthy colors",
  },
  {
    value: "monochrome",
    label: "Monochrome",
    description: "Single color or grayscale",
  },
  {
    value: "warm_colors",
    label: "Warm Colors",
    description: "Reds, oranges, yellows",
  },
  {
    value: "cool_colors",
    label: "Cool Colors",
    description: "Blues, greens, purples",
  },
  {
    value: "brand_specific",
    label: "Brand-specific",
    description: "Custom brand colors",
  },
];

export const getAspectRatioOptions = () => [
  {
    value: "1:1",
    label: "Square (1:1)",
    description: "Perfect for social media",
  },
  {
    value: "16:9",
    label: "Wide (16:9)",
    description: "Landscape, banner style",
  },
  {
    value: "4:5",
    label: "Portrait (4:5)",
    description: "Tall, mobile-friendly",
  },
  {
    value: "9:16",
    label: "Story (9:16)",
    description: "Vertical, story format",
  },
];

export const getFocusLevelOptions = () => [
  {
    value: "single_subject",
    label: "Single Subject",
    description: "Focus on one main element",
  },
  {
    value: "wide_scene",
    label: "Wide Scene",
    description: "Comprehensive view",
  },
  {
    value: "medium_shot",
    label: "Medium Shot",
    description: "Balanced composition",
  },
];

export const getLightingStyleOptions = () => [
  {
    value: "natural_light",
    label: "Natural Light",
    description: "Realistic, outdoor lighting",
  },
  {
    value: "studio_light",
    label: "Studio Light",
    description: "Professional, controlled lighting",
  },
  {
    value: "sunset_golden_hour",
    label: "Sunset / Golden Hour",
    description: "Warm, golden lighting",
  },
  {
    value: "nighttime",
    label: "Nighttime",
    description: "Dark, moody lighting",
  },
  {
    value: "soft_ambient",
    label: "Soft Ambient",
    description: "Gentle, diffused lighting",
  },
  {
    value: "harsh_contrast",
    label: "Harsh Contrast",
    description: "Strong shadows and highlights",
  },
];

export const getCameraAngleOptions = () => [
  {
    value: "eye_level",
    label: "Eye-level",
    description: "Straight-on perspective",
  },
  {
    value: "top_down_flat_lay",
    label: "Top-down / Flat lay",
    description: "Overhead view",
  },
  {
    value: "close_up",
    label: "Close-up",
    description: "Detailed, intimate view",
  },
  {
    value: "wide_angle",
    label: "Wide Angle",
    description: "Broad, encompassing view",
  },
  {
    value: "isometric",
    label: "Isometric",
    description: "Technical, 3D perspective",
  },
];

/**
 * Get default user image parameters
 */
export const getDefaultUserImageParameters = (): UserImageParameters => ({
  imageStyle: "realistic_photo",
  mood: "professional",
  visualAesthetic: "modern_contemporary",
  colorPalette: "pastel_tones",
  aspectRatio: "16:9",
  focusLevel: "medium_shot",
  textOverlayAreaNeeded: false,
});
