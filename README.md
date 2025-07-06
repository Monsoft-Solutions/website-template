# SiteWave Website Template

<div align="center">
  
  <h3>🚀 Modern, Full-Featured Website Template for Next.js</h3>
  
  <p>A production-ready website template featuring a blog system, contact forms, SEO optimization, and database integration</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org/)
  
</div>

## 🌟 Features

### Core Features

- ✅ **Modern Tech Stack** - Built with Next.js 15, TypeScript, and Tailwind CSS
- ✅ **Blog System** - Full-featured blog with categories, tags, and dynamic routing
- ✅ **Database Integration** - PostgreSQL with Drizzle ORM for type-safe database operations
- ✅ **Contact Forms** - Validated contact forms with spam protection
- ✅ **SEO Optimized** - Advanced SEO with dynamic sitemaps, Google Search Console integration, and structured data
- ✅ **Analytics Integration** - Google Analytics 4 with comprehensive event tracking and performance monitoring
- ✅ **Responsive Design** - Mobile-first approach with beautiful UI components
- ✅ **Dark Mode Support** - Built-in theme switching with next-themes
- ✅ **Type Safety** - End-to-end TypeScript with Zod validation
- ✅ **Admin Area** - Complete content management system with Better Auth authentication

### Admin Area Features

- 🔐 **Authentication & Authorization** - Better Auth with role-based access control (Admin, Editor, Viewer)
- 📊 **Dashboard Analytics** - Real-time metrics, charts, and performance insights
- 📝 **Content Management** - Full CRUD operations for blog posts and services
- 📬 **Contact Submissions** - Workflow management with status tracking (New → Read → Responded)
- 👥 **User Management** - Invitation-only registration system with role management
- 🔍 **Google Indexing** - Automatic Search Console notifications and manual re-indexing
- 📱 **Mobile-Responsive** - Touch-friendly admin interface for mobile devices
- 🔒 **Security Features** - CSRF protection, input validation, and audit logging

### Blog Features

- 📝 Dynamic blog posts with slugs
- 🏷️ Categories and tags system
- 🔍 Full-text search functionality
- 📅 Published/Draft/Archived status
- 👤 Author profiles with avatars
- 🔗 Related posts suggestions
- 📊 Reading time calculation
- 🎨 Markdown support with syntax highlighting

### Analytics Features

- 📊 **Google Analytics 4** - Official Next.js third-parties integration for optimal performance
- 📈 **Event Tracking** - Comprehensive tracking for blog posts, contact forms, downloads, and user interactions
- ⚡ **Performance Monitoring** - Automatic Core Web Vitals tracking (LCP, FID, CLS)
- 🎯 **Conversion Tracking** - Track form submissions, email signups, and custom business events
- 🔍 **User Behavior** - Reading time tracking, scroll depth, and engagement metrics
- 📱 **Real User Monitoring** - Page load performance and resource timing analysis
- 🚨 **Error Tracking** - Automatic error reporting and performance issue detection
- 🔗 **Social Sharing** - Track social media shares and external link clicks

### Technical Features

- 🗄️ **Database Schema** - Pre-configured tables for blog posts, authors, categories, tags, and contact submissions
- 📧 **Email Integration** - Ready for email notifications
- 🔒 **Environment Variables** - Secure configuration with validation
- 🎨 **Component Library** - Pre-built UI components using shadcn/ui
- 📱 **Loading States** - Skeleton loaders and error boundaries
- 🚀 **Performance** - Optimized images, lazy loading, and caching strategies

### SEO & Search Engine Features

- 🗺️ **Dynamic Sitemap** - Automatically generated sitemap including all pages, blog posts, categories, and tags
- 🔍 **Google Search Console** - Direct integration with Google Indexing API for instant indexing
- 📊 **SEO Metadata** - Dynamic meta tags, Open Graph, and Twitter cards for all pages
- 🏷️ **Structured Data** - JSON-LD schema markup for better search results
- 🤖 **Robots.txt** - Dynamic robots.txt generation with sitemap reference
- ⚡ **Instant Indexing** - Notify Google immediately when content is added or updated

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Analytics:** [Next.js Third Parties](https://nextjs.org/docs/app/guides/third-party-libraries) (Google Analytics 4)
- **Charts:** [Recharts](https://recharts.org/)
- **Markdown:** [React Markdown](https://github.com/remarkjs/react-markdown) + [Gray Matter](https://github.com/jonschlinkert/gray-matter)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Handling:** [date-fns](https://date-fns.org/)

## 📋 Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- npm, yarn, pnpm, or bun package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Monsoft-Solutions/website-template
cd website-template
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Copy the example environment file and update with your values:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/your_database_name

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Site Name"
NEXT_PUBLIC_SITE_DESCRIPTION="Your site description"

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Contact Form Email (Optional)
EMAIL_FROM=noreply@yoursite.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Search Console (Optional - for instant indexing)
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 4. Set up the database

Generate and run database migrations:

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed the database with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website.

### 6. Access the Admin Area

1. **Create your first admin user:**

   ```bash
   npx tsx scripts/add-user.ts
   ```

2. **Follow the prompts to:**

   - Enter email address
   - Choose admin role
   - User will receive registration email

3. **Access the admin dashboard:**
   - Go to [http://localhost:3000/admin](http://localhost:3000/admin)
   - Sign in with your admin credentials
   - Start managing your content!

## 📁 Project Structure

```
site-wave-website/
├── app/                        # Next.js App Router
│   ├── (admin)/               # Admin route group
│   │   ├── layout.tsx         # Admin layout with sidebar
│   │   └── admin/             # Admin pages
│   │       ├── page.tsx       # Admin dashboard
│   │       ├── analytics/     # Analytics dashboard
│   │       ├── blog/          # Blog management
│   │       ├── services/      # Services management
│   │       ├── contact-submissions/ # Contact submissions
│   │       ├── categories/    # Categories management
│   │       ├── tags/          # Tags management
│   │       ├── authors/       # Authors management
│   │       ├── users/         # User management
│   │       └── settings/      # Site settings
│   ├── auth/                  # Authentication pages
│   │   ├── signin/           # Login page
│   │   └── register/         # Registration page
│   ├── api/                   # API routes
│   │   ├── auth/             # Authentication API
│   │   └── admin/            # Admin API endpoints
│   ├── about/                 # About page
│   ├── blog/                  # Blog pages
│   │   └── [slug]/           # Dynamic blog post pages
│   ├── contact/              # Contact page
│   ├── services/             # Services page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── error.tsx             # Error boundary
│   ├── not-found.tsx         # 404 page
│   ├── loading.tsx           # Loading state
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Dynamic robots.txt
│
├── components/                # React components
│   ├── admin/                # Admin UI components
│   │   ├── Sidebar.tsx       # Admin sidebar navigation
│   │   ├── DataTable.tsx     # Admin data tables
│   │   ├── BlogPostForm.tsx  # Blog post form
│   │   ├── ServiceForm.tsx   # Service form
│   │   └── ...               # Other admin components
│   ├── analytics/            # Analytics components and tracking
│   ├── blog/                 # Blog-specific components with analytics
│   ├── forms/                # Form components with analytics tracking
│   ├── layout/               # Layout components (Header, Footer, etc.)
│   ├── seo/                  # SEO components
│   └── ui/                   # shadcn/ui components
│
├── lib/                      # Utilities and configurations
│   ├── api/                  # API client functions
│   ├── auth/                 # Authentication configuration
│   │   ├── auth.ts           # Better Auth config
│   │   ├── client.ts         # Auth client
│   │   └── server.ts         # Server-side auth utilities
│   ├── config/               # Site configuration
│   ├── db/                   # Database configuration
│   │   ├── migrations/       # Database migrations
│   │   ├── schema/           # Database schema definitions
│   │   │   ├── auth-schema.ts # Authentication tables
│   │   │   └── ...           # Other schema files
│   │   └── seed/             # Database seeders
│   ├── hooks/                # Custom React hooks
│   │   ├── use-admin-*.ts    # Admin-specific hooks
│   │   └── ...               # Other hooks
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.type.ts      # Authentication types
│   │   └── ...               # Other type definitions
│   └── utils/                # Utility functions
│       └── analytics.ts      # Google Analytics tracking utilities
│
├── docs/                     # Documentation
│   ├── admin-area.md         # Admin area documentation
│   ├── analytics-implementation.md # Analytics setup guide
│   └── ...                   # Other documentation
│
├── public/                   # Static assets
│   └── images/              # Images
│
├── middleware.ts             # Next.js middleware (auth protection)
├── .env.example             # Environment variables example
├── drizzle.config.ts        # Drizzle ORM configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🗄️ Database Schema

The template includes a complete database schema for a blog system and admin area:

### Core Tables

- **authors** - Blog post authors with profiles
- **categories** - Post categories with slugs
- **blog_posts** - Blog posts with full metadata
- **tags** - Tags for blog posts
- **blog_posts_tags** - Many-to-many relationship
- **contact_submissions** - Contact form submissions with status workflow
- **services** - Service offerings with comprehensive details
- **service\_\*\*** - Related service tables (features, benefits, pricing, etc.)

### Authentication Tables

- **user** - User accounts with role-based permissions
- **session** - User session management
- **account** - OAuth provider accounts
- **verification** - Email verification tokens
- **admin_activity_logs** - Audit trail for admin actions

## 🎨 Customization

### Site Configuration

Edit `lib/config/site.ts` to customize your site:

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
};
```

### Styling

- Tailwind configuration: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Component variants: Using CVA (Class Variance Authority)

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Export a default React component

Example:

```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run sitemap:notify` - Submit all pages to Google for indexing
- `npx tsx scripts/add-user.ts` - Create new admin user account

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The template can be deployed to any platform that supports Next.js:

- Railway
- Netlify
- DigitalOcean App Platform
- AWS Amplify
- Google Cloud Run

### Database Hosting Options

- [Supabase](https://supabase.com/) (Recommended)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)
- [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases)

## 🔍 SEO Configuration

### Dynamic Sitemap

The website automatically generates a comprehensive sitemap at `/sitemap.xml` that includes:

- All static pages (home, about, services, contact, blog)
- All published blog posts with their slugs
- All blog categories and tags
- Proper last modified dates and priorities

The sitemap is generated dynamically using Next.js's built-in sitemap support, ensuring it's always up-to-date.

### Google Search Console Integration

To enable instant indexing with Google Search Console:

1. **Create a Service Account** in Google Cloud Console
2. **Add the service account** to your Google Search Console property
3. **Set environment variables**:

   ```env
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-key...\n-----END PRIVATE KEY-----\n"
   ```

4. **Submit pages to Google**:
   ```bash
   npm run sitemap:notify
   ```

This will:

- Fetch all URLs from your dynamic sitemap
- Submit them to Google using the Indexing API
- Report success/failure for each URL

### SEO Best Practices

- **Meta Tags**: Each page has customizable meta titles and descriptions
- **Open Graph**: Social media previews for all pages
- **Structured Data**: JSON-LD markup for blog posts and organization info
- **Robots.txt**: Automatically generated with sitemap reference
- **Canonical URLs**: Proper canonical tags to avoid duplicate content

## 📊 Analytics Configuration

### Google Analytics 4 Setup

The website includes comprehensive Google Analytics 4 integration using Next.js third-parties for optimal performance.

#### Quick Setup

1. **Get Google Analytics ID**:

   - Create a GA4 property at [analytics.google.com](https://analytics.google.com)
   - Copy your Measurement ID (starts with `G-`)

2. **Add to Environment Variables**:

   ```env
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

3. **Analytics works automatically** - no additional configuration needed!

#### Features Included

- **🎯 Event Tracking**: Automatic tracking for:

  - Page views and navigation
  - Blog post interactions (views, reading completion, social shares)
  - Contact form events (start, submit, complete)
  - Downloads and external link clicks
  - Search queries and email signups

- **⚡ Performance Monitoring**: Real-time tracking of:

  - Core Web Vitals (LCP, FID, CLS)
  - Page load performance
  - Resource loading times
  - Error reporting

- **🔍 User Behavior Analytics**:
  - Reading time tracking for blog posts
  - Social sharing metrics
  - Conversion funnel analysis
  - Custom business events

#### Usage Examples

```typescript
import { analytics } from "@/lib/utils/analytics";

// Track custom events
analytics.trackBlogPost.view("My Post Title", "Technology");
analytics.trackContact.formComplete();
analytics.trackDownload("whitepaper.pdf", "PDF");

// Track performance
analytics.trackPerformance("api_call", 250, "ms");

// Track errors
analytics.trackError("api_error", "Failed to fetch", "HomePage");
```

#### Testing Analytics

Open your browser console and run:

```javascript
testAnalytics();
```

This will verify all tracking functions are working correctly.

#### Analytics Documentation

For detailed implementation guide, see:

- [Analytics Implementation Guide](docs/analytics-implementation.md)
- [Next.js Third Parties Documentation](https://nextjs.org/docs/app/guides/third-party-libraries#google-third-parties)

## 🔐 Admin Area

The Site Wave template includes a comprehensive admin area for content management built with Better Auth and modern UI components.

### Key Features

- **📊 Dashboard** - Analytics overview with key metrics and charts
- **📝 Content Management** - Full CRUD operations for blog posts and services
- **📬 Contact Management** - Review and manage contact form submissions
- **👥 User Management** - Invitation-only registration with role-based access
- **🔍 SEO Tools** - Google indexing notifications and SEO optimization
- **📱 Mobile Responsive** - Admin interface optimized for mobile devices

### Quick Start

1. **Create Admin User**:

   ```bash
   npx tsx scripts/add-user.ts
   ```

2. **Access Admin Dashboard**:
   - Navigate to `/admin`
   - Sign in with admin credentials
   - Start managing your content

### Admin Routes

- `/admin` - Main dashboard with analytics and quick actions
- `/admin/blog` - Blog post management (create, edit, delete)
- `/admin/services` - Service management with multi-step forms
- `/admin/contact-submissions` - Contact form submissions workflow
- `/admin/analytics` - Advanced analytics and reporting
- `/admin/users` - User management and role assignment
- `/admin/settings` - Site configuration and preferences

### Security Features

- **Role-based Access** - Admin, Editor, Viewer, and User roles
- **Session Management** - Secure session handling with automatic expiration
- **Input Validation** - Comprehensive form validation and sanitization
- **CSRF Protection** - Built-in protection against cross-site request forgery
- **Audit Logging** - Track all admin actions for security monitoring

### Documentation

For comprehensive admin area documentation, see:

- [Admin Area Documentation](docs/admin-area.md)
- [User Registration Guide](docs/USER_REGISTRATION.md)
- [Environment Configuration](docs/environment-configuration.md)

## 🧪 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use kebab-case for file names
- Use PascalCase for components and types
- Use camelCase for functions and variables
- Add proper TypeScript types - avoid `any`

### Component Development

1. Create components in `components/` directory
2. Use TypeScript interfaces for props
3. Add JSDoc comments for complex components
4. Follow the established naming conventions

### Database Changes

1. Modify schema in `lib/db/schema/`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`

## 🔧 Troubleshooting

### Common Issues

**Database Connection Errors**

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database credentials

**Build Errors**

- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check for TypeScript errors: `npx tsc --noEmit`

**Environment Variables**

- Ensure all required variables are set
- Check for typos in variable names
- Restart dev server after changes

**Analytics Issues**

- Verify `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` is set correctly
- Ensure Measurement ID starts with `G-`
- Check browser Network tab for GA4 requests
- Use GA4 DebugView for real-time testing
- Run `testAnalytics()` in browser console to verify setup

**Admin Area Issues**

- **Authentication Problems**: Check `BETTER_AUTH_SECRET` is set and database connection
- **Permission Errors**: Verify user role in database and restart application
- **Session Issues**: Clear browser cookies and ensure session tables exist
- **Admin Access**: Confirm middleware is protecting `/admin/*` routes correctly

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [Apache License 2.0](LICENSE).

## 👤 Creator

**Monsoft Solutions**

- Website: [https://monsoft.io](https://monsoft.io)
- Email: [hello@monsoftsolutions.com](mailto:hello@monsoftsolutions.com)
- GitHub: [Monsoft-Solutions](https://github.com/Monsoft-Solutions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Next.js Third Parties](https://nextjs.org/docs/app/guides/third-party-libraries) for seamless Google Analytics integration
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for the type-safe database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

<div align="center">
  Made with ❤️ by <a href="https://monsoft.io">Monsoft Solutions, LLC</a>
</div>
