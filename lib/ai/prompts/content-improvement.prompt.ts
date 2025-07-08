/**
 * Content Improvement Prompt
 * Improves existing content quality and effectiveness
 */

export interface ContentImprovementPromptParams {
  originalContent: string;
  improvements: string[];
  tone?: string;
  targetAudience?: string;
  maintainStructure?: boolean;
}

export function contentImprovementPrompt(
  params: ContentImprovementPromptParams
): string {
  return `# Content Improvement Request

## Original Content
${params.originalContent}

## Improvement Requirements
${params.improvements.map((improvement) => `- ${improvement}`).join("\n")}

${
  params.tone
    ? `## Tone Requirements
- **Target Tone**: ${params.tone}
- Maintain consistency throughout the improved content`
    : ""
}

${
  params.targetAudience
    ? `## Target Audience
- **Audience**: ${params.targetAudience}
- Ensure language and complexity match audience level`
    : ""
}

## Improvement Guidelines

### 1. Content Quality Enhancement
- **Clarity**: Improve sentence structure and word choice
- **Flow**: Enhance logical progression and transitions
- **Engagement**: Make content more compelling and interesting
- **Precision**: Remove redundancy and tighten language

### 2. Structure and Organization
${
  params.maintainStructure
    ? "- **Maintain Structure**: Keep the original structure and key points intact"
    : "- **Optimize Structure**: Improve organization and flow as needed"
}
- **Headings**: Enhance heading hierarchy and clarity
- **Paragraphs**: Break up long paragraphs for better readability
- **Lists**: Use bullet points and numbered lists where appropriate

### 3. Readability Improvements
- **Sentence Length**: Vary sentence length for better rhythm
- **Word Choice**: Use more precise and impactful vocabulary
- **Active Voice**: Convert passive voice to active where appropriate
- **Transitions**: Add smooth transitions between ideas

### 4. Value Enhancement
- **Actionable Content**: Make information more practical and useful
- **Examples**: Add relevant examples or case studies where helpful
- **Specificity**: Replace vague statements with specific details
- **Evidence**: Include supporting facts or statistics when relevant

### 5. Formatting and Style
- **Consistency**: Ensure consistent formatting throughout
- **Emphasis**: Use bold, italics, and other formatting strategically
- **White Space**: Improve visual appeal with proper spacing
- **Scanability**: Make content easy to scan and digest

### 6. Content Completeness
- **Gaps**: Fill in missing information or context
- **Depth**: Add appropriate depth without overwhelming
- **Balance**: Ensure balanced coverage of all key points
- **Completeness**: Address all aspects of the topic

## Output Requirements
Provide the improved content that:
- Addresses all specified improvement requirements
- Maintains the original intent and key messages
- Enhances overall quality and effectiveness
- Improves readability and engagement
- Follows the specified tone and audience considerations
${
  params.maintainStructure
    ? "- Preserves the original structure and organization"
    : "- Optimizes structure for better flow and organization"
}

## Instructions
1. Carefully analyze the original content
2. Apply each improvement requirement systematically
3. Maintain the core message and value proposition
4. Ensure all improvements work together cohesively
5. Provide only the improved version without explanations

Generate high-quality improved content that significantly enhances the original while maintaining its essential character and purpose.`;
}
