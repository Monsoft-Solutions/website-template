/**
 * Marketing Copy Generation Prompt
 * Creates compelling marketing copy for various formats and purposes
 */

export interface MarketingCopyPromptParams {
  productOrService: string;
  copyType: "headline" | "social-post" | "ad-copy" | "landing-page";
  targetAudience: string;
  tone: string;
  keyBenefits: string[];
}

export function marketingCopyPrompt(params: MarketingCopyPromptParams): string {
  const copyTypeGuidance = {
    headline: {
      description: "Create 3-5 compelling headlines",
      requirements: "10-60 characters each, highly clickable and engaging",
      format: "Multiple headline options with A/B testing potential",
    },
    "social-post": {
      description: "Create social media post content",
      requirements: "150-280 characters, platform-optimized",
      format: "Ready-to-post social media content with hashtags",
    },
    "ad-copy": {
      description: "Create advertisement copy",
      requirements: "Headline + description, conversion-focused",
      format: "Headline (30 chars) + Description (90 chars) + CTA",
    },
    "landing-page": {
      description: "Create landing page copy",
      requirements: "Headline, subheading, and body text",
      format: "Complete landing page copy structure",
    },
  };

  const guidance = copyTypeGuidance[params.copyType];

  return `# Marketing Copy Generation Request

## Campaign Details
- **Product/Service**: ${params.productOrService}
- **Copy Type**: ${params.copyType}
- **Target Audience**: ${params.targetAudience}
- **Tone**: ${params.tone}
${
  params.keyBenefits.length > 0
    ? `- **Key Benefits**: ${params.keyBenefits.join(", ")}`
    : ""
}

## Copy Type Specifications
- **Objective**: ${guidance.description}
- **Requirements**: ${guidance.requirements}
- **Format**: ${guidance.format}

## Marketing Copy Guidelines

### 1. Attention-Grabbing Opening
- **Hook Immediately**: Capture attention within first few words
- **Relevance**: Speak directly to target audience's interests
- **Curiosity**: Create intrigue that compels further reading
- **Value Proposition**: Lead with the biggest benefit

### 2. Audience-Centric Messaging
- **Pain Point Focus**: Address specific challenges of ${params.targetAudience}
- **Language Match**: Use terminology and tone that resonates
- **Emotional Connection**: Tap into emotions that drive decisions
- **Benefit Translation**: Show how features solve their problems

### 3. Persuasive Elements
- **Social Proof**: Include credibility indicators
- **Urgency**: Create appropriate time sensitivity
- **Scarcity**: Highlight limited availability when relevant
- **Authority**: Establish expertise and trustworthiness

### 4. Clear Value Communication
- **Unique Selling Proposition**: Highlight what makes you different
- **Benefit Stacking**: Layer multiple benefits effectively
- **Outcome Focus**: Emphasize results and transformations
- **Proof Points**: Include specific metrics and evidence

### 5. Conversion Optimization
- **Clear Call-to-Action**: Make next step obvious and compelling
- **Risk Reversal**: Address concerns and objections
- **Easy Decision**: Remove friction from the buying process
- **Multiple Touchpoints**: Provide various ways to engage

### 6. Format-Specific Requirements

${
  params.copyType === "headline"
    ? `
#### Headlines
- Create 3-5 different headline options
- Each should be 10-60 characters
- Test different angles (benefit, curiosity, urgency)
- Include primary keyword naturally
- Make each headline distinctly different
`
    : ""
}

${
  params.copyType === "social-post"
    ? `
#### Social Media Post
- Keep within 150-280 characters
- Include relevant hashtags (3-5 max)
- Use platform-appropriate language
- Include clear call-to-action
- Make it shareable and engaging
`
    : ""
}

${
  params.copyType === "ad-copy"
    ? `
#### Advertisement Copy
- **Headline**: 30 characters max, attention-grabbing
- **Description**: 90 characters max, benefit-focused
- **Call-to-Action**: Clear, action-oriented button text
- Ensure all elements work together cohesively
`
    : ""
}

${
  params.copyType === "landing-page"
    ? `
#### Landing Page Copy
- **Headline**: Primary value proposition (50-60 chars)
- **Subheading**: Supporting detail and context (100-150 chars)
- **Body Text**: Detailed benefits and social proof (200-400 words)
- **Multiple CTAs**: Primary and secondary actions
- **Trust Signals**: Credibility markers throughout
`
    : ""
}

## Tone and Style
- **Consistency**: Maintain ${params.tone} tone throughout
- **Brand Voice**: Professional yet approachable
- **Emotional Triggers**: Use psychology-based persuasion
- **Action-Oriented**: Use active voice and compelling verbs

## Output Requirements
Create marketing copy that:
- Immediately captures attention
- Speaks directly to the target audience
- Clearly communicates unique value
- Addresses objections and concerns
- Motivates immediate action
- Optimizes for conversions
- Maintains brand consistency

Generate compelling, conversion-focused marketing copy that drives results and resonates with the target audience.`;
}
