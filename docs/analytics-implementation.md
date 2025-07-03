# Google Analytics Implementation Guide

This guide covers the comprehensive Google Analytics 4 (GA4) implementation using Next.js third-parties integration, including event tracking, conversion tracking, and performance monitoring.

## Table of Contents

1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [Basic Usage](#basic-usage)
4. [Event Tracking](#event-tracking)
5. [Performance Monitoring](#performance-monitoring)
6. [Components Examples](#component-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Setup

### 1. Package Installation

The implementation uses the official Next.js third-parties package:

```bash
npm install @next/third-parties
```

### 2. Google Analytics Configuration

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (starts with `G-`)
3. Add the ID to your environment variables

### 3. Root Layout Integration

The Google Analytics component is automatically included in the root layout (`app/layout.tsx`):

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <AnalyticsInitializer />
      </body>
    </html>
  );
}
```

## Environment Variables

Add the following to your `.env` file:

```env
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

> **Note**: The `NEXT_PUBLIC_` prefix is required for client-side access.

## Basic Usage

### Import Analytics Utilities

```tsx
import { analytics, trackEvent, trackCustomEvent } from "@/lib/utils/analytics";
```

### Basic Event Tracking

```tsx
// Simple event tracking
trackEvent({
  action: "button_click",
  category: "user_interaction",
  label: "header_cta",
  value: 1,
});

// Using predefined analytics functions
analytics.trackPageView("Home Page", window.location.href);
```

## Event Tracking

### Navigation Events

```tsx
// Track page views
analytics.trackPageView("Page Title", window.location.href);
```

### Blog Post Events

```tsx
// Track blog post view
analytics.trackBlogPost.view("My Blog Post Title", "Technology");

// Track social sharing
analytics.trackBlogPost.share("My Blog Post Title", "twitter");

// Track reading completion
analytics.trackBlogPost.complete("My Blog Post Title", 5); // 5 minutes reading time
```

### Contact Form Events

```tsx
// Track form interactions
analytics.trackContact.formStart();
analytics.trackContact.formSubmit();
analytics.trackContact.formComplete();
```

### Search Events

```tsx
analytics.trackSearch("search term", 10); // 10 results found
```

### Download Events

```tsx
analytics.trackDownload("whitepaper.pdf", "PDF");
```

### External Link Tracking

```tsx
analytics.trackExternalLink("https://external-site.com", "External Link Text");
```

### Email Signup Tracking

```tsx
analytics.trackEmailSignup("footer_newsletter");
```

### Error Tracking

```tsx
analytics.trackError("api_error", "Failed to fetch data", "HomePage");
```

## Performance Monitoring

### Automatic Performance Tracking

The system automatically tracks Core Web Vitals and performance metrics:

```tsx
import { initializeAnalytics } from "@/lib/utils/analytics";

// This is called automatically in the AnalyticsInitializer component
initializeAnalytics();
```

### Manual Performance Tracking

```tsx
analytics.trackPerformance("custom_operation", 150, "ms");
```

### Tracked Metrics

- **LCP (Largest Contentful Paint)**: Time to render the largest content element
- **FID (First Input Delay)**: Time from first user interaction to browser response
- **CLS (Cumulative Layout Shift)**: Visual stability of the page
- **DOM Content Loaded**: Time for HTML to be loaded and parsed
- **Load Complete**: Time for all resources to finish loading
- **Resource Loading**: Individual resource load times (for resources > 1s)

## Component Examples

### Contact Form with Analytics

```tsx
"use client";

import { useState, useEffect } from "react";
import { analytics } from "@/lib/utils/analytics";

export function ContactForm() {
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Track form start
  useEffect(() => {
    const subscription = form.watch(() => {
      if (!hasStartedForm) {
        analytics.trackContact.formStart();
        setHasStartedForm(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, hasStartedForm]);

  const onSubmit = async (data) => {
    analytics.trackContact.formSubmit();

    try {
      // Submit form...
      analytics.trackContact.formComplete();
    } catch (error) {
      analytics.trackError("contact_form_error", error.message, "ContactForm");
    }
  };

  // ... rest of component
}
```

### Blog Post with Reading Analytics

```tsx
"use client";

import { BlogPostAnalytics } from "@/components/blog/BlogPostAnalytics";

export function BlogPost({ title, category, content, estimatedReadingTime }) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{content}</div>

      <BlogPostAnalytics
        postTitle={title}
        postCategory={category}
        estimatedReadingTime={estimatedReadingTime}
      />
    </article>
  );
}
```

### External Link Tracking

```tsx
"use client";

import { analytics } from "@/lib/utils/analytics";

export function ExternalLink({ href, children }) {
  const handleClick = () => {
    analytics.trackExternalLink(href, children?.toString());
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
```

### Download Button with Tracking

```tsx
"use client";

import { analytics } from "@/lib/utils/analytics";

export function DownloadButton({ fileName, fileUrl, fileType }) {
  const handleDownload = () => {
    analytics.trackDownload(fileName, fileType);
  };

  return (
    <a
      href={fileUrl}
      download={fileName}
      onClick={handleDownload}
      className="btn btn-primary"
    >
      Download {fileName}
    </a>
  );
}
```

## Custom Events

### Creating Custom Events

```tsx
import { trackCustomEvent } from "@/lib/utils/analytics";

// Track custom business events
trackCustomEvent({
  event_name: "product_demo_request",
  product_category: "enterprise",
  user_type: "lead",
  demo_type: "virtual",
});
```

### Conversion Tracking

```tsx
import { trackConversion } from "@/lib/utils/analytics";

// Track conversions
trackConversion({
  event_name: "sign_up",
  currency: "USD",
  value: 0,
  transaction_id: "signup_12345",
});
```

## Best Practices

### 1. Event Naming Conventions

- Use lowercase with underscores: `button_click`, `form_submit`
- Be descriptive but concise: `blog_post_share` instead of `share`
- Group related events with prefixes: `contact_form_start`, `contact_form_submit`

### 2. Category Organization

- **navigation**: Page views, menu clicks
- **forms**: Form interactions, submissions
- **blog**: Blog-related events
- **social**: Social sharing, external links
- **conversion**: Key business actions
- **engagement**: User interaction depth
- **performance**: Performance metrics
- **errors**: Error tracking

### 3. Performance Considerations

- Events are only sent when GA4 is properly configured
- All tracking functions include client-side checks
- Performance monitoring uses efficient observers
- Automatic cleanup prevents memory leaks

### 4. Privacy Compliance

- Ensure your privacy policy mentions analytics
- Consider implementing consent management
- GA4 provides built-in privacy features

### 5. Testing

- Use GA4 DebugView for real-time event testing
- Test in both development and production environments
- Verify events are firing correctly using browser dev tools

## Troubleshooting

### Common Issues

1. **Events not showing in GA4**

   - Check if `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` is set correctly
   - Ensure the Measurement ID starts with `G-`
   - Verify events are firing in browser network tab

2. **TypeScript errors**

   - Ensure all required parameters are provided
   - Check import paths are correct

3. **Performance impact**
   - Analytics are loaded after hydration to minimize impact
   - Use the built-in loading strategy for optimal performance

### Debug Mode

Enable debug mode in development:

```tsx
// Add to your development environment
if (process.env.NODE_ENV === "development") {
  window.gtag?.("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
    debug_mode: true,
  });
}
```

### Testing Events

```tsx
// Test events in development
if (process.env.NODE_ENV === "development") {
  console.log("GA Event:", { action, category, label, value });
}
```

## Additional Features

### Enhanced E-commerce (Optional)

```tsx
import { trackPurchase } from "@/lib/utils/analytics";

trackPurchase({
  transaction_id: "order_12345",
  value: 99.99,
  currency: "USD",
  items: [
    {
      item_id: "product_123",
      item_name: "Premium Plan",
      category: "subscription",
      quantity: 1,
      price: 99.99,
    },
  ],
});
```

### Real User Monitoring

The system automatically tracks and reports:

- Page load performance
- User interaction delays
- Visual stability metrics
- Resource loading times

These metrics help identify performance bottlenecks and improve user experience.

## Support

For issues or questions:

1. Check the [Google Analytics 4 documentation](https://developers.google.com/analytics/devguides/collection/ga4)
2. Review the [Next.js third-parties documentation](https://nextjs.org/docs/app/guides/third-party-libraries#google-third-parties)
3. Test events using GA4 DebugView in the GA4 interface
