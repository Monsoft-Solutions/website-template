# Environment Configuration - Client-Side Setup

## Overview

This project now uses separate environment configurations for client-side and server-side code to ensure proper handling of environment variables in Next.js applications.

## Problem Solved

Previously, client-side code was importing server-side environment variables, which caused issues because:

- Server-side environment variables are not available in the browser
- Client-side code needs variables prefixed with `NEXT_PUBLIC_` to be accessible
- Mixed usage led to runtime errors and security concerns

## New Architecture

### 1. Server-Side Environment (`lib/env.ts`)

- Handles server-only environment variables
- Includes database URLs, API secrets, and other sensitive data
- Used in API routes, server components, and middleware

### 2. Client-Side Environment (`lib/env-client.ts`)

- Handles client-safe environment variables (prefixed with `NEXT_PUBLIC_`)
- Includes site URLs, public configuration, and analytics IDs
- Used in React components, hooks, and client-side utilities

## Environment Variables Setup

### Required Client-Side Variables

Add these to your `.env` file:

```env
# Required for client-side
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"

# Optional for client-side
NEXT_PUBLIC_SITE_NAME="Your Site Name"
NEXT_PUBLIC_SITE_DESCRIPTION="Your site description"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-code"
NEXT_PUBLIC_YANDEX_VERIFICATION="your-verification-code"
NEXT_PUBLIC_BING_VERIFICATION="your-verification-code"
```

### Server-Side Variables

Keep these for server-side usage:

```env
# Server-side only
DATABASE_URL="postgresql://user:password@localhost:5432/db"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Usage

### Client-Side Code (React Components, Hooks)

```typescript
import {
  clientEnv,
  getClientBaseUrl,
  getClientAuthUrl,
} from "@/lib/env-client";

// Use client environment variables
const siteUrl = clientEnv.NEXT_PUBLIC_SITE_URL;
const analyticsId = clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// Helper functions
const baseUrl = getClientBaseUrl();
const authUrl = getClientAuthUrl();
```

### Server-Side Code (API Routes, Server Components)

```typescript
import { env } from "@/lib/env";

// Use server environment variables
const databaseUrl = env.DATABASE_URL;
const authSecret = env.BETTER_AUTH_SECRET;
```

## Files Updated

### Client-Side Files

- `lib/env-client.ts` - New client-side environment configuration
- `lib/auth/client.ts` - Better Auth client configuration
- `lib/config/site.ts` - Site configuration
- `lib/utils/analytics.ts` - Analytics utilities
- `lib/utils/url.util.ts` - URL utilities
- `lib/hooks/use-services.hook.ts` - Service hooks
- `app/layout.tsx` - Root layout
- `app/services/[slug]/page.tsx` - Service pages
- `app/blog/page.tsx` - Blog pages
- `app/blog/tag/[tag]/page.tsx` - Blog tag pages
- `app/blog/category/[category]/page.tsx` - Blog category pages

### Server-Side Files (No Changes)

- `lib/env.ts` - Server-side environment configuration
- `lib/auth/auth.ts` - Better Auth server configuration
- API routes continue to use server-side environment variables

## Client-Side Environment Schema

The `lib/env-client.ts` file includes TypeScript validation for:

```typescript
type ClientEnvSchema = {
  // Site Configuration
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_SITE_NAME?: string;
  NEXT_PUBLIC_SITE_DESCRIPTION?: string;

  // Authentication
  NEXT_PUBLIC_BETTER_AUTH_URL?: string;

  // Analytics
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;

  // Site Verification
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  NEXT_PUBLIC_YANDEX_VERIFICATION?: string;
  NEXT_PUBLIC_BING_VERIFICATION?: string;

  // Application Environment
  NODE_ENV: "development" | "production" | "test";
};
```

## Helper Functions

### `getClientBaseUrl()`

Returns the base URL for client-side usage:

```typescript
const baseUrl = getClientBaseUrl();
// Returns: "http://localhost:3000" or your NEXT_PUBLIC_SITE_URL
```

### `getClientAuthUrl()`

Returns the authentication URL for client-side usage:

```typescript
const authUrl = getClientAuthUrl();
// Returns: NEXT_PUBLIC_BETTER_AUTH_URL or falls back to NEXT_PUBLIC_SITE_URL
```

### Environment Checks

```typescript
import { isDevelopment, isProduction, isTest } from "@/lib/env-client";

if (isDevelopment) {
  console.log("Development mode");
}
```

## Security Considerations

1. **Never expose sensitive data**: Only use `NEXT_PUBLIC_` prefix for non-sensitive information
2. **Client-side variables are public**: They're included in the JavaScript bundle sent to browsers
3. **Server-side variables remain private**: They're only accessible on the server

## Migration Guide

### From Old Pattern

```typescript
// ❌ Old: Direct process.env usage in client code
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
```

### To New Pattern

```typescript
// ✅ New: Use client environment configuration
import { clientEnv } from "@/lib/env-client";
const siteUrl = clientEnv.NEXT_PUBLIC_SITE_URL;
```

## Troubleshooting

### Common Issues

1. **`clientEnv is undefined`**: Make sure you're importing from the correct path
2. **Variable not found**: Check that the variable is prefixed with `NEXT_PUBLIC_`
3. **Build errors**: Ensure all required client-side variables are defined

### Debugging

```typescript
// Check if client environment is properly loaded
console.log("Client environment:", clientEnv);

// Check specific variables
console.log("Site URL:", clientEnv.NEXT_PUBLIC_SITE_URL);
console.log("Analytics ID:", clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
```

## Best Practices

1. **Use appropriate configuration**: Client-side for React components, server-side for API routes
2. **Validate variables**: Both configurations include runtime validation
3. **Type safety**: TypeScript ensures proper usage of environment variables
4. **Consistent naming**: Follow the `NEXT_PUBLIC_` prefix convention for client variables

## Testing

The client-side environment configuration includes validation that will:

- Check for required variables at runtime
- Validate URL formats
- Provide helpful error messages for missing variables

This ensures your application will fail fast if environment variables are misconfigured.
