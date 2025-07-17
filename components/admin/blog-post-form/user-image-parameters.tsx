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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  Info,
  Palette,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { UserImageParameters } from "@/lib/types/ai/image";
import {
  getImageStyleOptions,
  getMoodOptions,
  getVisualAestheticOptions,
  getColorPaletteOptions,
  getAspectRatioOptions,
  getFocusLevelOptions,
  getLightingStyleOptions,
  getCameraAngleOptions,
} from "@/lib/types/ai/image";

interface UserImageParametersProps {
  parameters: UserImageParameters;
  onParametersChange: (parameters: UserImageParameters) => void;
  onGeneratePrompt: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function UserImageParametersComponent({
  parameters,
  onParametersChange,
  onGeneratePrompt,
  isGenerating,
  disabled = false,
}: UserImageParametersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [brandColors, setBrandColors] = useState<string[]>(
    parameters.brandColors || []
  );
  const [newColor, setNewColor] = useState("");

  const updateParameter = <K extends keyof UserImageParameters>(
    key: K,
    value: UserImageParameters[K]
  ) => {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  };

  const addBrandColor = () => {
    if (newColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      const updatedColors = [...brandColors, newColor];
      setBrandColors(updatedColors);
      updateParameter("brandColors", updatedColors);
      setNewColor("");
    }
  };

  const removeBrandColor = (index: number) => {
    const updatedColors = brandColors.filter((_, i) => i !== index);
    setBrandColors(updatedColors);
    updateParameter("brandColors", updatedColors);
  };

  const handleTextOverlayToggle = (checked: boolean | string) => {
    updateParameter("textOverlayAreaNeeded", checked === true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Define Image Parameters
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your image preferences to generate a tailored prompt.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Image Style *</Label>
          <Select
            value={parameters.imageStyle}
            onValueChange={(value) =>
              updateParameter(
                "imageStyle",
                value as UserImageParameters["imageStyle"]
              )
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose image style" />
            </SelectTrigger>
            <SelectContent>
              {getImageStyleOptions().map((option) => (
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

        {/* Mood / Tone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mood / Tone *</Label>
          <Select
            value={parameters.mood}
            onValueChange={(value) =>
              updateParameter("mood", value as UserImageParameters["mood"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose mood" />
            </SelectTrigger>
            <SelectContent>
              {getMoodOptions().map((option) => (
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

        {/* Visual Aesthetic */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Visual Aesthetic / Era *
          </Label>
          <Select
            value={parameters.visualAesthetic}
            onValueChange={(value) =>
              updateParameter(
                "visualAesthetic",
                value as UserImageParameters["visualAesthetic"]
              )
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose aesthetic" />
            </SelectTrigger>
            <SelectContent>
              {getVisualAestheticOptions().map((option) => (
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

        {/* Color Palette */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Color Palette *</Label>
          <Select
            value={parameters.colorPalette}
            onValueChange={(value) =>
              updateParameter(
                "colorPalette",
                value as UserImageParameters["colorPalette"]
              )
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose color palette" />
            </SelectTrigger>
            <SelectContent>
              {getColorPaletteOptions().map((option) => (
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

        {/* Brand Colors (if brand-specific palette is selected) */}
        {parameters.colorPalette === "brand_specific" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Brand Colors</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#FF5733"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  disabled={disabled}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addBrandColor}
                  disabled={disabled || !newColor}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              {brandColors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {brandColors.map((color, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                      style={{ borderColor: color }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                      <button
                        type="button"
                        onClick={() => removeBrandColor(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Aspect Ratio *</Label>
          <Select
            value={parameters.aspectRatio}
            onValueChange={(value) =>
              updateParameter(
                "aspectRatio",
                value as UserImageParameters["aspectRatio"]
              )
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              {getAspectRatioOptions().map((option) => (
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

        {/* Focus Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Focus Level *</Label>
          <Select
            value={parameters.focusLevel}
            onValueChange={(value) =>
              updateParameter(
                "focusLevel",
                value as UserImageParameters["focusLevel"]
              )
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose focus level" />
            </SelectTrigger>
            <SelectContent>
              {getFocusLevelOptions().map((option) => (
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

        {/* Text Overlay Area Needed */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">
              Text Overlay Area Needed
            </Label>
            <p className="text-xs text-muted-foreground">
              Leave room for title/text in the image
            </p>
          </div>
          <Checkbox
            checked={parameters.textOverlayAreaNeeded}
            onCheckedChange={handleTextOverlayToggle}
            disabled={disabled}
          />
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scene-description" className="text-sm font-medium">
              Scene Description (Optional)
            </Label>
            <Textarea
              id="scene-description"
              placeholder="A clean office desk with laptop and plants"
              value={parameters.sceneDescription || ""}
              onChange={(e) =>
                updateParameter("sceneDescription", e.target.value)
              }
              disabled={disabled}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-objects" className="text-sm font-medium">
              Main Objects (Optional)
            </Label>
            <Input
              id="main-objects"
              placeholder="Laptop, smartphone, coffee mug, pie chart"
              value={parameters.mainObjects || ""}
              onChange={(e) => updateParameter("mainObjects", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={disabled}
            className="w-full justify-between"
          >
            Advanced Options
            {showAdvanced ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {showAdvanced && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              {/* Lighting Style */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Lighting Style</Label>
                <Select
                  value={parameters.lightingStyle || ""}
                  onValueChange={(value) =>
                    updateParameter(
                      "lightingStyle",
                      value as UserImageParameters["lightingStyle"]
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose lighting style (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {getLightingStyleOptions().map((option) => (
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

              {/* Camera Angle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Camera Angle</Label>
                <Select
                  value={parameters.cameraAngle || ""}
                  onValueChange={(value) =>
                    updateParameter(
                      "cameraAngle",
                      value as UserImageParameters["cameraAngle"]
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose camera angle (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCameraAngleOptions().map((option) => (
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

              {/* Artist Influence */}
              <div className="space-y-2">
                <Label
                  htmlFor="artist-influence"
                  className="text-sm font-medium"
                >
                  Artist Influence (Optional)
                </Label>
                <Input
                  id="artist-influence"
                  placeholder="In the style of Van Gogh, Inspired by Pixar"
                  value={parameters.artistInfluence || ""}
                  onChange={(e) =>
                    updateParameter("artistInfluence", e.target.value)
                  }
                  disabled={disabled}
                />
                <p className="text-xs text-muted-foreground">
                  Optionally mimic a famous style or artist
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Generate Prompt Button */}
        <Button
          type="button"
          onClick={onGeneratePrompt}
          disabled={
            disabled ||
            isGenerating ||
            !parameters.imageStyle ||
            !parameters.mood ||
            !parameters.visualAesthetic ||
            !parameters.colorPalette ||
            !parameters.aspectRatio ||
            !parameters.focusLevel
          }
          className="w-full"
          size="lg"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isGenerating
            ? "Generating Tailored Prompt..."
            : "Generate AI Prompt"}
        </Button>

        {/* Information */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">How it works:</p>
              <p>
                These parameters will be analyzed along with your blog content
                to create a detailed, XML-structured prompt optimized for
                high-quality image generation.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
