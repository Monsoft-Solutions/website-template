# Website Template Implementation Plan

## Overview

This document outlines the implementation plan for a comprehensive website template that can be used as a starting point for new website projects. The template will include all essential features for modern websites including a blog system, database integration, SEO optimization, and Google Search Console integration.

## Tech Stack

### Core Technologies

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Email**: Resend/Nodemailer
- **SEO**: Next.js built-in SEO + custom implementations
- **Authentication** (optional): NextAuth.js
- **Deployment**: Vercel/Railway/DigitalOcean

### Additional Dependencies

- **shadcn/ui**: Component library
- **react-hook-form**: Form management
- **zod**: Schema validation
- **date-fns**: Date formatting
- **gray-matter**: Markdown front matter parsing
- **react-markdown**: Markdown rendering
- **google-search-console-api**: Google integration

## Database Schema

### Blog System Tables

```sql
-- Categories table
categories
- id (uuid, primary key)
- name (varchar(255), unique)
- slug (varchar(255), unique)
- description (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

-- Blog posts table
blog_posts
- id (uuid, primary key)
- title (varchar(255))
- slug (varchar(255), unique)
- excerpt (text)
- content (text)
- featured_image (varchar(500), nullable)
- author_id (uuid, foreign key)
- category_id (uuid, foreign key)
- status (enum: draft, published, archived)
- published_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- meta_title (varchar(255), nullable)
- meta_description (text, nullable)
- meta_keywords (text, nullable)

-- Tags table
tags
- id (uuid, primary key)
- name (varchar(100))
- slug (varchar(100), unique)
- created_at (timestamp)

-- Blog posts tags junction table
blog_posts_tags
- post_id (uuid, foreign key)
- tag_id (uuid, foreign key)
- PRIMARY KEY (post_id, tag_id)

-- Authors table
authors
- id (uuid, primary key)
- name (varchar(255))
- email (varchar(255), unique)
- bio (text, nullable)
- avatar_url (varchar(500), nullable)
- created_at (timestamp)
- updated_at (timestamp)

-- Contact form submissions
contact_submissions
- id (uuid, primary key)
- name (varchar(255))
- email (varchar(255))
- subject (varchar(255), nullable)
- message (text)
- status (enum: new, read, responded)
- created_at (timestamp)
- ip_address (varchar(45), nullable)
- user_agent (text, nullable)
```

## Project Structure

```
site-wave-website/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── blog/
│   │   ├── page.tsx            # Blog listing page
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Individual blog post
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx    # Category listing
│   ├── contact/
│   │   └── page.tsx            # Contact page
│   ├── api/
│   │   ├── blog/
│   │   │   ├── route.ts        # Blog CRUD operations
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── contact/
│   │   │   └── route.ts        # Handle contact form
│   │   ├── sitemap/
│   │   │   └── route.ts        # Generate sitemap
│   │   └── search-console/
│   │       └── route.ts        # Google Search Console
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogList.tsx
│   │   ├── CategoryList.tsx
│   │   └── RelatedPosts.tsx
│   ├── forms/
│   │   ├── ContactForm.tsx
│   │   └── FormField.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx
│   │   └── MetaTags.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── db/
│   │   ├── index.ts            # Drizzle instance
│   │   ├── schema.ts           # Database schema
│   │   └── migrations/         # Database migrations
│   ├── api/
│   │   ├── blog.ts             # Blog API functions
│   │   ├── contact.ts          # Contact API functions
│   │   └── search-console.ts   # Google integration
│   ├── utils/
│   │   ├── seo.ts              # SEO utilities
│   │   ├── validation.ts       # Zod schemas
│   │   └── email.ts            # Email utilities
│   └── config/
│       ├── site.ts             # Site configuration
│       └── seo.ts              # SEO configuration
├── public/
│   ├── robots.txt
│   └── images/
├── styles/
│   └── globals.css
└── .env.local                  # Environment variables
```

## Implementation Steps

### Phase 1: Initial Setup (Week 1)

1. **Environment Setup**

   - Initialize Next.js project with TypeScript
   - Install and configure Tailwind CSS
   - Set up Drizzle ORM with PostgreSQL
   - Configure environment variables
   - Set up ESLint and Prettier

2. **Database Setup**

   - Create PostgreSQL database
   - Implement Drizzle schema
   - Create migration scripts
   - Seed initial data

3. **Project Structure**
   - Create folder structure
   - Set up path aliases
   - Configure TypeScript paths

### Phase 2: Core Components (Week 2)

1. **Layout Components**

   - Create responsive Header with navigation
   - Implement Footer with links and social media
   - Build mobile-responsive navigation menu
   - Add loading states and error boundaries

2. **UI Components**

   - Install and configure shadcn/ui
   - Create reusable Button, Card, Input components
   - Build form components with validation
   - Implement toast notifications

3. **SEO Components**
   - Create MetaTags component
   - Implement JSON-LD structured data
   - Build dynamic OG image generation

### Phase 3: Core Pages & Features (Week 4)

1. **Static Pages**

   - Design and implement Home page
   - Create About page
   - Blog Listing Page (use dummy data for the momment)
   - Blog Entry Template view
   - Build Contact page with form
   - Add 404 and error pages

2. **Contact Form**

   - Implement form validation with Zod
   - Create API endpoint for submissions
   - Set up email notifications
   - Add spam protection (reCAPTCHA)

3. **Performance Optimization**
   - Implement image optimization
   - Add lazy loading
   - Configure caching strategies
   - Optimize bundle size

### Phase 4: Blog System (Week 3)

1. **Blog API Layer**

   - Implement CRUD operations for posts
   - Create category management
   - Build tag system
   - Add pagination support

2. **Blog Frontend**

   - Create blog listing page with filters
   - Implement individual blog post page
   - Build category and tag pages
   - Add related posts functionality
   - Implement search functionality

3. **Content Management**
   - Create admin dashboard (optional)
   - Build markdown editor
   - Implement image upload
   - Add draft/publish workflow

### Phase 5: SEO & Google Integration (Week 5)

1. **SEO Implementation**

   - Generate dynamic sitemap.xml
   - Create robots.txt
   - Implement canonical URLs
   - Add schema.org markup
   - Configure meta tags for all pages

2. **Google Search Console Integration**

   - Set up API credentials
   - Implement URL submission endpoint
   - Create batch submission functionality
   - Add indexing status checker

3. **Analytics Setup**
   - Integrate Google Analytics 4
   - Add conversion tracking
   - Implement custom events
   - Create performance monitoring

### Phase 6: Advanced Features (Week 6)

1. **Authentication (Optional)**

   - Set up NextAuth.js
   - Implement user registration/login
   - Add protected routes
   - Create user profile pages

2. **Additional Features**

   - Implement newsletter subscription
   - Add comment system
   - Create RSS feed
   - Build search functionality
   - Add social sharing buttons

3. **Testing & Documentation**
   - Write unit tests for utilities
   - Create integration tests for API
   - Document component usage
   - Create setup guide

## Configuration Files

### Environment Variables (.env.local)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_SITE_NAME=Your Site Name

# Email
EMAIL_FROM=noreply@yoursite.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Search Console
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://yoursite.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Site Configuration (lib/config/site.ts)

```typescript
export const siteConfig = {
  name: "Your Site Name",
  description: "Your site description",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourhandle",
  },
  creator: {
    name: "Your Name",
    twitter: "@yourhandle",
  },
};
```

## Key Features Implementation Details

### 1. Blog System

- Dynamic routing for blog posts using slugs
- Category and tag filtering
- Pagination with URL parameters
- Search functionality with full-text search
- RSS feed generation
- Reading time calculation
- Related posts algorithm

### 2. Form Handling

- Client-side validation with React Hook Form and Zod
- Server-side validation
- Email notifications on submission
- Spam protection with rate limiting
- Success/error feedback
- Form data storage in database

### 3. SEO Features

- Dynamic meta tags for all pages
- Open Graph and Twitter Card support
- Canonical URLs
- JSON-LD structured data
- XML sitemap generation
- Robots.txt configuration
- Automatic image optimization

### 4. Google Search Console Integration

- Service account authentication
- URL submission API endpoint
- Batch URL submission
- Indexing status checking
- Sitemap submission
- Performance data retrieval

## Testing Strategy

1. **Unit Tests**

   - Utility functions
   - Validation schemas
   - SEO utilities

2. **Integration Tests**

   - API endpoints
   - Database operations
   - Form submissions

3. **E2E Tests**
   - User flows
   - Form submissions
   - Blog navigation

## Deployment Considerations

1. **Database Hosting**

   - Supabase (recommended for ease)
   - Railway
   - DigitalOcean Managed Database
   - AWS RDS

2. **Application Hosting**

   - Vercel (recommended for Next.js)
   - Railway
   - DigitalOcean App Platform
   - AWS Amplify

3. **Environment Setup**
   - Set all environment variables
   - Configure custom domain
   - Set up SSL certificates
   - Configure email service

## Maintenance & Updates

1. **Regular Tasks**

   - Update dependencies
   - Monitor error logs
   - Check Google Search Console
   - Review contact submissions
   - Backup database

2. **Performance Monitoring**
   - Core Web Vitals
   - Page load times
   - API response times
   - Error rates

## Conclusion

This template provides a solid foundation for building modern websites with all essential features. The modular architecture allows for easy customization and extension based on specific project requirements. Following this implementation plan will result in a production-ready website template that can be reused for multiple projects.
