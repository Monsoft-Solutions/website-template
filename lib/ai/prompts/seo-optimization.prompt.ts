/**
 * SEO Optimization Prompt
 * Optimizes content for search engines while maintaining readability
 */

export interface SeoOptimizationPromptParams {
  originalContent: string;
  targetKeywords: string[];
  primaryKeyword?: string;
  metaDescriptionRequired?: boolean;
  headingOptimization?: boolean;
  targetAudience?: string;
  competitorAnalysis?: string[];
}

export function seoOptimizationPrompt(
  params: SeoOptimizationPromptParams
): string {
  return `# SEO Content Optimization Request

## Original Content
${params.originalContent}

## SEO Requirements
- **Target Keywords**: ${params.targetKeywords.join(", ")}
${
  params.primaryKeyword ? `- **Primary Keyword**: ${params.primaryKeyword}` : ""
}
${
  params.metaDescriptionRequired
    ? "- **Meta Description**: Required (150-160 characters)"
    : ""
}
${
  params.headingOptimization
    ? "- **Heading Optimization**: Optimize H1-H6 tags"
    : ""
}
${
  params.targetAudience ? `- **Target Audience**: ${params.targetAudience}` : ""
}
${
  params.competitorAnalysis?.length
    ? `- **Competitor Keywords**: ${params.competitorAnalysis.join(", ")}`
    : ""
}

## SEO Optimization Guidelines

### 1. Keyword Integration
- **Natural Placement**: Integrate keywords naturally throughout the content
- **Keyword Density**: Maintain 1-2% keyword density for primary keyword
- **Semantic Keywords**: Use related terms and synonyms
- **Avoid Keyword Stuffing**: Ensure content reads naturally
- **Long-tail Keywords**: Include relevant long-tail variations

### 2. Content Structure Optimization
${
  params.headingOptimization
    ? `
#### Heading Optimization
- **H1 Tag**: Include primary keyword in main heading
- **H2 Tags**: Use secondary keywords in subheadings
- **H3-H6 Tags**: Optimize hierarchy with relevant keywords
- **Heading Flow**: Ensure logical progression and structure
`
    : ""
}

#### Content Organization
- **Introduction**: Hook readers with keyword-rich opening
- **Body Sections**: Organize content with clear, keyword-optimized headings
- **Conclusion**: Summarize key points with keyword reinforcement
- **Call-to-Action**: Include relevant CTAs with action keywords

### 3. On-Page SEO Elements
- **Title Optimization**: Craft compelling, keyword-rich titles
- **Internal Linking**: Suggest relevant internal link opportunities
- **Content Length**: Ensure appropriate content depth (300+ words minimum)
- **Featured Snippets**: Structure content to potentially capture snippets

${
  params.metaDescriptionRequired
    ? `
### 4. Meta Description
Create an optimized meta description that:
- Contains primary keyword naturally
- Stays within 150-160 characters
- Includes compelling call-to-action
- Accurately describes the content
- Encourages click-through
`
    : ""
}

### 5. Content Quality for SEO
- **Readability**: Maintain good readability scores (Flesch-Kincaid)
- **User Intent**: Align content with search intent
- **Comprehensive Coverage**: Address topic thoroughly
- **Original Content**: Ensure uniqueness and value
- **Engagement Factors**: Include elements that encourage interaction

### 6. Technical SEO Considerations
- **Content Length**: Optimize for appropriate word count
- **Paragraph Structure**: Use short paragraphs (2-3 sentences)
- **Lists and Bullets**: Implement scannable formatting
- **Bold and Italics**: Use for emphasis and keyword highlighting
- **Image Alt Text**: Suggest alt text for any referenced images

### 7. Search Intent Alignment
- **Informational Intent**: Provide comprehensive, educational content
- **Transactional Intent**: Include clear purchase/action signals
- **Navigational Intent**: Ensure clear navigation and structure
- **Commercial Intent**: Balance information with conversion elements

## Optimization Focus Areas

### Primary Optimization
- **Content Quality**: Maintain high-quality, valuable content
- **Keyword Integration**: Natural, strategic keyword placement
- **User Experience**: Ensure content serves user needs first
- **Search Engine Signals**: Optimize for ranking factors

### Secondary Optimization
- **Related Keywords**: Include semantic and LSI keywords
- **Content Depth**: Provide comprehensive topic coverage
- **Authority Building**: Include expertise and credibility signals
- **Social Sharing**: Create shareable, engaging content

## Output Requirements
Provide SEO-optimized content that:
- Naturally incorporates all target keywords
- Maintains original content quality and readability
- Follows SEO best practices without compromising user experience
- Improves search engine visibility potential
- Aligns with target audience search intent
- Includes proper heading structure and organization
${params.metaDescriptionRequired ? "- Includes optimized meta description" : ""}

## Instructions
1. Analyze the original content for SEO opportunities
2. Integrate keywords naturally throughout the content
3. Optimize headings and structure for search engines
4. Maintain content quality and readability
5. Ensure all optimizations serve both users and search engines
6. Provide only the optimized content without explanations

Generate SEO-optimized content that ranks well while providing exceptional value to users.`;
}
