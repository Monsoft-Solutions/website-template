/**
 * Blog Post Generation Prompt
 * Generates a comprehensive blog post with structured data
 */

export interface BlogPostPromptParams {
  topic: string;
  keywords: string[];
  tone: string;
  length: "short" | "medium" | "long";
  audience?: string;
}

export function blogPostPrompt(params: BlogPostPromptParams): string {
  const lengthGuidance = {
    short: "600-800 words",
    medium: "1000-1500 words",
    long: "1500-2500 words",
  };

  return `# Blog Post Generation Request

## Topic
${params.topic}

## Requirements
- **Keywords to include**: ${params.keywords.join(", ")}
- **Tone**: ${params.tone}
- **Target length**: ${lengthGuidance[params.length]}
${params.audience ? `- **Target audience**: ${params.audience}` : ""}

## Content Structure Requirements

The blog post should include:

### 1. SEO-Optimized Title
- Engaging and clickable
- Include primary keyword naturally
- Under 60 characters for optimal SEO

### 2. Compelling Excerpt/Introduction
- 150-200 words
- Hook the reader immediately
- Preview the value they'll get

### 3. Well-Structured Content
- Use proper heading hierarchy (H2, H3, H4)
- Break up text with subheadings
- Include bullet points and numbered lists where appropriate
- Write in scannable paragraphs (2-3 sentences max)

### 4. Keyword Integration
- Naturally incorporate all provided keywords
- Maintain keyword density of 1-2%
- Use semantic variations and related terms

### 5. Value-Driven Content
- Provide actionable insights
- Include real examples and case studies
- Address common pain points
- Offer practical solutions

### 6. SEO Elements
- Generate 5-8 relevant tags
- Create meta description (150-160 characters)
- Create meta title (50-60 characters, optimized for search)
- Generate meta keywords (comma-separated, 8-12 relevant keywords)
- Suggest internal linking opportunities

### 7. Strong Conclusion
- Summarize key takeaways
- Include a clear call-to-action
- Encourage engagement (comments, shares, etc.)

## Output Format
Return a structured blog post with all required fields including:
- title: Main blog post title
- content: Full blog post content in markdown format
- excerpt: Compelling introduction/summary
- tags: Array of relevant tags (5-8 items)
- metaDescription: SEO meta description (150-160 characters)
- metaTitle: SEO meta title (50-60 characters, can be different from main title)
- metaKeywords: Comma-separated keywords for SEO (8-12 keywords)
- category: Suggested category name
- slug: URL-friendly slug (optional, will be auto-generated if not provided)

Generate comprehensive, high-quality content that provides genuine value to readers while being optimized for search engines.`;
}
