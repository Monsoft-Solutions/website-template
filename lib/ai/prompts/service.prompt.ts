/**
 * Service Generation Prompt
 * Generates comprehensive service descriptions with structured data
 */

export interface ServicePromptParams {
  name: string;
  features: string[];
  benefits: string[];
  targetAudience: string;
  industry?: string;
  competitiveAdvantage?: string;
  tone: string;
  length: "short" | "medium" | "long";
  includeCallToAction?: boolean;
  includePricingTiers?: boolean;
  includeProcessSteps?: boolean;
  includeFAQ?: boolean;
  includeTestimonials?: boolean;
}

export function servicePrompt(params: ServicePromptParams): string {
  const lengthGuidance = {
    short: "300-500 words for full description",
    medium: "500-800 words for full description",
    long: "800-1200 words for full description",
  };

  return `# Comprehensive Service Generation Request

## Service Information
- **Service Name**: ${params.name}
- **Target Audience**: ${params.targetAudience}
${params.industry ? `- **Industry**: ${params.industry}` : ""}

## Key Features
${params.features.map((feature) => `- ${feature}`).join("\n")}

## Key Benefits
${params.benefits.map((benefit) => `- ${benefit}`).join("\n")}

${
  params.competitiveAdvantage
    ? `## Competitive Advantage\n${params.competitiveAdvantage}\n`
    : ""
}

## Requirements
- **Tone**: ${params.tone}
- **Target length**: ${lengthGuidance[params.length]}
${params.includeCallToAction ? "- **Include a compelling call-to-action**" : ""}

## Output Requirements

Generate a comprehensive service offering with the following structured information:

### Core Service Information
1. **Title**: Compelling, SEO-friendly service title (50-60 characters)
2. **Short Description**: Concise elevator pitch (120-160 characters) suitable for cards and previews
3. **Full Description**: Detailed service description covering all aspects (${
    lengthGuidance[params.length]
  })
4. **Timeline**: Realistic project timeline (e.g., "2-4 weeks", "1-3 months")
5. **Category**: Most appropriate category from: Development, Design, Consulting, Marketing, Support
6. **Target Audience**: Refined target audience description
7. **Competitive Advantage**: What makes this service unique
${
  params.includeCallToAction
    ? "8. **Call to Action**: Compelling next step for potential clients"
    : ""
}

### Structured Lists
9. **Features**: Expanded list of 5-8 key features (build on provided features)
10. **Benefits**: Expanded list of 5-8 customer benefits (build on provided benefits)
11. **Deliverables**: 4-6 specific items/outcomes the client will receive
12. **Technologies**: 3-6 relevant technologies/tools used (if applicable)

${
  params.includeProcessSteps !== false
    ? `### Process Steps (4-6 steps)
For each step, provide:
- **Step number** (1, 2, 3, etc.)
- **Title**: Clear step name
- **Description**: What happens in this step (2-3 sentences)
- **Duration**: Time estimate for this step (optional)`
    : ""
}

${
  params.includePricingTiers !== false
    ? `### Pricing Tiers (2-3 tiers)
For each tier, provide:
- **Name**: Tier name (e.g., "Essential", "Professional", "Enterprise")
- **Price**: Price range or starting price (e.g., "$2,000 - $5,000", "Starting at $1,500")
- **Description**: What this tier includes (1-2 sentences)
- **Features**: 3-5 specific features included in this tier
- **Popular**: Mark one tier as popular/recommended (true/false)`
    : ""
}

${
  params.includeFAQ !== false
    ? `### FAQ (4-6 questions)
For each FAQ, provide:
- **Question**: Common question clients ask
- **Answer**: Clear, helpful answer (2-3 sentences)`
    : ""
}

${
  params.includeTestimonials === true
    ? `### Testimonials (1-2 testimonials)
Create realistic testimonials:
- **Quote**: Authentic-sounding client testimonial (2-3 sentences)
- **Author**: Realistic client name
- **Company**: Realistic company name appropriate for the target audience`
    : ""
}

### SEO Elements
- **Meta Description**: 150-160 character description for search engines
- **Meta Title**: 50-60 character SEO title

## Writing Guidelines
- Write in ${params.tone} tone throughout
- Focus on client value and outcomes
- Use clear, benefit-focused language
- Include specific, measurable outcomes where possible
- Make content scannable with good structure
- Address common client pain points
- Show expertise and authority
- Use industry-appropriate language for ${params.targetAudience}
- Ensure pricing is realistic for the service type and market
- Create process steps that are logical and build on each other
- Generate FAQs that address real concerns and objections
- If creating testimonials, make them authentic and specific

## Important Notes
- Keep the short description under 160 characters
- Make pricing tiers distinct and valuable
- Order process steps logically from start to finish
- FAQs should address common concerns and objections
- Technologies should be relevant and current
- Deliverables should be specific and measurable
- Process step durations should add up to the overall timeline
- All content should be optimized for the target audience

Generate the complete service offering now.`;
}
