import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { ImageGenerator } from "@/lib/ai/image/image-generator";
import {
  ImageGenerationRequestSchema,
  type ImageGenerationResponse,
} from "@/lib/types/ai/image";
import { ApiResponse } from "@/lib/types/api-response.type";
import { uploadBase64ToBlob } from "@/lib/utils/blob-upload";

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

    // Check if prompt is XML-structured and use appropriate generation method
    const isXMLPrompt =
      prompt.trim().startsWith("<promptTemplate>") &&
      prompt.includes("</promptTemplate>");

    // Generate image using appropriate method
    const generatedImage = isXMLPrompt
      ? await imageGenerator.generateImageFromXML(prompt, params)
      : await imageGenerator.generateImage(prompt, params);

    // Upload the generated image to Vercel Blob to get a public URL
    let uploadedImageUrl = generatedImage.url;

    if (generatedImage.base64) {
      try {
        const uploadResult = await uploadBase64ToBlob(
          generatedImage.base64,
          "image/png", // Default to PNG for AI-generated images
          { folder: "ai-generated" }
        );
        uploadedImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error("Failed to upload generated image:", uploadError);
        // Continue with the original URL if upload fails
      }
    }

    const processingTime = Date.now() - startTime;

    // Create the response with the uploaded URL
    const responseImage = {
      ...generatedImage,
      url: uploadedImageUrl,
      // Remove base64 data from response to keep it lightweight
      base64: undefined,
    };

    const response: ImageGenerationResponse = {
      success: true,
      data: responseImage,
      metadata: {
        model: params.model, // Use the actual model from parameters
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
