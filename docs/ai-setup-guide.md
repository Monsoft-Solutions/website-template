# AI Content Generator Setup Guide

## 🚀 Quick Setup

This guide will help you set up the AI Content Generator feature in under 10 minutes.

## 📋 Prerequisites

- SiteWave website template already installed
- Admin account created and working
- PostgreSQL database running

## 🔑 Step 1: Get AI API Keys

### Anthropic Claude API Key (Recommended)

1. **Sign up** at [Anthropic Console](https://console.anthropic.com/)
2. **Create API Key**:
   - Go to "API Keys" section
   - Click "Create Key"
   - Copy your API key (starts with `sk-ant-`)
3. **Verify Access**: Ensure you have access to Claude 3.5 Sonnet model

### OpenAI API Key (Fallback)

1. **Sign up** at [OpenAI Platform](https://platform.openai.com/)
2. **Create API Key**:
   - Go to "API Keys" section
   - Click "Create new secret key"
   - Copy your API key (starts with `sk-`)
3. **Verify Access**: Ensure you have access to GPT-4o model

## ⚙️ Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
# AI Configuration (Required for AI features)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# AI Model Configuration (Optional - these are defaults)
AI_DEFAULT_MODEL=claude-3-5-sonnet-20241022
AI_FALLBACK_MODEL=gpt-4o
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7

# Feature Toggle (Optional - defaults to true)
AI_CONTENT_GENERATION_ENABLED=true
```

### Environment Variable Notes:

- **At least one API key required**: Either Anthropic or OpenAI
- **Both keys recommended**: For redundancy and fallback support
- **Model names**: Use exact model identifiers from providers
- **Temperature**: 0.0 = deterministic, 1.0 = creative (0.7 recommended)

## 🔄 Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## ✅ Step 4: Test AI Features

### Access AI Generator

1. **Login to Admin**: Go to `/admin` and sign in
2. **Navigate to AI Generator**: Click "AI Content Generator" in sidebar
3. **Verify Interface**: You should see the content generation form

### Test Blog Post Generation

1. **Select Blog Post Tab**
2. **Fill Required Fields**:
   - Topic: "Getting Started with AI"
   - Keywords: ["artificial intelligence", "tutorial", "beginners"]
   - Tone: "friendly"
3. **Click Generate**: Watch real-time content generation
4. **Verify Auto-Save**: Should redirect to blog edit page

### Test Service Generation

1. **Select Service Description Tab**
2. **Fill Required Fields**:
   - Service Name: "AI Consulting"
   - Features: ["Custom AI solutions", "Expert guidance"]
   - Benefits: ["Increased efficiency", "Competitive advantage"]
   - Target Audience: "Small businesses"
3. **Click Generate**: Watch comprehensive service creation
4. **Verify Auto-Save**: Should redirect to service edit page

## 🚨 Troubleshooting

### Common Setup Issues

#### **"AI Generation Failed" Error**

```
Check: API keys are valid and copied correctly
Check: Models have access (Claude 3.5 Sonnet, GPT-4o)
Check: Network connectivity and firewall settings
```

#### **"Streaming Not Working"**

```
Check: Browser supports Server-Sent Events (modern browsers)
Check: Ad blockers or browser extensions blocking requests
Check: Network proxy settings
```

#### **"Auto-Save Failed"**

```
Check: Database connection is working
Check: Admin user has proper permissions
Check: Authors and categories exist in database
```

#### **"Environment Variables Not Working"**

```
Check: .env file is in project root
Check: Variable names are exactly as specified
Check: No extra spaces or quotes around values
Check: Server was restarted after adding variables
```

### Quick Verification Commands

```bash
# Check if AI service is responding
curl -X POST http://localhost:3000/api/ai/content/stream-object \
  -H "Content-Type: application/json" \
  -d '{"type":"blog-post","topic":"test"}'

# Check environment variables (in Node.js console)
console.log(process.env.ANTHROPIC_API_KEY ? 'Anthropic key set' : 'Anthropic key missing');
console.log(process.env.OPENAI_API_KEY ? 'OpenAI key set' : 'OpenAI key missing');
```

## 📊 Performance Tips

### Optimize Generation Speed

1. **Use Anthropic Claude**: Generally faster than OpenAI for content generation
2. **Adjust Token Limits**: Reduce `AI_MAX_TOKENS` for faster generation
3. **Choose Appropriate Length**: Use "short" for faster generation
4. **Cache Generated Content**: Browser automatically caches for re-editing

### Cost Optimization

1. **Monitor Usage**: Track API usage in provider dashboards
2. **Use Appropriate Models**: Claude 3.5 Sonnet is cost-effective for content
3. **Set Token Limits**: Prevents unexpectedly large generations
4. **Cache Prompts**: System already caches prompt templates

## 🔒 Security Best Practices

### API Key Security

1. **Never commit API keys**: Ensure `.env` is in `.gitignore`
2. **Use environment variables**: Never hardcode keys in source code
3. **Rotate keys regularly**: Change API keys periodically
4. **Monitor usage**: Watch for unusual API usage patterns

### Content Safety

1. **Review generated content**: Always review before publishing
2. **Set content guidelines**: Train team on appropriate use
3. **Monitor outputs**: Check for inappropriate or off-brand content
4. **Audit AI usage**: Track who generates what content

## 📈 Next Steps

### Explore Advanced Features

1. **Content Refinement**: Try improving existing content with AI
2. **Custom Prompts**: Modify prompts in `lib/ai/prompts/` for your needs
3. **Bulk Generation**: Generate multiple pieces of content
4. **SEO Optimization**: Use AI to optimize existing content for search

### Integration Options

1. **Workflow Integration**: Integrate with your content approval process
2. **Custom Models**: Add support for additional AI models
3. **Content Calendar**: Plan AI-generated content in advance
4. **Performance Tracking**: Monitor AI content performance vs manual content

## 📚 Additional Resources

- [Complete AI Documentation](ai-content-generator.md)
- [AI SDK 5 Beta Guide](https://sdk.vercel.ai/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [OpenAI API Reference](https://platform.openai.com/docs)

## 🆘 Support

If you encounter issues during setup:

1. **Check Documentation**: Review the complete AI guide
2. **GitHub Issues**: Search existing issues or create new one
3. **Community Support**: Join our Discord community
4. **Enterprise Support**: Contact Monsoft Solutions for paid support

---

**Setup Complete!** 🎉 You're now ready to create amazing content with AI assistance.
