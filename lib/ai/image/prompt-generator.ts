import { generateObject } from "ai";
import { ModelManager } from "@/lib/ai/core/model-manager";
import type {
  BlogContent,
  ImagePromptSuggestion,
  UserImageParameters,
} from "@/lib/types/ai/image";
import { ImagePromptSuggestionSchema } from "@/lib/types/ai/image";

/**
 * Service for generating AI-powered image prompts from blog content and user parameters
 */
export class PromptGenerator {
  private modelManager: ModelManager;

  constructor() {
    this.modelManager = new ModelManager();
  }

  /**
   * Generate an image prompt suggestion based on blog content and user parameters
   */
  async generatePrompt(
    blogContent: BlogContent,
    userParameters: UserImageParameters,
    options?: {
      targetAudience?: string;
      brandGuidelines?: string;
      preferredStyle?: string;
    }
  ): Promise<ImagePromptSuggestion> {
    try {
      const model = this.modelManager.getModel("gpt-4.1-mini");

      const result = await generateObject({
        model,
        schema: ImagePromptSuggestionSchema,
        prompt: this.buildParameterizedPromptGenerationPrompt(
          blogContent,
          userParameters,
          options
        ),
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
        userParameters,
      });

      throw new Error(
        `Failed to generate image prompt: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate multiple prompt variations based on user parameters
   */
  async generatePromptVariations(
    blogContent: BlogContent,
    userParameters: UserImageParameters,
    count: number = 3,
    options?: {
      targetAudience?: string;
      brandGuidelines?: string;
      preferredStyle?: string;
    }
  ): Promise<ImagePromptSuggestion[]> {
    const promises = Array.from({ length: count }, (_, index) =>
      this.generatePrompt(blogContent, userParameters, {
        ...options,
        // Add variation instruction for different perspectives
        variationIndex: index,
      } as Parameters<typeof this.generatePrompt>[2] & {
        variationIndex: number;
      })
    );

    return Promise.all(promises);
  }

  /**
   * Build the prompt for AI prompt generation with user parameters
   */
  private buildParameterizedPromptGenerationPrompt(
    blogContent: BlogContent,
    userParameters: UserImageParameters,
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

    // Convert user parameters to readable format
    const parametersDescription = this.formatUserParameters(userParameters);

    return `
# Advanced XML Image Prompt Generation for Blog Post

You are an expert at creating detailed, XML-structured prompts for AI image generation using OpenAI models. Your task is to analyze the provided blog post content AND user-defined image parameters to create a highly specific, tailored image prompt using the exact XML structure provided.

## Blog Post Details

**Title:** ${title}

${excerpt ? `**Excerpt:** ${excerpt}` : ""}

${category ? `**Category:** ${category}` : ""}

${tags && tags.length > 0 ? `**Tags:** ${tags.join(", ")}` : ""}

**Content Preview:**
${contentPreview}${hasMoreContent ? "..." : ""}

## User-Defined Image Parameters

${parametersDescription}

## Required XML Structure

You MUST use this exact XML structure for the xmlPrompt field:

\`\`\`xml
<promptTemplate>
  <title>[Blog post inspired title for the image]</title>

  <instructions>
    <goal>[Clear, high-level goal for the image]</goal>
    <constraints>
      <format>[Specific format requirements]</format>
      <style>[Style specifications based on user parameters]</style>
    </constraints>
  </instructions>

  <content>
    <description>[Specific subject, tone, contrast details]</description>
    <audience>[Target audience from blog context]</audience>
  </content>

  <visual>
    <style>
      <vibe>[Emotional tone from user parameters]</vibe>
      <colorPalette>[Color specifications from user parameters]</colorPalette>
      <mood>[Mood from user parameters]</mood>
      <medium>[Art medium/style from user parameters]</medium>
    </style>
    <composition>
      <layout>[Composition layout description]</layout>
      <focus>[What should be highlighted]</focus>
      <aspectRatio>[Aspect ratio from user parameters]</aspectRatio>
    </composition>
  </visual>

  <notes>
    <avoid>[Things to avoid in the image]</avoid>
    <inspiration>[Style or reference inspirations]</inspiration>
  </notes>

  <postProcessing>
    <feedbackRequest>Generate a detailed image based on this template, ensuring all visual elements align with the blog content and user specifications.</feedbackRequest>
  </postProcessing>
</promptTemplate>
\`\`\`

${options?.targetAudience ? `**Target Audience:** ${options.targetAudience}` : ""}
${options?.brandGuidelines ? `**Brand Guidelines:** ${options.brandGuidelines}` : ""}

${
  options?.variationIndex !== undefined && options.variationIndex > 0
    ? `\n## Variation Requirement\nThis is variation #${options.variationIndex + 1}. Create a different perspective or approach while maintaining relevance to the topic and user parameters.`
    : ""
}

## Your Output Requirements

Provide:
- **prompt**: A regular, detailed prompt suitable for direct use with image generation models
- **style**: Map the user's style preference to the closest available option (photorealistic, digital_art, illustration, minimalist, abstract, corporate, modern, artistic, natural)
- **mood**: The emotional tone from the user parameters
- **elements**: Key visual elements that will be included
- **reasoning**: Explanation of how you incorporated both blog content and user parameters
- **xmlPrompt**: The complete XML-structured prompt using the exact template structure above, filled with specific details relevant to the blog post and user parameters

## Important Guidelines

1. **Fill every XML section** with specific, relevant content
2. **Avoid text or typography** in the image itself
3. **Create professional featured images** suitable for publication
4. **Balance blog content relevance** with user visual requirements
5. **Use the exact XML structure** provided - do not modify the tags or structure
6. **Make content specific** - avoid generic placeholders

Remember: The XML prompt will be used directly for image generation, so ensure it's complete, specific, and actionable.
    `.trim();
  }

  /**
   * Format user parameters into a readable description
   */
  private formatUserParameters(params: UserImageParameters): string {
    const sections = [];

    // Core Requirements
    sections.push(
      `**Image Style:** ${this.formatEnumValue(params.imageStyle)}`
    );
    sections.push(`**Mood/Tone:** ${this.formatEnumValue(params.mood)}`);
    sections.push(
      `**Visual Aesthetic:** ${this.formatEnumValue(params.visualAesthetic)}`
    );
    sections.push(
      `**Color Palette:** ${this.formatEnumValue(params.colorPalette)}`
    );
    sections.push(`**Aspect Ratio:** ${params.aspectRatio}`);
    sections.push(
      `**Focus Level:** ${this.formatEnumValue(params.focusLevel)}`
    );

    // Optional elements
    if (params.sceneDescription) {
      sections.push(`**Scene Description:** ${params.sceneDescription}`);
    }

    if (params.mainObjects) {
      sections.push(`**Main Objects:** ${params.mainObjects}`);
    }

    if (params.textOverlayAreaNeeded) {
      sections.push(
        `**Text Overlay Area:** Required - leave space for text overlay`
      );
    }

    // Advanced options
    if (params.lightingStyle) {
      sections.push(
        `**Lighting Style:** ${this.formatEnumValue(params.lightingStyle)}`
      );
    }

    if (params.cameraAngle) {
      sections.push(
        `**Camera Angle:** ${this.formatEnumValue(params.cameraAngle)}`
      );
    }

    if (params.artistInfluence) {
      sections.push(`**Artist Influence:** ${params.artistInfluence}`);
    }

    // Brand colors
    if (
      params.colorPalette === "brand_specific" &&
      params.brandColors?.length
    ) {
      sections.push(`**Brand Colors:** ${params.brandColors.join(", ")}`);
    }

    return sections.join("\n");
  }

  /**
   * Format enum values to be more readable
   */
  private formatEnumValue(value: string): string {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Legacy method for backward compatibility - generates prompt without user parameters
   */
  async generatePromptLegacy(
    blogContent: BlogContent,
    options?: {
      targetAudience?: string;
      brandGuidelines?: string;
      preferredStyle?: string;
    }
  ): Promise<ImagePromptSuggestion> {
    try {
      const model = this.modelManager.getModel("gpt-4o");

      const result = await generateObject({
        model,
        schema: ImagePromptSuggestionSchema,
        prompt: this.buildLegacyPromptGenerationPrompt(blogContent, options),
        temperature: 0.7,
      });

      return result.object;
    } catch (error) {
      console.error("Legacy prompt generation failed:", {
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
   * Legacy prompt generation for backward compatibility
   */
  private buildLegacyPromptGenerationPrompt(
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
# XML Image Prompt Generation for Blog Post (Legacy Mode)

You are an expert at creating detailed, XML-structured prompts for AI image generation using OpenAI models. Your task is to analyze the provided blog post content and create a compelling image prompt using the standard XML structure.

## Blog Post Details

**Title:** ${title}

${excerpt ? `**Excerpt:** ${excerpt}` : ""}

${category ? `**Category:** ${category}` : ""}

${tags && tags.length > 0 ? `**Tags:** ${tags.join(", ")}` : ""}

**Content Preview:**
${contentPreview}${hasMoreContent ? "..." : ""}

## Required XML Structure

You MUST use this exact XML structure for the xmlPrompt field:

\`\`\`xml
<promptTemplate>
  <metadata>
    <model>gpt-4o-image</model>
    <version>v1</version>
    <author>SiteWave AI</author>
    <date>${new Date().toISOString().split("T")[0]}</date>
  </metadata>

  <title>[Blog post inspired title for the image]</title>

  <instructions>
    <goal>[Clear, high-level goal for the image]</goal>
    <constraints>
      <format>[Specific format requirements]</format>
      <style>[Style specifications]</style>
    </constraints>
  </instructions>

  <content>
    <description>[Specific subject, tone, contrast details]</description>
    <audience>[Target audience from blog context]</audience>
  </content>

  <visual>
    <style>
      <vibe>[Emotional tone]</vibe>
      <colorPalette>[Color specifications]</colorPalette>
      <mood>[Mood setting]</mood>
      <medium>[Art medium/style]</medium>
    </style>
    <composition>
      <layout>[Composition layout description]</layout>
      <focus>[What should be highlighted]</focus>
      <aspectRatio>[Aspect ratio - default to 16:9 for blog featured images]</aspectRatio>
    </composition>
  </visual>

  <notes>
    <avoid>[Things to avoid in the image]</avoid>
    <inspiration>[Style or reference inspirations]</inspiration>
  </notes>

  <postProcessing>
    <feedbackRequest>Generate a detailed featured image based on this template, ensuring professional quality suitable for blog publication.</feedbackRequest>
  </postProcessing>
</promptTemplate>
\`\`\`

### Style Considerations:
${options?.preferredStyle ? `- Preferred style: ${options.preferredStyle}` : "- Use modern, clean, and professional styles"}
${options?.targetAudience ? `- Target audience: ${options.targetAudience}` : ""}
${options?.brandGuidelines ? `- Brand guidelines: ${options.brandGuidelines}` : ""}

${
  options?.variationIndex !== undefined && options.variationIndex > 0
    ? `\n## Variation Requirement\nThis is variation #${options.variationIndex + 1}. Create a different perspective or approach while maintaining relevance to the topic.`
    : ""
}

## Your Output Requirements

Please provide:
- **prompt**: A detailed, specific prompt for image generation
- **style**: The recommended artistic style from the available options (photorealistic, digital_art, illustration, minimalist, abstract, corporate, modern, artistic, natural)
- **mood**: The emotional tone the image should convey
- **elements**: Key visual elements that should be included
- **reasoning**: Brief explanation of why this prompt would work well for this blog post
- **xmlPrompt**: The complete XML-structured prompt using the exact template structure above

## Important Guidelines

1. **Fill every XML section** with specific, relevant content
2. **Avoid text or typography** in the image itself
3. **Create professional featured images** suitable for publication
4. **Focus on visual elements** that represent the blog content
5. **Use the exact XML structure** provided - do not modify the tags or structure

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

  /**
   * Extract a clean, readable prompt from an XML-structured prompt for display
   */
  static extractDisplayPrompt(xmlPrompt: string): string {
    try {
      // Check if it's actually an XML prompt
      if (!xmlPrompt.trim().startsWith("<promptTemplate>")) {
        return xmlPrompt; // Return as-is if not XML
      }

      // Helper function to extract content between XML tags
      const extractTag = (tagName: string): string => {
        const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, "s");
        const match = xmlPrompt.match(regex);
        return match ? match[1].trim() : "";
      };

      // Extract key sections for display
      const sections = [];

      const goal = extractTag("goal");
      if (goal) sections.push(goal);

      const description = extractTag("description");
      if (description) sections.push(description);

      const vibe = extractTag("vibe");
      if (vibe) sections.push(`Style: ${vibe}`);

      const mood = extractTag("mood");
      if (mood) sections.push(`Mood: ${mood}`);

      const colorPalette = extractTag("colorPalette");
      if (colorPalette) sections.push(`Colors: ${colorPalette}`);

      return sections.join(". ") || "AI-generated image prompt";
    } catch (error) {
      console.error("Error extracting display prompt:", error);
      return "AI-generated image prompt";
    }
  }

  /**
   * Check if a prompt is XML-structured
   */
  static isXMLPrompt(prompt: string): boolean {
    return (
      prompt.trim().startsWith("<promptTemplate>") &&
      prompt.includes("</promptTemplate>")
    );
  }
}
