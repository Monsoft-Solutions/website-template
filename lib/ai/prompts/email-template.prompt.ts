/**
 * Email Template Generation Prompt
 * Creates professional email templates for various purposes
 */

export interface EmailTemplatePromptParams {
  purpose: string;
  audience: string;
  tone: string;
  includeSubject: boolean;
}

export function emailTemplatePrompt(params: EmailTemplatePromptParams): string {
  return `# Email Template Generation Request

## Email Details
- **Purpose**: ${params.purpose}
- **Target Audience**: ${params.audience}
- **Tone**: ${params.tone}
- **Include Subject Line**: ${params.includeSubject ? "Yes" : "No"}

## Email Requirements

### 1. Email Structure
${
  params.includeSubject
    ? `
#### Subject Line
- Create a compelling subject line that:
  - Clearly indicates the email purpose
  - Encourages opening (avoid spam triggers)
  - Keeps under 50 characters for mobile optimization
  - Uses action-oriented language when appropriate
`
    : ""
}

#### Email Body
- **Clear Opening**: Immediately establish purpose and context
- **Structured Content**: Use logical flow and clear sections
- **Professional Formatting**: Proper paragraphs and spacing
- **Mobile-Friendly**: Keep content concise and scannable

### 2. Audience Considerations
- **Language Level**: Appropriate for ${params.audience}
- **Personalization**: Include personalization placeholders where relevant
- **Context Awareness**: Consider recipient's likely situation and needs
- **Relationship Building**: Maintain appropriate professional relationships

### 3. Tone Guidelines
- **Consistency**: Maintain ${params.tone} tone throughout
- **Appropriateness**: Match tone to purpose and audience
- **Professionalism**: Balance friendliness with business appropriateness
- **Clarity**: Use clear, direct communication

### 4. Content Elements
- **Value Proposition**: Clearly communicate what's in it for them
- **Key Information**: Include all necessary details
- **Next Steps**: Make clear what action is expected
- **Contact Information**: Provide relevant contact details

### 5. Call-to-Action
- **Clear Direction**: Specific action requested
- **Easy to Follow**: Simple, straightforward instructions
- **Urgency**: Appropriate time sensitivity if relevant
- **Multiple Options**: Provide alternatives when applicable

### 6. Email Best Practices
- **Scannable Format**: Use bullet points, short paragraphs
- **Professional Signature**: Include appropriate sign-off
- **Legal Compliance**: Follow email marketing regulations
- **Accessibility**: Ensure content is accessible to all readers

### 7. Personalization Placeholders
Include relevant placeholders such as:
- {{firstName}} or {{name}}
- {{company}}
- {{specificDetails}}
- {{customField}}

## Output Format
${
  params.includeSubject
    ? `
**Subject Line**: [Compelling subject line]

**Email Body**: [Complete email content]
`
    : "**Email Body**: [Complete email content]"
}

## Output Requirements
Create an email template that:
- Serves the specified purpose effectively
- Resonates with the target audience
- Maintains professional standards
- Encourages the desired response
- Can be easily customized with specific details
- Follows email marketing best practices

Generate a professional, effective email template that achieves its communication goal while maintaining appropriate tone and style.`;
}
