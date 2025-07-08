/**
 * Readability Enhancement Prompt
 * Improves content readability and accessibility
 */

export interface ReadabilityEnhancementPromptParams {
  originalContent: string;
  targetReadingLevel?:
    | "elementary"
    | "middle-school"
    | "high-school"
    | "college"
    | "professional";
  targetAudience?: string;
  specificImprovements?: string[];
  maintainTechnicalTerms?: boolean;
  includeReadabilityScore?: boolean;
}

export function readabilityEnhancementPrompt(
  params: ReadabilityEnhancementPromptParams
): string {
  const readingLevelGuidance = {
    elementary: "5th-6th grade level (simple sentences, basic vocabulary)",
    "middle-school":
      "7th-8th grade level (moderate complexity, accessible language)",
    "high-school":
      "9th-12th grade level (varied sentence structure, appropriate vocabulary)",
    college: "College level (complex ideas, sophisticated vocabulary)",
    professional:
      "Professional level (industry terminology, advanced concepts)",
  };

  const targetLevel = params.targetReadingLevel || "high-school";

  return `# Readability Enhancement Request

## Original Content
${params.originalContent}

## Enhancement Requirements
- **Target Reading Level**: ${targetLevel} - ${
    readingLevelGuidance[targetLevel]
  }
${
  params.targetAudience ? `- **Target Audience**: ${params.targetAudience}` : ""
}
${
  params.maintainTechnicalTerms
    ? "- **Technical Terms**: Maintain necessary technical terminology but explain when needed"
    : ""
}
${
  params.includeReadabilityScore
    ? "- **Readability Score**: Provide estimated Flesch-Kincaid grade level"
    : ""
}

${
  params.specificImprovements?.length
    ? `## Specific Improvements Requested
${params.specificImprovements
  .map((improvement) => `- ${improvement}`)
  .join("\n")}`
    : ""
}

## Readability Enhancement Guidelines

### 1. Sentence Structure Optimization
- **Sentence Length**: Vary sentence length, average 15-20 words
- **Complex Sentences**: Break down overly complex sentences
- **Active Voice**: Convert passive voice to active where appropriate
- **Parallel Structure**: Ensure consistent grammatical structure in lists
- **Sentence Variety**: Mix simple, compound, and complex sentences

### 2. Word Choice and Vocabulary
- **Simple Language**: Use simpler alternatives for complex words when possible
- **Concrete Words**: Replace abstract terms with concrete, specific language
- **Familiar Terms**: Use words your audience commonly understands
- **Jargon Reduction**: Minimize or explain technical jargon
- **Transition Words**: Add clear transitions between ideas

### 3. Paragraph and Text Structure
- **Paragraph Length**: Keep paragraphs to 3-4 sentences maximum
- **Topic Sentences**: Start paragraphs with clear topic sentences
- **Logical Flow**: Ensure smooth progression of ideas
- **White Space**: Use paragraph breaks for visual breathing room
- **Headings and Subheadings**: Add clear section breaks

### 4. Content Organization
- **Introduction**: Clear, engaging opening that sets expectations
- **Main Points**: Organize content with clear main ideas
- **Supporting Details**: Provide relevant examples and explanations
- **Conclusion**: Summarize key takeaways clearly
- **Logical Order**: Present information in logical sequence

### 5. Visual and Formatting Elements
- **Bullet Points**: Use lists for multiple items or steps
- **Numbered Lists**: Use for processes or sequential information
- **Bold and Italics**: Emphasize key points strategically
- **Short Paragraphs**: Break up text walls for easier reading
- **Consistent Formatting**: Maintain uniform style throughout

### 6. Clarity and Comprehension
- **Clear Explanations**: Explain complex concepts simply
- **Examples**: Add relevant examples to illustrate points
- **Definitions**: Define technical terms when first introduced
- **Context**: Provide necessary background information
- **Logical Connections**: Make relationships between ideas explicit

### 7. Engagement and Flow
- **Conversational Tone**: Use appropriate conversational elements
- **Reader Address**: Occasionally address the reader directly
- **Questions**: Use rhetorical questions to engage readers
- **Storytelling**: Include brief stories or anecdotes when relevant
- **Smooth Transitions**: Connect paragraphs and sections seamlessly

## Target Reading Level Specifications

### ${
    targetLevel.charAt(0).toUpperCase() + targetLevel.slice(1)
  } Level Requirements:
${
  targetLevel === "elementary"
    ? `
- **Vocabulary**: Use common, everyday words
- **Sentences**: Keep sentences under 15 words
- **Concepts**: Explain all concepts simply
- **Examples**: Use familiar, relatable examples
`
    : ""
}

${
  targetLevel === "middle-school"
    ? `
- **Vocabulary**: Mix simple and moderate vocabulary
- **Sentences**: Average 12-18 words per sentence
- **Concepts**: Introduce concepts with clear explanations
- **Examples**: Use age-appropriate examples
`
    : ""
}

${
  targetLevel === "high-school"
    ? `
- **Vocabulary**: Use appropriate academic vocabulary
- **Sentences**: Vary between 10-25 words
- **Concepts**: Present concepts with supporting details
- **Examples**: Include relevant, meaningful examples
`
    : ""
}

${
  targetLevel === "college"
    ? `
- **Vocabulary**: Use sophisticated but accessible vocabulary
- **Sentences**: Allow for complex sentence structures
- **Concepts**: Present nuanced ideas with thorough explanation
- **Examples**: Use academic or professional examples
`
    : ""
}

${
  targetLevel === "professional"
    ? `
- **Vocabulary**: Include industry-specific terminology
- **Sentences**: Use varied, professional sentence structures
- **Concepts**: Present complex ideas with appropriate detail
- **Examples**: Use industry-relevant case studies
`
    : ""
}

## Quality Assurance Checklist
- [ ] Sentences are appropriately varied in length
- [ ] Vocabulary matches target reading level
- [ ] Paragraphs are well-structured and focused
- [ ] Ideas flow logically from one to the next
- [ ] Technical terms are explained when necessary
- [ ] Content is engaging and maintains reader interest
- [ ] Formatting enhances readability

## Output Requirements
Provide enhanced content that:
- Achieves the target reading level
- Maintains original meaning and key information
- Improves overall readability and comprehension
- Engages the target audience effectively
- Uses clear, accessible language
- Follows proper formatting for easy scanning
${
  params.maintainTechnicalTerms
    ? "- Preserves necessary technical terminology with explanations"
    : ""
}

## Instructions
1. Analyze the original content for readability barriers
2. Apply systematic improvements based on target reading level
3. Maintain the core message and valuable information
4. Test readability improvements throughout the content
5. Ensure all changes enhance rather than compromise meaning
6. Provide only the enhanced content without explanations

Generate content that is significantly more readable while preserving all essential information and value.`;
}
