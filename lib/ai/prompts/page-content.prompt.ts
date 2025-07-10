/**
 * Page Content Generation Prompt
 * Creates high-quality page content for various page types
 */

export interface PageContentPromptParams {
  pageType: string;
  topic: string;
  keywords: string[];
  tone: string;
  customInstructions?: string;
}

export function pageContentPrompt(params: PageContentPromptParams): string {
  return `# Page Content Generation Request

## Page Details
- **Page Type**: ${params.pageType}
- **Topic**: ${params.topic}
- **Keywords**: ${params.keywords.join(", ")}
- **Tone**: ${params.tone}
${
  params.customInstructions
    ? `- **Custom Instructions**: ${params.customInstructions}`
    : ""
}

## Content Requirements

### 1. Page-Specific Content
Create content appropriate for a **${
    params.pageType
  }** page that users would expect to find, including:
- Relevant information for this page type
- Clear value proposition
- User-focused benefits
- Actionable information

### 2. SEO Optimization
- **Keyword Integration**: Naturally incorporate all provided keywords
- **Keyword Density**: Maintain 1-2% keyword density
- **Semantic Keywords**: Use related terms and variations
- **Content Structure**: Use proper heading hierarchy (H1, H2, H3)

### 3. User Experience Focus
- **Scannable Content**: Use bullet points, lists, and short paragraphs
- **Clear Information Architecture**: Organize content logically
- **Value-First Approach**: Lead with benefits and outcomes
- **Easy Navigation**: Structure content for easy scanning

### 4. Engagement Elements
- **Compelling Headlines**: Create attention-grabbing section headers
- **Persuasive Copy**: Use persuasive language appropriate for the tone
- **Clear CTAs**: Include relevant calls-to-action where appropriate
- **Social Proof**: Integrate trust signals and credibility markers

### 5. Content Structure Guidelines
- **Introduction**: Hook visitors and explain page value
- **Main Content**: Deliver on the promised information
- **Supporting Sections**: Add relevant supporting information
- **Conclusion**: Summarize key points and guide next steps

### 6. Tone and Style
- **Consistency**: Maintain ${params.tone} tone throughout
- **Audience Appropriate**: Match language to target audience
- **Brand Voice**: Professional yet approachable
- **Clarity**: Use clear, concise language

### 7. Conversion Optimization
- **Trust Building**: Include credibility indicators
- **Objection Handling**: Address common concerns
- **Value Communication**: Clearly communicate benefits
- **Action Oriented**: Guide visitors toward desired actions

## Output Requirements
Generate comprehensive page content that:
- Provides genuine value to visitors
- Meets user expectations for a ${params.pageType} page
- Incorporates all keywords naturally
- Maintains specified tone and style
- Encourages visitor engagement and action
- Is optimized for both users and search engines

Create content that keeps visitors engaged and motivates them to take the next step in their journey.`;
}
