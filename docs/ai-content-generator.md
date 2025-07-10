# AI Content Generator Documentation

## 🤖 Overview

The AI Content Generator is a sophisticated content creation system built with AI SDK 5 Beta that provides intelligent, automated content generation for blog posts and service descriptions. It features real-time streaming, auto-save functionality, and advanced content refinement capabilities.

## 🏗️ Architecture

### Core Components

The AI system is built with a modular architecture:

```
lib/ai/
├── core/
│   ├── model-manager.ts      # AI model management and selection
│   ├── message-handler.ts    # Message handling and validation
│   └── transport.ts          # Transport layer for AI communication
├── content/
│   ├── creator.ts            # Content creation engine
│   └── refiner.ts            # Content refinement and optimization
├── prompts/
│   ├── blog-post.prompt.ts   # Blog post generation prompts
│   ├── service.prompt.ts     # Service description prompts
│   ├── content-improvement.prompt.ts # Content refinement prompts
│   ├── seo-optimization.prompt.ts   # SEO optimization prompts
│   └── readability-enhancement.prompt.ts # Readability improvement
└── index.ts                  # Main library exports
```

### Technology Stack

- **AI SDK 5 Beta** - Core AI integration with streaming support
- **Anthropic Claude 3.5 Sonnet** - Primary AI model for content generation
- **OpenAI GPT-4o** - Fallback AI model for redundancy
- **Zod** - Schema validation for type-safe content generation
- **React Streaming** - Real-time content generation UI

## 🚀 Features

### 1. Unified Content Generator

The main interface provides a streamlined experience for generating different types of content:

#### **Location**: `/admin/ai/content-generator`

#### **Supported Content Types**:

- **Blog Posts** - Complete articles with SEO optimization
- **Service Descriptions** - Comprehensive service offerings

#### **Key Capabilities**:

- Real-time streaming generation with progress indicators
- Auto-save to drafts with seamless editor integration
- Type-safe content generation using Zod schemas
- Multiple AI model support with automatic fallback

### 2. Blog Post Generation

#### **Generated Content Structure**:

```typescript
interface BlogPost {
  title: string; // SEO-optimized title (50-60 chars)
  content: string; // Full markdown content (800-2500 words)
  excerpt: string; // Compelling summary (150-200 words)
  tags: string[]; // Relevant tags (5-8 items)
  metaDescription: string; // SEO meta description (150-160 chars)
  metaTitle: string; // SEO title (50-60 chars)
  metaKeywords: string; // Comma-separated keywords
  category: string; // Suggested category
  slug: string; // URL-friendly slug
}
```

#### **Generation Parameters**:

- **Topic** - Main subject or title
- **Keywords** - Target SEO keywords (3-8 keywords)
- **Tone** - Content tone (professional, casual, technical, friendly, etc.)
- **Length** - Content length (short: 600-800, medium: 1000-1500, long: 1500-2500 words)
- **Audience** - Target audience (developers, business owners, general public, etc.)

#### **Auto-Save Process**:

1. Content generates with real-time streaming
2. Automatically saved as draft status
3. Redirects to blog post edit page
4. Auto-selects first available author and matching category
5. Pre-fills all generated metadata

### 3. Service Description Generation

#### **Generated Content Structure**:

```typescript
interface Service {
  title: string; // Service title
  shortDescription: string; // Elevator pitch (120-160 chars)
  fullDescription: string; // Detailed description (300-1200 words)
  timeline: string; // Project timeline
  category: string; // Service category
  features: string[]; // Key features list
  benefits: string[]; // Customer benefits
  deliverables: string[]; // Project deliverables
  technologies: string[]; // Technologies used
  process: ProcessStep[]; // Step-by-step process
  pricing: PricingTier[]; // Pricing information
  faq: FAQItem[]; // Frequently asked questions
  testimonials: Testimonial[]; // Customer testimonials
  targetAudience: string; // Target market
  competitiveAdvantage: string; // Unique selling proposition
  callToAction: string; // Next step for customers
  metaDescription: string; // SEO meta description
  metaTitle: string; // SEO title
  slug: string; // URL-friendly slug
}
```

#### **Generation Parameters**:

- **Service Name** - Name of the service
- **Features** - Key service features (3-10 items)
- **Benefits** - Customer benefits (3-8 items)
- **Target Audience** - Primary customer base
- **Industry** - Relevant industry or sector
- **Competitive Advantage** - What makes it unique
- **Tone** - Communication style
- **Length** - Content depth (short, medium, long)
- **Include Options** - Call-to-action, pricing tiers, process steps, FAQ, testimonials

### 4. Content Refinement Engine

The content refiner provides advanced improvement capabilities for existing content:

#### **Available Refinement Types**:

##### **Content Improvement**

- Enhance clarity and readability
- Improve sentence structure and flow
- Eliminate redundancy and tighten language
- Enhance engagement and compelling nature

##### **SEO Optimization**

- Natural keyword integration
- Meta description optimization
- Heading structure improvement
- Search engine visibility enhancement

##### **Readability Enhancement**

- Adjust reading level (elementary to professional)
- Improve paragraph structure
- Simplify complex sentences
- Enhance accessibility

#### **Content Analysis**

- Reading level assessment
- Keyword density analysis
- Improvement priority ranking
- Overall quality scoring (0-100)

## 🔧 Configuration

### Environment Variables

```env
# Required AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Model Configuration
AI_DEFAULT_MODEL=claude-3-5-sonnet-20241022
AI_FALLBACK_MODEL=gpt-4o
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7

# Feature Flags
AI_CONTENT_GENERATION_ENABLED=true
```

### Model Manager Configuration

The system automatically manages AI models with the following logic:

1. **Primary Model**: Anthropic Claude 3.5 Sonnet (if API key available)
2. **Fallback Model**: OpenAI GPT-4o (if Claude fails or unavailable)
3. **Error Handling**: Graceful degradation with user feedback
4. **Rate Limiting**: Built-in retry logic with exponential backoff

## 🎯 Prompts System

### Centralized Prompt Management

All AI prompts are stored in `lib/ai/prompts/` with a consistent structure:

#### **Prompt Structure**:

```typescript
export interface PromptParams {
  // Required parameters
  topic: string;
  keywords: string[];
  tone: ContentTone;

  // Optional parameters
  length?: "short" | "medium" | "long";
  audience?: string;
}

export function promptFunction(params: PromptParams): string {
  return `# Structured Prompt Template
  
  ## Parameters
  - **Topic**: ${params.topic}
  - **Keywords**: ${params.keywords.join(", ")}
  
  ## Instructions
  [Detailed generation instructions]
  
  ## Output Format
  [Expected output structure]`;
}
```

#### **Available Prompts**:

- `blog-post.prompt.ts` - Blog post generation
- `service.prompt.ts` - Service description generation
- `content-improvement.prompt.ts` - Content quality improvement
- `seo-optimization.prompt.ts` - SEO enhancement
- `readability-enhancement.prompt.ts` - Readability improvement

### Prompt Customization

To customize prompts for your specific needs:

1. **Edit Prompt Files**: Modify prompts in `lib/ai/prompts/`
2. **Maintain Structure**: Keep the function interface consistent
3. **Test Changes**: Verify prompt modifications work as expected
4. **Version Control**: Track prompt changes for quality control

## 📊 User Interface

### Main Generator Interface

#### **Generation Form**:

- Content type selection (tabs)
- Parameter input fields with validation
- Real-time form validation
- Smart defaults and suggestions

#### **Streaming Display**:

- Live content generation with progress bar
- Real-time content preview as it generates
- Progress indicators (40% start, 80% content ready, 100% complete)
- Error handling with user-friendly messages

#### **Auto-Save Workflow**:

- Automatic draft creation upon completion
- Success notifications with next steps
- Seamless redirect to edit pages
- Fallback to review tab if auto-save fails

### Content Review Interface

#### **Blog Post Review**:

- Complete content preview with formatting
- Metadata display (title, excerpt, tags, SEO data)
- Word count and reading time estimates
- Save options with author and category selection

#### **Service Review**:

- Comprehensive service preview
- All generated sections (features, benefits, pricing, etc.)
- Save options with featured image requirement
- Structured data validation

## 🔗 API Endpoints

### Content Generation

#### **Stream Object Generation**

```
POST /api/ai/content/stream-object
```

**Request Body**:

```json
{
  "type": "blog-post" | "service-description",
  "topic": "string",
  "keywords": ["keyword1", "keyword2"],
  "tone": "professional",
  "length": "medium",
  "audience": "developers"
}
```

**Response**: Server-Sent Events stream with partial objects

#### **Save Blog Post**

```
POST /api/ai/content/save-blog-post
```

**Request Body**:

```json
{
  "title": "Generated Title",
  "content": "Full content...",
  "excerpt": "Summary...",
  "tags": ["tag1", "tag2"],
  "metaDescription": "SEO description",
  "authorId": "author-uuid",
  "categoryId": "category-uuid",
  "status": "draft"
}
```

#### **Save Service**

```
POST /api/ai/content/save-service
```

**Request Body**:

```json
{
  "title": "Service Title",
  "shortDescription": "Brief description",
  "fullDescription": "Detailed description",
  "features": ["feature1", "feature2"],
  "benefits": ["benefit1", "benefit2"],
  "timeline": "2-4 weeks"
}
```

### Content Refinement

#### **Refine Content**

```
POST /api/ai/content/refine
```

**Request Body**:

```json
{
  "content": "Original content to improve",
  "improvements": ["clarity", "seo", "readability"],
  "tone": "professional",
  "targetAudience": "business owners"
}
```

## 🧪 Testing

### Manual Testing

1. **Access Generator**: Navigate to `/admin/ai/content-generator`
2. **Test Blog Generation**:
   - Enter topic: "AI in Web Development"
   - Keywords: ["artificial intelligence", "web development"]
   - Watch streaming generation
   - Verify auto-save to drafts
3. **Test Service Generation**:
   - Service: "Web Development Services"
   - Features: ["Custom Design", "SEO Optimization"]
   - Verify comprehensive service creation

### API Testing

```javascript
// Test blog post generation
const response = await fetch("/api/ai/content/stream-object", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "blog-post",
    topic: "Modern Web Development",
    keywords: ["react", "nextjs", "typescript"],
    tone: "technical",
  }),
});

// Test content refinement
const refineResponse = await fetch("/api/ai/content/refine", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Original content here...",
    improvements: ["clarity", "seo"],
  }),
});
```

## 🔒 Security

### Access Control

- Admin authentication required for all AI features
- Role-based access control (Admin level required)
- CSRF protection on all endpoints
- Input validation and sanitization

### API Security

- API key rotation support
- Rate limiting with graceful degradation
- Error logging without exposing sensitive data
- Secure environment variable handling

### Content Safety

- Input validation for all generation parameters
- Content filtering for inappropriate output
- Audit logging of all AI interactions
- User consent and transparency

## 🚨 Troubleshooting

### Common Issues

#### **Generation Failures**

- **Symptom**: AI generation fails or returns errors
- **Causes**: API key issues, model access, network problems
- **Solutions**:
  - Verify API keys are valid and have model access
  - Check network connectivity
  - Review rate limits and usage quotas
  - Check browser console for detailed errors

#### **Streaming Issues**

- **Symptom**: Content doesn't stream or appears all at once
- **Causes**: Browser compatibility, network issues, server problems
- **Solutions**:
  - Ensure browser supports Server-Sent Events
  - Check network configuration for streaming
  - Verify API endpoint is responding correctly

#### **Auto-Save Failures**

- **Symptom**: Generated content doesn't save automatically
- **Causes**: Database connection, permission issues, validation errors
- **Solutions**:
  - Check database connectivity
  - Verify admin permissions
  - Review server logs for save errors
  - Ensure required data (authors, categories) exists

#### **Content Quality Issues**

- **Symptom**: Generated content is poor quality or off-topic
- **Causes**: Prompt issues, model limitations, parameter problems
- **Solutions**:
  - Review and adjust prompts in `lib/ai/prompts/`
  - Fine-tune generation parameters
  - Provide more specific keywords and context
  - Try different AI models or temperature settings

### Debug Tools

#### **Console Logging**

Enable detailed logging by setting:

```env
NODE_ENV=development
```

#### **Network Inspection**

- Monitor Network tab for API calls
- Check for proper Server-Sent Events streams
- Verify response formats and status codes

#### **Database Monitoring**

- Use Drizzle Studio to inspect saved content
- Check for proper foreign key relationships
- Verify data validation and constraints

## 📈 Performance

### Optimization Strategies

#### **Streaming Performance**

- Content streams in real-time for immediate feedback
- Progressive enhancement with fallback options
- Efficient Server-Sent Events implementation
- Client-side caching of generated content

#### **Model Selection**

- Intelligent model routing based on availability
- Automatic fallback to secondary models
- Load balancing between providers
- Cost optimization through model selection

#### **Caching Strategy**

- Client-side caching of form data
- Server-side caching of prompt templates
- Database connection pooling
- Static asset optimization

## 🔮 Future Enhancements

### Planned Features

#### **Advanced Content Types**

- Landing page copy generation
- Email template creation
- Social media content
- Product descriptions

#### **Enhanced AI Capabilities**

- Image generation integration
- Multi-language content generation
- Voice-to-text content creation
- AI-powered content scheduling

#### **Workflow Improvements**

- Batch content generation
- Content calendar integration
- Collaborative editing with AI suggestions
- Version control for AI-generated content

#### **Analytics Integration**

- AI usage metrics and analytics
- Content performance tracking
- ROI measurement for AI-generated content
- A/B testing for different AI approaches

---

## 📞 Support

For AI Content Generator support:

1. **Documentation**: Review this guide and the main README
2. **GitHub Issues**: Report bugs or feature requests
3. **Community**: Join our Discord for discussions
4. **Enterprise**: Contact Monsoft Solutions for enterprise support

## 📚 Additional Resources

- [AI SDK 5 Beta Documentation](https://sdk.vercel.ai/)
- [Anthropic Claude API Guide](https://docs.anthropic.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Zod Schema Validation](https://zod.dev/)
- [Server-Sent Events Guide](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
