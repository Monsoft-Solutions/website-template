# Contact Form Email Setup Guide

This guide explains how to configure the contact form email functionality that sends confirmation emails to users and notification emails to admins.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Required for email functionality
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Optional email configuration
RESEND_FROM_NAME="Your Company Name"
RESEND_REPLY_TO="support@yourdomain.com"
COMPANY_NAME="Your Company Name"
SUPPORT_EMAIL="support@yourdomain.com"

# Contact form specific configuration
CONTACT_FORM_ADMIN_EMAILS="admin1@yourdomain.com,admin2@yourdomain.com"
CONTACT_FORM_NOTIFY_ADMIN="true"
CONTACT_FORM_AUTO_REPLY="true"
```

## How It Works

When a user submits a contact form:

1. **Form Validation**: The submission is validated and saved to the database
2. **User Confirmation**: A confirmation email is sent to the user acknowledging their submission
3. **Admin Notification**: A notification email is sent to the configured admin email(s)
4. **Response**: The user receives a success message

## Email Templates

### User Confirmation Email

- **Subject**: "We've received your message - Thank you!"
- **Content**: Professional confirmation with message details
- **Features**:
  - Personalized greeting
  - Message summary
  - Response time expectation
  - Company branding

### Admin Notification Email

- **Subject**: "New Contact Form Submission"
- **Content**: Complete submission details for admin review
- **Features**:
  - Sender information
  - Full message content
  - Submission metadata (IP, user agent, timestamp)
  - Direct reply capability

## Configuration Options

### Admin Email Recipients

You can configure multiple admin emails to receive notifications:

```bash
# Single admin email
CONTACT_FORM_ADMIN_EMAILS="admin@yourdomain.com"

# Multiple admin emails (comma-separated)
CONTACT_FORM_ADMIN_EMAILS="admin1@yourdomain.com,admin2@yourdomain.com,support@yourdomain.com"
```

If not configured, notifications will be sent to the `SUPPORT_EMAIL`.

### Email Features

```bash
# Disable admin notifications
CONTACT_FORM_NOTIFY_ADMIN="false"

# Disable user confirmation emails
CONTACT_FORM_AUTO_REPLY="false"

# Customize response time expectation
EMAIL_RESPONSE_TIME="24 hours"  # Default: "24 hours"
```

## Testing

### Development Mode

In development, emails are logged to the console and can be tested with:

```bash
# Enable email logging
LOG_EMAILS="true"

# Test with a specific recipient
TEST_EMAIL_RECIPIENT="test@example.com"

# Enable mock mode (no actual emails sent)
EMAIL_MOCK_MODE="true"
```

### Production Setup

1. **Verify your domain** in the Resend dashboard
2. **Set up SPF/DKIM** records for better deliverability
3. **Monitor email delivery** through the Resend dashboard
4. **Configure rate limiting** if needed

## Error Handling

The system handles email failures gracefully:

- Email sending happens **asynchronously** to avoid blocking the form submission
- Failed emails are **logged** but don't affect the user experience
- The form submission is **always saved** to the database regardless of email status
- Users receive a success message even if emails fail

## Security Features

- **Rate limiting**: Prevents spam submissions
- **Spam detection**: Basic content filtering
- **IP tracking**: Logs submission IP addresses
- **Input validation**: Comprehensive form validation

## Troubleshooting

### Emails Not Sending

1. Check your Resend API key is valid
2. Verify the `RESEND_FROM_EMAIL` is authorized in your Resend account
3. Check the console logs for error messages
4. Ensure your domain is verified (for production)

### Missing Admin Notifications

1. Verify `CONTACT_FORM_ADMIN_EMAILS` is set correctly
2. Check that `CONTACT_FORM_NOTIFY_ADMIN` is not set to "false"
3. Check spam folders
4. Review Resend dashboard for delivery status

### Styling Issues

The email templates use inline CSS for maximum compatibility. To customize:

1. Edit templates in `lib/email/templates/`
2. Update configuration in `lib/config/email.config.ts`
3. Test across different email clients

## Support

For issues with the email functionality, check:

1. **Resend Dashboard**: For delivery status and logs
2. **Application Logs**: For detailed error messages
3. **Email Templates**: For rendering issues
4. **Configuration**: For setup problems
