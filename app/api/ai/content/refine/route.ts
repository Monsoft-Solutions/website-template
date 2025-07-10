import { NextRequest, NextResponse } from "next/server";
import { ContentRefiner } from "@/lib/ai/content/refiner";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";

interface ContentRefinementRequest {
  content: string;
  improvements: string[];
  tone?: string;
  targetAudience?: string;
  maintainStructure?: boolean;
}

/**
 * POST /api/ai/content/refine - Refine existing content using AI
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for AI content refinement
    await requireAdmin();

    const body: ContentRefinementRequest = await request.json();

    // Validate required fields
    if (!body.content || !body.improvements || body.improvements.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: "",
          error: "Content and improvements array are required",
        } as ApiResponse<string>,
        { status: 400 }
      );
    }

    const contentRefiner = new ContentRefiner();
    const refinedContent = await contentRefiner.improveContent(
      body.content,
      body.improvements,
      {
        tone: body.tone,
        targetAudience: body.targetAudience,
        maintainStructure: body.maintainStructure,
      }
    );

    return NextResponse.json({
      success: true,
      data: refinedContent,
      message: "Content refined successfully",
    } as ApiResponse<string>);
  } catch (error) {
    console.error("AI content refinement error:", error);
    return NextResponse.json(
      {
        success: false,
        data: "",
        error:
          error instanceof Error ? error.message : "Failed to refine content",
      } as ApiResponse<string>,
      { status: 500 }
    );
  }
}
