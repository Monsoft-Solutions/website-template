import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { PromptGenerator } from "@/lib/ai/image/prompt-generator";
import {
  BlogContentSchema,
  UserImageParametersSchema,
} from "@/lib/types/ai/image";
import { ApiResponse } from "@/lib/types/api-response.type";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { blogContent, userParameters, options } = body;

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

    // Check if user parameters are provided for the new flow
    if (userParameters) {
      // Validate user parameters
      const validatedParameters =
        UserImageParametersSchema.parse(userParameters);

      // Generate enhanced prompt with user parameters
      const suggestion = await promptGenerator.generatePrompt(
        validatedContent,
        validatedParameters,
        options
      );

      return NextResponse.json({
        success: true,
        data: suggestion,
        message: "Enhanced image prompt generated successfully",
      } as ApiResponse<typeof suggestion>);
    } else {
      // Fallback to legacy prompt generation for backward compatibility
      const suggestion = await promptGenerator.generatePromptLegacy(
        validatedContent,
        options
      );

      return NextResponse.json({
        success: true,
        data: suggestion,
        message: "Image prompt generated successfully (legacy mode)",
      } as ApiResponse<typeof suggestion>);
    }
  } catch (error) {
    console.error("Prompt generation error:", error);

    if (error instanceof Error && error.message.includes("parse")) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid request format or parameters",
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
