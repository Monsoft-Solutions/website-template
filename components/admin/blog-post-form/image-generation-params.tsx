"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getDefaultParams,
  getSupportedConfigurations,
  type ImageGenerationParams,
  type ImageModel,
} from "@/lib/types/ai/image";
import { Input } from "@/components/ui/input";

interface ImageGenerationParamsProps {
  params: ImageGenerationParams;
  onParamsChange: (params: ImageGenerationParams) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

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
  const [configurations] = useState(() => getSupportedConfigurations());

  const updateParams = <K extends keyof ImageGenerationParams>(
    key: K,
    value: ImageGenerationParams[K]
  ) => {
    onParamsChange({
      ...params,
      [key]: value,
    });
  };

  // Handle model change and update parameters accordingly
  const handleModelChange = (model: ImageModel) => {
    const defaultParams = getDefaultParams(model);
    onParamsChange({
      ...defaultParams,
      style: params.style, // Keep the current style if compatible
      seed: params.seed, // Keep the current seed
    });
  };

  // Get available options based on selected model
  const getAvailableSizes = () => {
    if (params.model === "dalle-3") {
      return configurations.dalle3.sizes;
    } else {
      return configurations.gptImage1.sizes;
    }
  };

  const getAvailableQualities = () => {
    if (params.model === "dalle-3") {
      return configurations.dalle3.qualities;
    } else {
      return configurations.gptImage1.qualities;
    }
  };

  const getAvailableStyles = () => {
    if (params.model === "dalle-3") {
      return [
        ...configurations.commonStyles,
        ...configurations.dalle3.styles.map((s) => ({
          value: s.value,
          label: `${s.label} (DALL-E)`,
          description: s.description,
        })),
      ];
    } else {
      return configurations.commonStyles;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Image Generation Settings</span>
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
            Be specific and descriptive. Avoid requesting text or typography in
            the image.
          </p>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label>AI Model</Label>
          <Select
            value={params.model}
            onValueChange={(value) => handleModelChange(value as ImageModel)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {configurations.models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span>{model.label}</span>
                      {model.default && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label>Style</Label>
          <Select
            value={params.style}
            onValueChange={(value) =>
              updateParams("style", value as ImageGenerationParams["style"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableStyles().map((option) => (
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
            onValueChange={(value) =>
              updateParams("size", value as ImageGenerationParams["size"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableSizes().map((option) => (
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
            onValueChange={(value) =>
              updateParams("quality", value as ImageGenerationParams["quality"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableQualities().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {params.model === "dalle-3"
                          ? option.value === "hd"
                            ? "Higher quality, slower generation"
                            : "Good quality, faster generation"
                          : `${option.label} quality generation`}
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
            type="button"
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
                <Input
                  id="seed"
                  type="number"
                  value={params.seed || ""}
                  onChange={(e) =>
                    updateParams(
                      "seed",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Random seed (optional)"
                  disabled={disabled}
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          type="button"
          onClick={onGenerate}
          disabled={disabled || isGenerating || !prompt.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? "Generating Image..." : "Generate Image"}
        </Button>

        {/* Cost Information */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <div className="mt-1">
            Using OpenAI {params.model} model • {params.quality} quality
          </div>
          {params.model === "gpt-image-1" && (
            <div className="mt-1 text-xs text-blue-600">
              ⭐ Default model with improved quality and efficiency
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
