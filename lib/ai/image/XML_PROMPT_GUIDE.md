# XML Prompt Structure for AI Image Generation

## Overview

This implementation provides a structured XML format for creating detailed, comprehensive prompts for AI image generation. The XML structure ensures consistency, clarity, and comprehensive coverage of all visual parameters.

## XML Structure

```xml
<promptTemplate>
  <metadata>
    <model>gpt-4o-image</model>
    <version>v1</version>
    <author>SiteWave AI</author>
    <date>2025-01-16</date>
  </metadata>

  <title>Image Title</title>

  <instructions>
    <goal>Clear, high-level goal for the image</goal>
    <constraints>
      <format>Specific format requirements</format>
      <style>Style specifications based on user parameters</style>
    </constraints>
  </instructions>

  <content>
    <description>Specific subject, tone, contrast details</description>
    <audience>Target audience from blog context</audience>
  </content>

  <visual>
    <style>
      <vibe>Emotional tone from user parameters</vibe>
      <colorPalette>Color specifications from user parameters</colorPalette>
      <mood>Mood from user parameters</mood>
      <medium>Art medium/style from user parameters</medium>
    </style>
    <composition>
      <layout>Composition layout description</layout>
      <focus>What should be highlighted</focus>
      <aspectRatio>Aspect ratio from user parameters</aspectRatio>
    </composition>
  </visual>

  <notes>
    <avoid>Things to avoid in the image</avoid>
    <inspiration>Style or reference inspirations</inspiration>
  </notes>

  <postProcessing>
    <feedbackRequest>Generate a detailed image based on this template, ensuring all visual elements align with the blog content and user specifications.</feedbackRequest>
  </postProcessing>
</promptTemplate>
```

## Implementation Details

### 1. Prompt Generation

The `PromptGenerator` class now generates XML-structured prompts by default:

```typescript
import { PromptGenerator } from "@/lib/ai/image/prompt-generator";

const generator = new PromptGenerator();
const suggestion = await generator.generatePrompt(blogContent, userParameters);
// suggestion.xmlPrompt contains the full XML structure
```

### 2. Image Generation

The `ImageGenerator` class automatically detects and processes XML prompts:

```typescript
import { ImageGenerator } from "@/lib/ai/image/image-generator";

const generator = new ImageGenerator();

// Automatically detects XML and processes it
const result = await generator.generateImage(xmlPrompt, params);

// Or explicitly use XML method
const result = await generator.generateImageFromXML(xmlPrompt, params);
```

### 3. XML Processing

When an XML prompt is processed for image generation, it extracts key sections and creates a clean prompt:

- **Goal** → Primary objective
- **Description** → Main scene details
- **Style/Vibe/Mood** → Artistic direction
- **Color Palette** → Color specifications
- **Layout/Focus** → Composition details
- **Avoid** → Constraints

### 4. UI Integration

The UI components automatically handle XML prompts:

```typescript
// Check if a prompt is XML
const isXML = PromptGenerator.isXMLPrompt(prompt);

// Extract display-friendly version
const displayText = PromptGenerator.extractDisplayPrompt(xmlPrompt);
```

## Benefits

1. **Structured Approach**: Ensures all visual parameters are considered
2. **Consistency**: Standardized format across all image generation
3. **Flexibility**: Easy to modify individual sections
4. **Readability**: Clear, organized structure for debugging and refinement
5. **Metadata Tracking**: Version control and authorship information
6. **Backward Compatibility**: System handles both XML and regular prompts

## Example Usage

### Basic Blog Image Generation

```typescript
const blogContent = {
  title: "Modern Web Development",
  content: "Article about React and Next.js...",
  excerpt: "Learn modern web development",
};

const userParams = {
  imageStyle: "realistic_photo",
  mood: "professional",
  visualAesthetic: "modern_contemporary",
  colorPalette: "cool_colors",
  aspectRatio: "16:9",
  focusLevel: "medium_shot",
};

const suggestion = await generator.generatePrompt(blogContent, userParams);
const image = await imageGenerator.generateImageFromXML(
  suggestion.xmlPrompt,
  params
);
```

### Direct XML Usage

```typescript
const xmlPrompt = `
<promptTemplate>
  <metadata>
    <model>gpt-4o-image</model>
    <version>v1</version>
    <author>SiteWave AI</author>
    <date>2025-01-16</date>
  </metadata>
  <!-- ... rest of XML structure ... -->
</promptTemplate>
`;

const image = await imageGenerator.generateImageFromXML(xmlPrompt, params);
```

## API Integration

The existing API endpoints automatically handle XML prompts:

```typescript
// POST /api/admin/blog/generate-image
{
  "prompt": "<promptTemplate>...</promptTemplate>",
  "params": { /* generation parameters */ }
}
```

The system detects XML structure and processes it appropriately, returning the generated image with both the processed prompt and original XML stored for reference.

## Troubleshooting

### Common Issues

1. **Invalid XML**: Ensure proper tag nesting and closing
2. **Missing Sections**: All required sections must be present
3. **Empty Content**: Sections should contain meaningful content
4. **Processing Errors**: Check console for XML parsing errors

### Debugging

- Use `PromptGenerator.isXMLPrompt()` to verify XML detection
- Use `PromptGenerator.extractDisplayPrompt()` to see processed output
- Check the `xmlPrompt` field in generated image results for reference

## Migration from Legacy Prompts

Existing prompts will continue to work unchanged. The system automatically:

1. Detects prompt type (XML vs regular)
2. Processes accordingly
3. Maintains backward compatibility
4. Stores original format for reference

New prompts generated through the enhanced UI will use the XML structure by default, providing richer, more detailed image generation capabilities.
