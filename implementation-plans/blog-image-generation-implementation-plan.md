# Blog Post Image Generation Implementation Plan

## 🎯 Overview

This implementation plan details the development of an AI-powered image generation system for blog posts. The feature will use OpenAI's **gpt-image-1** model through the **standalone OpenAI package** to create images based on blog post content, with AI-generated prompts that users can customize.

## 🏗️ Current System Analysis

### Existing Infrastructure

- **Blog Management**: Complete blog CRUD system with `BlogPostForm.tsx` and admin interface
- **Image Handling**: Vercel Blob storage integration via `/api/admin/upload` endpoint
- **AI Integration**: AI SDK 5 Beta with OpenAI and Anthropic models for text generation
- **Database Schema**: `blog_posts.featured_image` field already exists
- **UI Components**: Modern shadcn/ui components and form handling
- **Types Organization**: Structured `lib/types/ai/` folder for AI-related types
- **Services Structure**: Organized `lib/ai/` folder with core, content, and image subdirectories

### Current Blog Post Flow

1. User creates/edits blog post in `/admin/blog/[id]/edit`
2. `BlogPostForm.tsx` handles form state and validation
3. `FeaturedImageUploader` component handles manual image uploads
4. Images stored in Vercel Blob and URL saved to database

## 📋 Feature Requirements

### Core Features

- ✅ Generate images using OpenAI gpt-image-1 model through standalone OpenAI package
- ✅ AI-generated prompts based on blog post content
- ✅ User can edit and customize image prompts
- ✅ Configurable generation parameters (style, size, etc.)
- ✅ Image preview and approval workflow
- ✅ Regeneration capability
- ✅ Integration with existing image storage system
- ✅ Simple and intuitive UX

### User Experience Flow

1. User writes blog post content
2. User clicks "Generate Image" button
3. System analyzes content and generates prompt using AI
4. User can review and edit the prompt
5. User configures generation parameters
6. User triggers image generation
7. Generated image is displayed for preview
8. User can accept image or generate a new one
9. Accepted image is uploaded to storage and associated with post

## 🚀 Implementation Phases

## Phase 1: Core Infrastructure (Days 1-2)

### 1.1 Type Definitions

**Duration**: 2 hours

Create comprehensive type definitions in `lib/types/ai/image/` subfolder:

```typescript
// lib/types/ai/image/image-generation.type.ts
import { z } from "zod";

/**
 * Supported image sizes for gpt-image-1 model
 * Note: gpt-image-1 supports these three sizes only
 */
export const ImageSizeSchema = z.enum([
  "1024x1024", // Square
  "1536x1024", // Landscape
  "1024x1536", // Portrait
]);

export type ImageSize = z.infer<typeof ImageSizeSchema>;

/**
 * Image quality options for gpt-image-1 model
 */
export const ImageQualitySchema = z.enum(["standard", "hd"]);

export type ImageQuality = z.infer<typeof ImageQualitySchema>;

/**
 * Image generation styles
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
 * Image generation parameters
 */
export const ImageGenerationParamsSchema = z.object({
  style: ImageStyleSchema,
  size: ImageSizeSchema,
  quality: ImageQualitySchema,
  seed: z.number().optional(),
});

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
  prompt: z.string(),
  revisedPrompt: z.string().optional(),
  seed: z.number().optional(),
  generatedAt: z.date(),
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
      model: z.string(),
      tokensUsed: z.number().optional(),
      processingTimeMs: z.number(),
    })
    .optional(),
});

export type ImageGenerationResponse = z.infer<
  typeof ImageGenerationResponseSchema
>;
```

```typescript
// lib/types/ai/image/prompt-generation.type.ts
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
 * AI-generated image prompt suggestion
 */
export const ImagePromptSuggestionSchema = z.object({
  prompt: z.string().describe("Detailed image generation prompt"),
  style: ImageStyleSchema.describe("Suggested artistic style"),
  mood: z.string().describe("Emotional tone of the image"),
  elements: z.array(z.string()).describe("Key visual elements to include"),
  reasoning: z.string().describe("Explanation for the prompt choice"),
});

export type ImagePromptSuggestion = z.infer<typeof ImagePromptSuggestionSchema>;

/**
 * Prompt generation request
 */
export const PromptGenerationRequestSchema = z.object({
  blogContent: BlogContentSchema,
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
```

```typescript
// lib/types/ai/image/index.ts
export * from "./image-generation.type";
export * from "./prompt-generation.type";

// Re-export commonly used types for convenience
export type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  GeneratedImage,
  ImagePromptSuggestion,
  BlogContent,
} from "./image-generation.type";
```

### 1.2 Image Generation Service

**Duration**: 4 hours

Create the core image generation service using the standalone OpenAI package:

```typescript
// lib/ai/image/image-generator.ts
import OpenAI from "openai";
import type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  GeneratedImage,
  ImageGenerationParams,
} from "@/lib/types/ai/image";

/**
 * Service for generating images using OpenAI's gpt-image-1 model
 */
export class ImageGenerator {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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
      // Construct the full prompt with style guidance
      const styledPrompt = this.buildStyledPrompt(prompt, params.style);

      // Generate image using OpenAI standalone package
      const result = await this.client.images.generate({
        model: "gpt-image-1",
        prompt: styledPrompt,
        size: params.size as "1024x1024" | "1536x1024" | "1024x1536",
        quality: params.quality as "standard" | "hd",
        n: 1, // Generate one image at a time
        response_format: "b64_json", // Get base64 for easier handling
      });

      const imageData = result.data[0];

      // Create GeneratedImage object
      const generatedImage: GeneratedImage = {
        url: imageData.url || "",
        base64: imageData.b64_json || "",
        size: params.size,
        quality: params.quality,
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
   * Generate multiple images with the same prompt and parameters
   */
  async generateMultipleImages(
    prompt: string,
    params: ImageGenerationParams,
    count: number = 1
  ): Promise<GeneratedImage[]> {
    // For multiple images, we can either:
    // 1. Make multiple parallel calls (current approach)
    // 2. Use n parameter in single call (if count <= 10)

    if (count <= 1) {
      return [await this.generateImage(prompt, params)];
    }

    // For multiple images, use parallel calls for better error handling
    const promises = Array.from({ length: count }, () =>
      this.generateImage(prompt, params)
    );

    return Promise.all(promises);
  }

  /**
   * Build a styled prompt by combining the base prompt with style guidance
   */
  private buildStyledPrompt(basePrompt: string, style: string): string {
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
   * Validate generation parameters
   */
  validateParams(params: ImageGenerationParams): void {
    const { style, size, quality } = params;

    // Validate size
    const validSizes = ["1024x1024", "1536x1024", "1024x1536"];
    if (!validSizes.includes(size)) {
      throw new Error(
        `Invalid size: ${size}. Must be one of: ${validSizes.join(", ")}`
      );
    }

    // Validate quality
    const validQualities = ["standard", "hd"];
    if (!validQualities.includes(quality)) {
      throw new Error(
        `Invalid quality: ${quality}. Must be one of: ${validQualities.join(", ")}`
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
    // OpenAI gpt-image-1 pricing (as of implementation date)
    // Note: Pricing may change - check OpenAI's pricing page for current rates
    const baseCost = params.quality === "hd" ? 0.08 : 0.04; // USD per image
    return baseCost * count;
  }

  /**
   * Get supported configurations
   */
  getSupportedConfigurations() {
    return {
      sizes: [
        { value: "1024x1024", label: "Square (1024×1024)", aspectRatio: "1:1" },
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
        { value: "standard", label: "Standard Quality", cost: 0.04 },
        { value: "hd", label: "HD Quality", cost: 0.08 },
      ],
      styles: [
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
}
```

### 1.3 Prompt Generation Service

**Duration**: 3 hours

Create AI service for generating image prompts from blog content:

```typescript
// lib/ai/image/prompt-generator.ts
import { generateObject } from "ai";
import { ModelManager } from "@/lib/ai/core/model-manager";
import type {
  BlogContent,
  ImagePromptSuggestion,
  PromptGenerationRequest,
} from "@/lib/types/ai/image";
import { ImagePromptSuggestionSchema } from "@/lib/types/ai/image";

/**
 * Service for generating AI-powered image prompts from blog content
 */
export class PromptGenerator {
  private modelManager: ModelManager;

  constructor() {
    this.modelManager = new ModelManager();
  }

  /**
   * Generate an image prompt suggestion based on blog content
   */
  async generatePrompt(
    blogContent: BlogContent,
    options?: {
      targetAudience?: string;
      brandGuidelines?: string;
      preferredStyle?: string;
    }
  ): Promise<ImagePromptSuggestion> {
    try {
      const model = this.modelManager.getModel();

      const result = await generateObject({
        model,
        schema: ImagePromptSuggestionSchema,
        prompt: this.buildPromptGenerationPrompt(blogContent, options),
        temperature: 0.7, // Balanced creativity
      });

      return result.object;
    } catch (error) {
      console.error("Prompt generation failed:", {
        error: error instanceof Error ? error.message : String(error),
        blogContent: {
          title: blogContent.title,
          contentLength: blogContent.content.length,
        },
      });

      throw new Error(
        `Failed to generate image prompt: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate multiple prompt variations
   */
  async generatePromptVariations(
    blogContent: BlogContent,
    count: number = 3,
    options?: {
      targetAudience?: string;
      brandGuidelines?: string;
      preferredStyle?: string;
    }
  ): Promise<ImagePromptSuggestion[]> {
    const promises = Array.from({ length: count }, (_, index) =>
      this.generatePrompt(blogContent, {
        ...options,
        // Add variation instruction for different perspectives
        variationIndex: index,
      } as any)
    );

    return Promise.all(promises);
  }

  /**
   * Build the prompt for AI prompt generation
   */
  private buildPromptGenerationPrompt(
    blogContent: BlogContent,
    options?: {
      targetAudience?: string;
      brandGuidelines?: string;
      preferredStyle?: string;
      variationIndex?: number;
    }
  ): string {
    const { title, content, excerpt, tags, category } = blogContent;

    // Extract content preview (first 1000 characters for context)
    const contentPreview = content.substring(0, 1000);
    const hasMoreContent = content.length > 1000;

    return `
# Image Prompt Generation for Blog Post

You are an expert at creating detailed, effective prompts for AI image generation. Your task is to analyze the provided blog post content and create a compelling image prompt that would work perfectly as a featured image.

## Blog Post Details

**Title:** ${title}

${excerpt ? `**Excerpt:** ${excerpt}` : ""}

${category ? `**Category:** ${category}` : ""}

${tags && tags.length > 0 ? `**Tags:** ${tags.join(", ")}` : ""}

**Content Preview:**
${contentPreview}${hasMoreContent ? "..." : ""}

## Guidelines for Image Prompt Creation

### What Makes a Great Blog Featured Image:
1. **Visually Appealing:** Eye-catching and professional
2. **Relevant:** Directly relates to the blog post topic
3. **Clean:** No text overlays or typography (these will be added separately)
4. **Engaging:** Draws readers in and makes them want to read the article
5. **Professional Quality:** Suitable for publication

### Technical Requirements:
- The image will be generated using OpenAI's gpt-image-1 model
- Avoid requesting text, logos, or typography in the image
- Focus on visual elements, scenes, concepts, and compositions
- Consider the aspect ratio options: square, landscape, or portrait

### Style Considerations:
${options?.preferredStyle ? `- Preferred style: ${options.preferredStyle}` : "- Consider modern, clean, and professional styles"}
${options?.targetAudience ? `- Target audience: ${options.targetAudience}` : ""}
${options?.brandGuidelines ? `- Brand guidelines: ${options.brandGuidelines}` : ""}

## Your Task

Create a detailed image generation prompt that:
1. Captures the essence of the blog post topic
2. Would create an engaging featured image
3. Is specific enough to generate a focused, relevant image
4. Includes visual style guidance
5. Considers composition and mood

${
  options?.variationIndex !== undefined && options.variationIndex > 0
    ? `\n## Variation Requirement\nThis is variation #${options.variationIndex + 1}. Create a different perspective or approach while maintaining relevance to the topic.`
    : ""
}

Please provide:
- **prompt**: A detailed, specific prompt for image generation
- **style**: The recommended artistic style from the available options
- **mood**: The emotional tone the image should convey
- **elements**: Key visual elements that should be included
- **reasoning**: Brief explanation of why this prompt would work well for this blog post

Remember: The goal is to create an image that would make someone want to click and read the blog post while accurately representing its content.
    `.trim();
  }

  /**
   * Refine an existing prompt based on user feedback
   */
  async refinePrompt(
    originalPrompt: string,
    blogContent: BlogContent,
    userFeedback: string
  ): Promise<string> {
    try {
      const model = this.modelManager.getModel();

      const result = await generateObject({
        model,
        schema: ImagePromptSuggestionSchema,
        prompt: `
# Prompt Refinement Task

## Original Image Prompt
${originalPrompt}

## Blog Post Context
**Title:** ${blogContent.title}
**Content Preview:** ${blogContent.content.substring(0, 500)}...

## User Feedback
${userFeedback}

## Task
Refine the original prompt based on the user feedback while maintaining relevance to the blog post. Keep what works and improve based on the specific feedback provided.

Provide an improved prompt that addresses the user's concerns while creating an effective featured image for the blog post.
        `,
        temperature: 0.6,
      });

      return result.object.prompt;
    } catch (error) {
      console.error("Prompt refinement failed:", error);
      throw new Error("Failed to refine prompt");
    }
  }
}
```

### 1.4 API Routes

**Duration**: 3 hours

Create API endpoints using the new services:

```typescript
// app/api/admin/blog/generate-image-prompt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { PromptGenerator } from "@/lib/ai/image/prompt-generator";
import { BlogContentSchema } from "@/lib/types/ai/image";
import { ApiResponse } from "@/lib/types/api-response.type";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { blogContent, options } = body;

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

    const promptGenerator = new PromptGenerator();
    const suggestion = await promptGenerator.generatePrompt(
      validatedContent,
      options
    );

    return NextResponse.json({
      success: true,
      data: suggestion,
      message: "Image prompt generated successfully",
    } as ApiResponse<typeof suggestion>);
  } catch (error) {
    console.error("Prompt generation error:", error);

    if (error instanceof Error && error.message.includes("parse")) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid blog content format",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to generate prompt",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/admin/blog/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ImageGenerator } from "@/lib/ai/image/image-generator";
import {
  ImageGenerationRequestSchema,
  type ImageGenerationResponse,
} from "@/lib/types/ai/image";
import { ApiResponse } from "@/lib/types/api-response.type";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    await requireAdmin();

    const body = await request.json();

    // Validate request
    const validatedRequest = ImageGenerationRequestSchema.parse(body);
    const { prompt, params } = validatedRequest;

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const imageGenerator = new ImageGenerator();

    // Validate parameters
    imageGenerator.validateParams(params);

    // Generate image
    const generatedImage = await imageGenerator.generateImage(prompt, params);

    const processingTime = Date.now() - startTime;

    const response: ImageGenerationResponse = {
      success: true,
      data: generatedImage,
      metadata: {
        model: "gpt-image-1",
        processingTimeMs: processingTime,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: "Image generated successfully",
    } as ApiResponse<ImageGenerationResponse>);
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error("Image generation error:", {
      error: error instanceof Error ? error.message : String(error),
      processingTimeMs: processingTime,
    });

    if (error instanceof Error && error.message.includes("parse")) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid request format",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to generate image",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
```

## Phase 2: UI Components (Days 3-4)

### 2.1 Image Generation Parameters Component

**Duration**: 4 hours

```typescript
// components/admin/blog-post-form/image-generation-params.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Info, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ImageGenerationParams } from "@/lib/types/ai/image";

interface ImageGenerationParamsProps {
  params: ImageGenerationParams;
  onParamsChange: (params: ImageGenerationParams) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const STYLE_OPTIONS = [
  { value: "photorealistic", label: "Photorealistic", description: "High-quality realistic images" },
  { value: "digital_art", label: "Digital Art", description: "Modern digital artwork style" },
  { value: "illustration", label: "Illustration", description: "Artistic illustrations" },
  { value: "minimalist", label: "Minimalist", description: "Clean, simple designs" },
  { value: "abstract", label: "Abstract", description: "Abstract artistic style" },
  { value: "corporate", label: "Corporate", description: "Professional business style" },
  { value: "modern", label: "Modern", description: "Contemporary design" },
  { value: "artistic", label: "Artistic", description: "Creative and expressive" },
  { value: "natural", label: "Natural", description: "Organic, natural appearance" },
];

const SIZE_OPTIONS = [
  { value: "1024x1024", label: "Square (1024×1024)", aspectRatio: "1:1" },
  { value: "1536x1024", label: "Landscape (1536×1024)", aspectRatio: "3:2" },
  { value: "1024x1536", label: "Portrait (1024×1536)", aspectRatio: "2:3" },
];

const QUALITY_OPTIONS = [
  { value: "standard", label: "Standard", cost: 0.040, description: "Good quality, faster generation" },
  { value: "hd", label: "HD", cost: 0.080, description: "Higher quality, slower generation" },
];

export function ImageGenerationParams({
  params,
  onParamsChange,
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  disabled = false,
}: ImageGenerationParamsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateParams = <K extends keyof ImageGenerationParams>(
    key: K,
    value: ImageGenerationParams[K]
  ) => {
    onParamsChange({
      ...params,
      [key]: value,
    });
  };

  const selectedQuality = QUALITY_OPTIONS.find(q => q.value === params.quality);
  const estimatedCost = selectedQuality?.cost || 0.040;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Image Generation Settings</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            ${estimatedCost.toFixed(3)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Editor */}
        <div className="space-y-2">
          <Label htmlFor="image-prompt">Image Prompt</Label>
          <Textarea
            id="image-prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={4}
            disabled={disabled}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Be specific and descriptive. Avoid requesting text or typography in the image.
          </p>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label>Style</Label>
          <Select
            value={params.style}
            onValueChange={(value) => updateParams("style", value as any)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {STYLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <Label>Size & Aspect Ratio</Label>
          <Select
            value={params.size}
            onValueChange={(value) => updateParams("size", value as any)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    <Badge variant="outline" className="ml-2">
                      {option.aspectRatio}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quality Selection */}
        <div className="space-y-2">
          <Label>Quality</Label>
          <Select
            value={params.quality}
            onValueChange={(value) => updateParams("quality", value as any)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      ${option.cost.toFixed(3)}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={disabled}
          >
            Advanced Options {showAdvanced ? "▼" : "▶"}
          </Button>

          {showAdvanced && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="seed">Seed (Optional)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Use the same seed to reproduce similar results</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  id="seed"
                  type="number"
                  value={params.seed || ""}
                  onChange={(e) =>
                    updateParams("seed", e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="Random seed (optional)"
                  disabled={disabled}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={disabled || isGenerating || !prompt.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? "Generating Image..." : "Generate Image"}
        </Button>

        {/* Cost Information */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>Estimated Cost:</span>
            <span className="font-medium">${estimatedCost.toFixed(3)} USD</span>
          </div>
          <div className="mt-1">
            Using OpenAI gpt-image-1 model • {params.quality} quality
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.2 Image Generation Preview Component

**Duration**: 4 hours

```typescript
// components/admin/blog-post-form/image-generation-preview.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Check, X, Copy, ExternalLink } from "lucide-react";
import { LoadingSpinner } from "@/components/layout/Loading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { GeneratedImage } from "@/lib/types/ai/image";

interface ImageGenerationPreviewProps {
  generatedImage?: GeneratedImage;
  isGenerating: boolean;
  onAccept: () => void;
  onRegenerate: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export function ImageGenerationPreview({
  generatedImage,
  isGenerating,
  onAccept,
  onRegenerate,
  onReject,
  disabled = false,
}: ImageGenerationPreviewProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopyPrompt = async () => {
    if (generatedImage?.prompt) {
      await navigator.clipboard.writeText(generatedImage.prompt);
      toast.success("Prompt copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (generatedImage?.url) {
      window.open(generatedImage.url, '_blank');
    }
  };

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generating Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <LoadingSpinner size="lg" />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Creating your image using AI...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take 10-30 seconds depending on complexity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!generatedImage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Image Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Generated image will appear here
              </p>
              <p className="text-xs text-muted-foreground">
                Configure your settings and click "Generate Image" to start
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Image Preview</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">AI Generated</Badge>
            {generatedImage.quality === "hd" && (
              <Badge variant="outline">HD Quality</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Preview */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <LoadingSpinner size="md" />
            </div>
          )}
          <Image
            src={generatedImage.url}
            alt="Generated blog post image"
            fill
            className="object-cover"
            onLoad={() => setImageLoading(false)}
            onLoadStart={() => setImageLoading(true)}
            onError={() => {
              setImageLoading(false);
              toast.error("Failed to load generated image");
            }}
          />
        </div>

        {/* Image Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Image Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 font-medium">{generatedImage.size}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="ml-2 font-medium capitalize">{generatedImage.quality}</span>
                </div>
                {generatedImage.seed && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Seed:</span>
                    <span className="ml-2 font-medium">{generatedImage.seed}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-muted-foreground">Generated:</span>
                  <span className="ml-2 font-medium">
                    {new Date(generatedImage.generatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Prompt Information */}
              <div className="space-y-2 border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Prompt Used:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPrompt}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy prompt to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs bg-background p-2 rounded border max-h-20 overflow-y-auto">
                  {generatedImage.prompt}
                </p>

                {generatedImage.revisedPrompt &&
                 generatedImage.revisedPrompt !== generatedImage.prompt && (
                  <div>
                    <span className="text-muted-foreground">AI Revised Prompt:</span>
                    <p className="text-xs bg-background p-2 rounded border max-h-20 overflow-y-auto mt-1">
                      {generatedImage.revisedPrompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onAccept}
            disabled={disabled || imageLoading}
            className="flex-1"
            variant="default"
          >
            <Check className="mr-2 h-4 w-4" />
            Accept & Use Image
          </Button>

          <Button
            onClick={onRegenerate}
            disabled={disabled || imageLoading}
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New
          </Button>

          <Button
            onClick={onReject}
            disabled={disabled || imageLoading}
            variant="ghost"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="pt-2 border-t space-y-2">
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Size
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.3 Main AI Image Generator Component

**Duration**: 6 hours

```typescript
// components/admin/blog-post-form/ai-image-generator.tsx
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, ArrowLeft, RefreshCw } from "lucide-react";
import { ImageGenerationParams } from "./image-generation-params";
import { ImageGenerationPreview } from "./image-generation-preview";
import type {
  ImagePromptSuggestion,
  GeneratedImage,
  ImageGenerationParams as IImageGenerationParams,
  BlogContent
} from "@/lib/types/ai/image";

interface AIImageGeneratorProps {
  title: string;
  content: string;
  excerpt?: string;
  currentImageUrl?: string;
  onImageAccepted: (imageUrl: string) => void;
  disabled?: boolean;
}

export function AIImageGenerator({
  title,
  content,
  excerpt,
  currentImageUrl,
  onImageAccepted,
  disabled = false,
}: AIImageGeneratorProps) {
  const [isPromptGenerating, setIsPromptGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [promptSuggestion, setPromptSuggestion] = useState<ImagePromptSuggestion | null>(null);
  const [params, setParams] = useState<IImageGenerationParams>({
    style: "modern",
    size: "1536x1024", // Default to landscape for blog posts
    quality: "standard",
  });

  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  // Generate AI prompt based on blog content
  const generatePrompt = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and content before generating a prompt");
      return;
    }

    setIsPromptGenerating(true);

    try {
      const blogContent: BlogContent = {
        title,
        content,
        excerpt,
      };

      const response = await fetch("/api/admin/blog/generate-image-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogContent }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate prompt");
      }

      const suggestion: ImagePromptSuggestion = result.data;
      setPromptSuggestion(suggestion);
      setPrompt(suggestion.prompt);
      setParams(prev => ({
        ...prev,
        style: suggestion.style as any
      }));

      toast.success("AI prompt generated successfully!");
    } catch (error) {
      console.error("Prompt generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate prompt");
    } finally {
      setIsPromptGenerating(false);
    }
  }, [title, content, excerpt]);

  // Generate image using current prompt and params
  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt for image generation");
      return;
    }

    setIsImageGenerating(true);

    try {
      const response = await fetch("/api/admin/blog/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          params,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate image");
      }

      const imageResponse = result.data;
      setGeneratedImage(imageResponse.data);

      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsImageGenerating(false);
    }
  }, [prompt, params]);

  // Upload generated image to storage and accept it
  const acceptImage = useCallback(async () => {
    if (!generatedImage?.url) return;

    try {
      // Download the image from the generated URL
      const imageResponse = await fetch(generatedImage.url);
      if (!imageResponse.ok) {
        throw new Error("Failed to download generated image");
      }

      const imageBlob = await imageResponse.blob();

      // Create a file name based on the current timestamp and prompt
      const fileName = `ai-generated-${Date.now()}.png`;

      // Upload to our storage
      const formData = new FormData();
      formData.append("file", imageBlob, fileName);

      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload image");
      }

      // Pass the uploaded image URL to parent
      onImageAccepted(uploadResult.data.url);

      // Reset state
      setGeneratedImage(null);
      setShowGenerator(false);
      setPrompt("");
      setPromptSuggestion(null);

      toast.success("Image uploaded and applied successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save image");
    }
  }, [generatedImage, onImageAccepted]);

  const handleRegenerate = useCallback(() => {
    setGeneratedImage(null);
    generateImage();
  }, [generateImage]);

  const handleReject = useCallback(() => {
    setGeneratedImage(null);
  }, []);

  const handleRefreshPrompt = useCallback(() => {
    setPrompt("");
    setPromptSuggestion(null);
    setGeneratedImage(null);
    generatePrompt();
  }, [generatePrompt]);

  if (!showGenerator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Image Generator
            <Badge variant="secondary">Powered by gpt-image-1</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a custom featured image for your blog post using AI. The system will
              analyze your content and create a relevant, professional image.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">✨ What you'll get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI-generated prompt based on your content</li>
                <li>• Customizable style and parameters</li>
                <li>• High-quality images suitable for blogs</li>
                <li>• Multiple generation attempts if needed</li>
              </ul>
            </div>

            <Button
              onClick={() => setShowGenerator(true)}
              disabled={disabled || !title.trim() || !content.trim()}
              className="w-full"
              size="lg"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Start AI Image Generation
            </Button>

            {(!title.trim() || !content.trim()) && (
              <p className="text-xs text-muted-foreground text-center">
                Add a title and content to enable image generation
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Image Generation
            </CardTitle>
            <Button
              onClick={() => setShowGenerator(false)}
              variant="ghost"
              size="sm"
              disabled={isPromptGenerating || isImageGenerating}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Step 1: Generate Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Step 1: Generate AI Prompt</span>
            {promptSuggestion && (
              <Button
                onClick={handleRefreshPrompt}
                variant="outline"
                size="sm"
                disabled={disabled || isPromptGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Prompt
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              First, we'll analyze your blog post content to create an optimized prompt for image generation.
            </p>

            {promptSuggestion && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">AI Analysis Complete</h4>
                  <Badge variant="outline">Style: {promptSuggestion.style}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Mood:</span> {promptSuggestion.mood}
                  </div>
                  <div>
                    <span className="font-medium">Key Elements:</span> {promptSuggestion.elements.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Reasoning:</span> {promptSuggestion.reasoning}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={generatePrompt}
              disabled={disabled || isPromptGenerating || !title.trim() || !content.trim()}
              className="w-full"
            >
              {isPromptGenerating
                ? "Analyzing Content..."
                : promptSuggestion
                  ? "Generate New Prompt"
                  : "Generate AI Prompt"
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Configure and Generate */}
      {prompt && (
        <ImageGenerationParams
          params={params}
          onParamsChange={setParams}
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={generateImage}
          isGenerating={isImageGenerating}
          disabled={disabled}
        />
      )}

      {/* Step 3: Preview and Accept */}
      <ImageGenerationPreview
        generatedImage={generatedImage}
        isGenerating={isImageGenerating}
        onAccept={acceptImage}
        onRegenerate={handleRegenerate}
        onReject={handleReject}
        disabled={disabled}
      />
    </div>
  );
}
```

## Phase 3: Integration with Blog Form (Day 5)

### 3.1 Update Featured Image Uploader

**Duration**: 3 hours

Modify the existing `FeaturedImageUploader` to include the AI generator:

```typescript
// components/admin/blog-post-form/featured-image-uploader.tsx (Updated)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Link, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AIImageGenerator } from "./ai-image-generator";
import Image from "next/image";

interface FeaturedImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  error?: string;
  // New props for AI generation
  blogTitle?: string;
  blogContent?: string;
  blogExcerpt?: string;
}

export function FeaturedImageUploader({
  value,
  onChange,
  disabled = false,
  error,
  blogTitle = "",
  blogContent = "",
  blogExcerpt = "",
}: FeaturedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      onChange(result.data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  // Handle URL input
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      new URL(urlInput); // Validate URL
      onChange(urlInput);
      setUrlInput("");
      toast.success("Image URL set successfully!");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  // Handle removing current image
  const handleRemoveImage = () => {
    onChange("");
    toast.success("Image removed");
  };

  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={disabled || isUploading}
                    />
                  </label>
                </div>
                {isUploading && (
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading image...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={disabled}
                    />
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={disabled || !urlInput.trim()}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <AIImageGenerator
            title={blogTitle}
            content={blogContent}
            excerpt={blogExcerpt}
            currentImageUrl={value}
            onImageAccepted={onChange}
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>

      {/* Current Image Preview */}
      {value && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Current Featured Image</Label>
                <Button
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="sm"
                  disabled={disabled}
                >
                  Remove
                </Button>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={value}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

### 3.2 Update Blog Post Form

**Duration**: 2 hours

Modify `BlogPostForm.tsx` to pass blog content to the image uploader:

```typescript
// In BlogPostForm.tsx, update the FeaturedImageUploader call:
<FeaturedImageUploader
  value={watch("featuredImage") || ""}
  onChange={(url) => setValue("featuredImage", url)}
  disabled={loading}
  error={errors.featuredImage?.message}
  blogTitle={watch("title") || ""}
  blogContent={watch("content") || ""}
  blogExcerpt={watch("excerpt") || ""}
/>
```

## Phase 4: Export and Configuration (Day 6)

### 4.1 Service Index Export

**Duration**: 1 hour

```typescript
// lib/ai/image/index.ts
export { ImageGenerator } from "./image-generator";
export { PromptGenerator } from "./prompt-generator";

// Export types for convenience
export type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  GeneratedImage,
  ImagePromptSuggestion,
  BlogContent,
  ImageGenerationParams,
} from "@/lib/types/ai/image";
```

### 4.2 Update Main AI Library

**Duration**: 1 hour

```typescript
// lib/ai/index.ts (Add to existing exports)
// Import new image services
import { ImageGenerator } from "./image/image-generator";
import { PromptGenerator } from "./image/prompt-generator";

// Add to AILibrary class
export class AILibrary {
  public modelManager: ModelManager;
  public messageHandler: MessageHandler;
  public imageGenerator: ImageGenerator;
  public promptGenerator: PromptGenerator;

  constructor() {
    this.modelManager = new ModelManager();
    this.messageHandler = new MessageHandler();
    this.imageGenerator = new ImageGenerator();
    this.promptGenerator = new PromptGenerator();
  }

  // ... existing methods ...

  /**
   * Generate image for blog post
   */
  async generateBlogImage(
    title: string,
    content: string,
    excerpt?: string,
    options?: {
      style?: string;
      size?: string;
      quality?: string;
    }
  ) {
    // Generate prompt first
    const promptSuggestion = await this.promptGenerator.generatePrompt({
      title,
      content,
      excerpt,
    });

    // Generate image with suggested prompt and options
    const params = {
      style: options?.style || promptSuggestion.style,
      size: options?.size || "1536x1024",
      quality: options?.quality || "standard",
    };

    return this.imageGenerator.generateImage(
      promptSuggestion.prompt,
      params as any
    );
  }
}
```

### 4.3 Environment Variables Documentation

**Duration**: 1 hour

Update `.env.example`:

```env
# ==================================
# AI IMAGE GENERATION CONFIGURATION
# ==================================

# OpenAI API key is required for image generation
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY="your_openai_api_key_here"

# AI Image Generation Configuration
# Model used for image generation (gpt-image-1 via standalone OpenAI package)
AI_IMAGE_MODEL="gpt-image-1"

# Default image generation settings
AI_IMAGE_DEFAULT_STYLE="modern"
AI_IMAGE_DEFAULT_SIZE="1536x1024"
AI_IMAGE_DEFAULT_QUALITY="standard"

# Feature toggle for AI image generation
AI_IMAGE_GENERATION_ENABLED="true"

# Cost and rate limiting for image generation
AI_IMAGE_MAX_GENERATIONS_PER_HOUR="20"
AI_IMAGE_WARN_COST_THRESHOLD="1.00"  # USD

# Performance settings
AI_IMAGE_TIMEOUT_MS="60000"  # 60 seconds
AI_IMAGE_RETRY_ATTEMPTS="2"
```

## 🔧 Technical Implementation Details

### Required Environment Variables

Add to `.env`:

```env
# OpenAI Configuration for Image Generation (Required)
OPENAI_API_KEY=your_openai_api_key_here

# AI Image Generation Configuration (Optional)
AI_IMAGE_GENERATION_ENABLED=true
AI_IMAGE_DEFAULT_STYLE=modern
AI_IMAGE_DEFAULT_SIZE=1536x1024
AI_IMAGE_DEFAULT_QUALITY=standard
```

### Database Schema

No additional schema changes required. The existing `blog_posts.featured_image` field will store generated image URLs.

### File Structure

```
lib/
├── types/ai/image/
│   ├── image-generation.type.ts     # Image generation types
│   ├── prompt-generation.type.ts    # Prompt generation types
│   └── index.ts                     # Type exports
└── ai/image/
    ├── image-generator.ts           # Main image generation service
    ├── prompt-generator.ts          # AI prompt generation service
    └── index.ts                     # Service exports

components/admin/blog-post-form/
├── ai-image-generator.tsx           # Main generator component
├── image-generation-params.tsx     # Parameter configuration
├── image-generation-preview.tsx    # Image preview and actions
└── featured-image-uploader.tsx     # Updated uploader with AI tab

app/api/admin/blog/
├── generate-image-prompt/route.ts  # Prompt generation endpoint
└── generate-image/route.ts         # Image generation endpoint
```

### Cost Considerations

**OpenAI gpt-image-1 Pricing**:

- Standard quality: ~$0.040 per image
- HD quality: ~$0.080 per image

**Usage Estimates**:

- 50 blog posts/month with AI images: $2-4/month
- 200 blog posts/month with AI images: $8-16/month

## 🎯 Success Metrics

### Functional Success Criteria

- ✅ Users can generate images using OpenAI gpt-image-1 model via standalone OpenAI package
- ✅ AI generates relevant prompts based on blog content
- ✅ Users can edit and customize prompts
- ✅ Generated images integrate seamlessly with existing image system
- ✅ Error handling works for all failure scenarios
- ✅ Proper type safety throughout the system

### User Experience Success Criteria

- ✅ Image generation completes in under 60 seconds
- ✅ UI remains responsive during generation
- ✅ Clear feedback throughout the process
- ✅ Easy to switch between manual and AI image options

### Technical Success Criteria

- ✅ No impact on existing blog functionality
- ✅ Proper error handling and logging
- ✅ Secure API endpoint access
- ✅ Efficient image storage and serving
- ✅ Well-organized types and services

## 🚀 Future Enhancements

### Phase 5: Advanced Features (Future)

- **Batch Generation**: Generate multiple image variations
- **Style Templates**: Predefined style sets for consistent branding
- **Image Editing**: Basic editing tools for generated images
- **Analytics**: Track generation success rates and user preferences
- **Integration**: Connect with other AI models for different styles

### Phase 6: Content Intelligence (Future)

- **Auto-Generation**: Automatically generate images when posts are published
- **Smart Suggestions**: Recommend when images might need regeneration
- **Brand Consistency**: Ensure generated images match brand guidelines
- **SEO Optimization**: Generate images optimized for social sharing

## 📝 Implementation Notes

### Dependencies

- **OpenAI standalone package**: For AI image generation with gpt-image-1 model (`npm install openai`)
- **AI SDK 5 Beta**: For text generation (prompt generation) only
- **Zod**: For type validation and schema definitions
- **Existing UI components**: Leverages current shadcn/ui library

### Required Package Installation

```bash
npm install openai
```

The `openai` package provides direct access to OpenAI's APIs, including the new gpt-image-1 model for image generation. This package is separate from the AI SDK and offers more direct control over the image generation process.

### Backward Compatibility

- Existing featured image functionality remains unchanged
- New feature is additive and optional
- No breaking changes to existing blog posts
- Can be disabled via feature flag

### Security Considerations

- Admin-only access to image generation
- Proper API key management through environment variables
- Rate limiting on generation endpoints (future enhancement)
- Input validation for all parameters using Zod schemas

This implementation plan provides a comprehensive approach to adding AI-powered image generation to the blog system while maintaining the existing functionality, using the standalone OpenAI package for image generation, organizing types correctly, and structuring services in the appropriate directories as requested.
