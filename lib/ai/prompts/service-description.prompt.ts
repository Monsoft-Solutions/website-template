/**
 * Service Description Generation Prompt
 * Creates compelling service descriptions that convert
 */

export interface ServiceDescriptionPromptParams {
  name: string;
  features: string[];
  benefits: string[];
  targetAudience: string;
  industry?: string;
  competitiveAdvantage?: string;
  tone: string;
  length: "short" | "medium" | "long";
  includeCallToAction?: boolean;
}

export function serviceDescriptionPrompt(
  params: ServiceDescriptionPromptParams
): string {
  const lengthGuidance = {
    short: "200-400 words",
    medium: "400-600 words",
    long: "600-1000 words",
  };

  return `# Service Description Generation Request

## Service Details
- **Service Name**: ${params.name}
- **Features**: ${params.features.join(", ")}
- **Benefits**: ${params.benefits.join(", ")}
- **Target Audience**: ${params.targetAudience}
${params.industry ? `- **Industry**: ${params.industry}` : ""}
${
  params.competitiveAdvantage
    ? `- **Competitive Advantage**: ${params.competitiveAdvantage}`
    : ""
}

## Content Requirements
- **Tone**: ${params.tone}
- **Length**: ${lengthGuidance[params.length]}
- **Focus**: Benefits over features
- **Goal**: Convert potential customers
${params.includeCallToAction ? "- **Include**: Compelling call-to-action" : ""}

## Writing Guidelines

### 1. Lead with Value
- Start with the primary benefit or outcome
- Address the main pain point your service solves
- Use emotional hooks that resonate with your target audience

### 2. Benefits-First Approach
- Transform features into benefits
- Explain "what's in it for them"
- Use concrete, measurable outcomes when possible

### 3. Address Pain Points
- Identify specific challenges your audience faces
- Position your service as the solution
- Use empathetic language that shows understanding

### 4. Build Credibility
- Include specific details and metrics
- Mention relevant experience or expertise
- Use authoritative language without being overly technical

### 5. Social Proof Integration
- Reference typical results or outcomes
- Mention industry recognition if applicable
- Use testimonial-style language patterns

### 6. Competitive Differentiation
- Highlight unique value propositions
- Explain why you're different/better
- Focus on exclusive benefits or approaches

### 7. Persuasive Language
- Use action-oriented verbs
- Create urgency where appropriate
- Include emotional triggers that motivate action

${
  params.includeCallToAction
    ? `
### 8. Call-to-Action
- End with a clear, compelling CTA
- Make the next step obvious and easy
- Use urgency or value-add language to encourage immediate action
`
    : ""
}

## Output Requirements
Create a service description that:
- Immediately captures attention
- Clearly communicates value
- Addresses customer pain points
- Persuades prospects to take action
- Maintains the specified tone throughout
- Stays within the target length range

Generate compelling copy that will convince potential customers to choose this service over alternatives.`;
}
