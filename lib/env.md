# Environment Configuration

This project uses a centralized environment configuration system with TypeScript validation.

## Quick Start

1. **Copy the example file:**

   ```bash
   cp env.example .env.local
   ```

2. **Fill in your values:**
   Edit `.env.local` with your actual configuration values.

3. **Import the env in your code:**

   ```typescript
   import { env, isDevelopment, isProduction } from "@/lib/env";

   // Use validated environment variables
   console.log(env.DATABASE_URL);
   console.log(env.NEXT_PUBLIC_SITE_URL);

   // Use utility functions
   if (isDevelopment) {
     console.log("Running in development mode");
   }
   ```

## Features

- ✅ **TypeScript validation** - Ensures all required variables are present and correctly typed
- ✅ **Runtime validation** - Validates URL formats, numbers, and enum values
- ✅ **Clear error messages** - Helpful error messages when validation fails
- ✅ **Centralized configuration** - Single source of truth for all environment variables
- ✅ **Utility functions** - Helper functions for common environment checks

## Required Variables

The following environment variables are required and must be set in your `.env.local`:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Application environment (development/production/test)
- `NEXT_PUBLIC_SITE_URL` - Public URL of your website

## Optional Variables

Optional variables for additional features:

- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `NEXTAUTH_URL` - NextAuth.js URL
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email configuration
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloud storage
- `GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID

## Adding New Environment Variables

1. **Add to the EnvSchema type:**

   ```typescript
   type EnvSchema = {
     // ... existing variables
     NEW_VARIABLE: string;
   };
   ```

2. **Add to required array if mandatory:**

   ```typescript
   const REQUIRED_ENV_VARS = [
     // ... existing vars
     "NEW_VARIABLE",
   ];
   ```

3. **Add validation logic if needed:**

   ```typescript
   // Custom validation for your variable
   if (env.NEW_VARIABLE && !isValidFormat(env.NEW_VARIABLE)) {
     errors.push("NEW_VARIABLE must be in valid format");
   }
   ```

4. **Return it in the validateEnv function:**

   ```typescript
   return {
     // ... existing vars
     NEW_VARIABLE: env.NEW_VARIABLE!,
   };
   ```

5. **Update env.example:**
   Add documentation and example value to the `env.example` file.

## Best Practices

- **Never commit `.env.local`** to version control
- **Always use `env.VARIABLE_NAME`** instead of `process.env.VARIABLE_NAME`
- **Add validation** for new environment variables
- **Document new variables** in `env.example`
- **Use TypeScript types** for better developer experience

## Troubleshooting

If you see validation errors:

1. Check that all required variables are set in `.env.local`
2. Verify the format of URL and numeric variables
3. Ensure `NODE_ENV` is one of: development, production, test
4. Refer to `env.example` for correct format examples
