# Email Service Documentation

## Overview

This email service provides a complete solution for sending transactional emails using Resend API. It includes beautiful email templates, type-safe configurations, and robust error handling.

## Features

- ✅ **Resend Integration**: Modern email API with excellent deliverability
- ✅ **Type Safety**: Full TypeScript support with comprehensive type definitions
- ✅ **Beautiful Templates**: Responsive HTML email templates using React Email
- ✅ **Error Handling**: Robust error handling with retry logic
- ✅ **Rate Limiting**: Built-in rate limiting to prevent abuse
- ✅ **Development Mode**: Mock mode and test recipient override
- ✅ **Multiple Email Types**: Support for various email templates
- ✅ **API Routes**: RESTful API endpoints for email sending

## Quick Start

### 1. Environment Setup

Copy the required environment variables from `env.example`:

```bash
# Required
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Optional
RESEND_FROM_NAME="Your Company"
RESEND_REPLY_TO="support@yourdomain.com"
```

### 2. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Add it to your `.env` file

### 3. Domain Verification (Production)

For production use, you'll need to verify your domain:

1. Go to the Domains section in Resend dashboard
2. Add your domain
3. Update DNS records as instructed
4. Wait for verification

## Usage Examples

### Using the Email Service

```typescript
import { emailService } from "@/lib/services/email.service";

// Send contact form notification
const result = await emailService.sendTemplatedEmail(
  "contact-form-notification",
  {
    senderName: "John Doe",
    senderEmail: "john@example.com",
    subject: "Project Inquiry",
    message: "I'd like to discuss a project with you.",
    submittedAt: new Date().toISOString(),
    companyName: "Site Wave",
    supportEmail: "support@monsoftlabs.com",
    siteUrl: "https://sitewave.com",
  },
  {
    to: "admin@yourdomain.com",
  }
);

// Send user invitation
const invitationResult = await emailService.sendTemplatedEmail(
  "user-invitation",
  {
    recipientName: "Jane Smith",
    inviterName: "Admin User",
    inviterEmail: "admin@yourdomain.com",
    invitationUrl: "https://yourdomain.com/accept-invite?token=abc123",
    role: "Editor",
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    companyName: "Site Wave",
    supportEmail: "support@monsoftlabs.com",
    siteUrl: "https://sitewave.com",
  },
  {
    to: "jane@example.com",
  }
);

// Send notification
const notificationResult = await emailService.sendTemplatedEmail(
  "notification",
  {
    title: "Welcome to our platform!",
    message: "Thank you for signing up. We're excited to have you on board.",
    severity: "success",
    timestamp: new Date().toISOString(),
    companyName: "Site Wave",
    supportEmail: "support@monsoftlabs.com",
    siteUrl: "https://sitewave.com",
  },
  {
    to: "user@example.com",
    subject: "Welcome!",
  }
);
```

### Using the API Routes

```typescript
// Send contact form notification via API
const response = await fetch("/api/email/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "contact-form",
    recipients: ["admin@yourcompany.com"],
    data: {
      senderName: "John Doe",
      senderEmail: "john@example.com",
      subject: "Website Inquiry",
      message: "I am interested in your services...",
      submittedAt: new Date().toISOString(),
      companyName: "Your Company",
      supportEmail: "support@yourcompany.com",
      siteUrl: "https://yourcompany.com",
    },
  }),
});
```

## Configuration

### Environment Variables

| Variable               | Description                   | Default     |
| ---------------------- | ----------------------------- | ----------- |
| `RESEND_API_KEY`       | Resend API key (required)     | -           |
| `RESEND_FROM_EMAIL`    | From email address (required) | -           |
| `RESEND_FROM_NAME`     | From name                     | "Site Wave" |
| `RESEND_REPLY_TO`      | Reply-to email                | -           |
| `EMAIL_MAX_RETRIES`    | Max retry attempts            | 3           |
| `EMAIL_RETRY_DELAY`    | Retry delay in ms             | 1000        |
| `EMAIL_TIMEOUT`        | Request timeout in ms         | 30000       |
| `EMAIL_MOCK_MODE`      | Enable mock mode              | false       |
| `TEST_EMAIL_RECIPIENT` | Test recipient override       | -           |
| `LOG_EMAILS`           | Log email operations          | true        |

## Best Practices

1. **Domain Verification**: Always verify your domain for production use
2. **Error Handling**: Always check the response for errors
3. **Rate Limiting**: Respect rate limits to avoid service disruption
4. **Template Testing**: Test templates across different email clients
5. **Content Guidelines**: Follow email content best practices
6. **Security**: Validate all input data before sending emails
7. **Monitoring**: Monitor email delivery rates and errors
