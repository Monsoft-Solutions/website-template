import { generateText, generateObject } from "ai";
import { z } from "zod";
import { ModelManager } from "../core/model-manager";
import {
  contentImprovementPrompt,
  seoOptimizationPrompt,
  readabilityEnhancementPrompt,
} from "../prompts";

/**
 * Content Refiner class for improving existing content quality
 */
export class ContentRefiner {
  private modelManager: ModelManager;

  constructor() {
    this.modelManager = new ModelManager();
  }

  /**
   * Improve content quality based on specific requirements
   */
  async improveContent(
    originalContent: string,
    improvements: string[],
    options?: {
      tone?: string;
      targetAudience?: string;
      maintainStructure?: boolean;
    }
  ): Promise<string> {
    const prompt = contentImprovementPrompt({
      originalContent,
      improvements,
      tone: options?.tone,
      targetAudience: options?.targetAudience,
      maintainStructure: options?.maintainStructure,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.7,
      });

      return result.text;
    } catch (error) {
      console.error("Content improvement failed:", error);
      throw new Error("Failed to improve content");
    }
  }

  /**
   * Optimize content for SEO
   */
  async optimizeForSEO(
    originalContent: string,
    targetKeywords: string[],
    options?: {
      primaryKeyword?: string;
      metaDescriptionRequired?: boolean;
      headingOptimization?: boolean;
      targetAudience?: string;
      competitorAnalysis?: string[];
    }
  ): Promise<string> {
    const prompt = seoOptimizationPrompt({
      originalContent,
      targetKeywords,
      primaryKeyword: options?.primaryKeyword,
      metaDescriptionRequired: options?.metaDescriptionRequired,
      headingOptimization: options?.headingOptimization,
      targetAudience: options?.targetAudience,
      competitorAnalysis: options?.competitorAnalysis,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.7,
      });

      return result.text;
    } catch (error) {
      console.error("SEO optimization failed:", error);
      throw new Error("Failed to optimize content for SEO");
    }
  }

  /**
   * Enhance content readability
   */
  async enhanceReadability(
    originalContent: string,
    options?: {
      targetReadingLevel?:
        | "elementary"
        | "middle-school"
        | "high-school"
        | "college"
        | "professional";
      targetAudience?: string;
      specificImprovements?: string[];
      maintainTechnicalTerms?: boolean;
      includeReadabilityScore?: boolean;
    }
  ): Promise<string> {
    const prompt = readabilityEnhancementPrompt({
      originalContent,
      targetReadingLevel: options?.targetReadingLevel,
      targetAudience: options?.targetAudience,
      specificImprovements: options?.specificImprovements,
      maintainTechnicalTerms: options?.maintainTechnicalTerms,
      includeReadabilityScore: options?.includeReadabilityScore,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.7,
      });

      return result.text;
    } catch (error) {
      console.error("Readability enhancement failed:", error);
      throw new Error("Failed to enhance content readability");
    }
  }

  /**
   * Comprehensive content refinement combining multiple improvements
   */
  async refineContent(
    originalContent: string,
    refinementOptions: {
      improvements?: string[];
      seoKeywords?: string[];
      readabilityLevel?:
        | "elementary"
        | "middle-school"
        | "high-school"
        | "college"
        | "professional";
      tone?: string;
      targetAudience?: string;
      maintainStructure?: boolean;
      includeMetaDescription?: boolean;
    }
  ): Promise<{
    improvedContent?: string;
    seoOptimizedContent?: string;
    readabilityEnhancedContent?: string;
    finalContent: string;
    refinementSteps: string[];
  }> {
    const refinementSteps: string[] = [];
    let currentContent = originalContent;

    try {
      // Step 1: General content improvement
      if (refinementOptions.improvements?.length) {
        refinementSteps.push("Content quality improvement");
        currentContent = await this.improveContent(
          currentContent,
          refinementOptions.improvements,
          {
            tone: refinementOptions.tone,
            targetAudience: refinementOptions.targetAudience,
            maintainStructure: refinementOptions.maintainStructure,
          }
        );
      }

      // Step 2: SEO optimization
      if (refinementOptions.seoKeywords?.length) {
        refinementSteps.push("SEO optimization");
        currentContent = await this.optimizeForSEO(
          currentContent,
          refinementOptions.seoKeywords,
          {
            metaDescriptionRequired: refinementOptions.includeMetaDescription,
            headingOptimization: true,
            targetAudience: refinementOptions.targetAudience,
          }
        );
      }

      // Step 3: Readability enhancement
      if (refinementOptions.readabilityLevel) {
        refinementSteps.push("Readability enhancement");
        currentContent = await this.enhanceReadability(currentContent, {
          targetReadingLevel: refinementOptions.readabilityLevel,
          targetAudience: refinementOptions.targetAudience,
          maintainTechnicalTerms: true,
        });
      }

      return {
        finalContent: currentContent,
        refinementSteps,
      };
    } catch (error) {
      console.error("Content refinement failed:", error);
      throw new Error("Failed to refine content");
    }
  }

  /**
   * Analyze content and suggest improvements
   */
  async analyzeContent(
    content: string,
    options?: {
      targetAudience?: string;
      targetKeywords?: string[];
      desiredReadingLevel?: string;
    }
  ): Promise<{
    suggestions: string[];
    estimatedReadingLevel: string;
    keywordDensity?: { [key: string]: number };
    improvementPriority: ("readability" | "seo" | "engagement" | "structure")[];
    overallScore: number;
    readabilityScore: number;
    seoScore: number;
    engagementScore: number;
  }> {
    const ContentAnalysisSchema = z.object({
      suggestions: z
        .array(z.string())
        .describe("5-10 specific, actionable improvement suggestions"),
      estimatedReadingLevel: z
        .string()
        .describe(
          "Current estimated reading level (e.g., 'High School', 'College', 'Professional')"
        ),
      keywordDensity: z
        .record(z.number())
        .optional()
        .describe("Keyword density percentages for target keywords"),
      improvementPriority: z
        .array(z.enum(["readability", "seo", "engagement", "structure"]))
        .describe("Priority areas for improvement, ordered by importance"),
      overallScore: z
        .number()
        .min(0)
        .max(100)
        .describe("Overall content quality score (0-100)"),
      readabilityScore: z
        .number()
        .min(0)
        .max(100)
        .describe("Readability score (0-100)"),
      seoScore: z
        .number()
        .min(0)
        .max(100)
        .describe("SEO optimization score (0-100)"),
      engagementScore: z
        .number()
        .min(0)
        .max(100)
        .describe("Content engagement potential score (0-100)"),
    });

    const analysisPrompt = `Analyze the following content and provide comprehensive improvement recommendations:

## Content to Analyze
${content}

## Analysis Context
${
  options?.targetAudience
    ? `- **Target Audience**: ${options.targetAudience}`
    : ""
}
${
  options?.targetKeywords?.length
    ? `- **Target Keywords**: ${options.targetKeywords.join(", ")}`
    : ""
}
${
  options?.desiredReadingLevel
    ? `- **Desired Reading Level**: ${options.desiredReadingLevel}`
    : ""
}

## Analysis Requirements

### 1. Improvement Suggestions
Provide 5-10 specific, actionable suggestions to improve the content. Focus on:
- Content clarity and flow
- SEO optimization opportunities
- Readability improvements
- Engagement enhancements
- Structural improvements

### 2. Reading Level Assessment
Estimate the current reading level of the content (e.g., "Elementary", "Middle School", "High School", "College", "Professional").

### 3. Keyword Analysis
${
  options?.targetKeywords?.length
    ? `Calculate keyword density for: ${options.targetKeywords.join(", ")}`
    : "Analyze keyword usage patterns"
}

### 4. Improvement Priority
Rank the following areas by priority for this content:
- **readability**: Sentence structure, word choice, paragraph organization
- **seo**: Keyword optimization, meta elements, search engine visibility
- **engagement**: Hook, storytelling, call-to-action, reader interest
- **structure**: Headings, flow, organization, logical progression

### 5. Scoring
Provide scores (0-100) for:
- **Overall Quality**: General content effectiveness
- **Readability**: How easy the content is to read and understand
- **SEO**: Search engine optimization potential
- **Engagement**: Ability to capture and maintain reader interest

## Instructions
- Be specific and actionable in suggestions
- Consider the target audience and keywords in your analysis
- Provide realistic, achievable recommendations
- Focus on high-impact improvements first`;

    try {
      const result = await generateObject({
        model: this.modelManager.getModel(),
        prompt: analysisPrompt,
        schema: ContentAnalysisSchema,
        temperature: 0.7,
      });

      return result.object;
    } catch (error) {
      console.error("Content analysis failed:", error);
      throw new Error("Failed to analyze content");
    }
  }
}
