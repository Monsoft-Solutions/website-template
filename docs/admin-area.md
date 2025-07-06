# Admin Area Documentation

## 🎯 Overview

The Site Wave admin area is a comprehensive content management system built with Next.js 15, Better Auth, and PostgreSQL. It provides a complete solution for managing blog posts, services, contact submissions, and site analytics with role-based access control.

## 🔐 Authentication & Authorization

### Better Auth Integration

The admin area uses Better Auth for secure authentication with the following features:

- **Email/Password Authentication** - Secure login with email verification
- **Session Management** - 7-day session expiration with automatic refresh
- **Role-based Access Control** - Admin, Editor, Viewer, and User roles
- **Database Integration** - Drizzle ORM with PostgreSQL adapter

### User Roles

- **Admin** - Full access to all admin features
- **Editor** - Can manage content (blog posts, services) but limited system access
- **Viewer** - Read-only access to admin dashboard and reports
- **User** - Basic authenticated user (frontend only)

### Protected Routes

All `/admin/*` routes are protected by middleware that checks for valid sessions and redirects unauthenticated users to `/auth/signin`.

## 🏗️ Architecture

### File Structure

```
app/
├── (admin)/                       # Admin route group
│   ├── layout.tsx                # Admin layout with sidebar
│   └── admin/
│       ├── page.tsx              # Dashboard
│       ├── analytics/
│       │   └── page.tsx          # Analytics dashboard
│       ├── blog/
│       │   ├── page.tsx          # Blog posts management
│       │   ├── new/page.tsx      # Create blog post
│       │   └── [id]/
│       │       ├── edit/page.tsx # Edit blog post
│       │       └── preview/page.tsx # Preview blog post
│       ├── services/
│       │   ├── page.tsx          # Services management
│       │   ├── new/page.tsx      # Create service
│       │   └── [id]/
│       │       ├── edit/page.tsx # Edit service
│       │       └── preview/page.tsx # Preview service
│       ├── categories/page.tsx    # Categories management
│       ├── tags/page.tsx         # Tags management
│       ├── authors/page.tsx      # Authors management
│       ├── users/page.tsx        # User management
│       ├── contact-submissions/   # Contact submissions
│       │   ├── page.tsx          # Submissions list
│       │   └── [id]/page.tsx     # Submission details
│       └── settings/page.tsx     # Site settings
├── auth/
│   ├── signin/page.tsx           # Login page
│   └── register/page.tsx         # Registration page
├── api/
│   ├── auth/[...all]/route.ts    # Better Auth handler
│   └── admin/                    # Admin API endpoints
│       ├── blog/route.ts         # Blog API
│       ├── services/route.ts     # Services API
│       ├── contact-submissions/  # Contact submissions API
│       ├── analytics/route.ts    # Analytics API
│       ├── users/route.ts        # User management API
│       └── google-indexing/      # Google indexing API
```

### Database Schema

The admin area extends the existing database with authentication tables:

- **users** - User accounts with role-based permissions
- **sessions** - User session management
- **accounts** - OAuth provider accounts
- **verification** - Email verification tokens
- **admin_activity_logs** - Audit trail for admin actions

## 📊 Dashboard Features

### Main Dashboard

The admin dashboard provides:

- **Key Metrics Cards** - Total posts, services, users, and submissions
- **Analytics Charts** - Traffic, engagement, and performance metrics
- **Recent Activity** - Latest blog posts, services, and submissions
- **Quick Actions** - Direct links to create content and manage site

### Analytics Dashboard

Advanced analytics with:

- **Traffic Analytics** - Page views, unique visitors, and bounce rate
- **Content Performance** - Most popular posts and services
- **User Engagement** - Reading time, social shares, and comments
- **Contact Analytics** - Submission trends and conversion rates

## 📝 Content Management

### Blog Management

**List View Features:**

- Paginated table with sorting and filtering
- Search by title, content, or author
- Filter by category, tag, status, and date
- Bulk operations (publish, unpublish, delete)
- Quick edit and preview options

**Create/Edit Features:**

- Rich markdown editor with live preview
- Image upload and management
- SEO metadata configuration
- Category and tag assignment
- Author selection and scheduling
- Draft/published status control

**Preview System:**

- Live preview while editing
- Responsive preview for different devices
- SEO metadata preview

### Services Management

**List View Features:**

- Comprehensive services table
- Filter by category, pricing, and status
- Search across all service fields
- Bulk status updates

**Create/Edit Features:**

- Multi-section service forms:
  - Basic information (title, description, pricing)
  - Features and benefits
  - Process steps
  - Gallery images
  - FAQs and testimonials
  - Technology stack
- Image upload for service galleries
- SEO optimization tools

### Supporting Content

**Categories Management:**

- CRUD operations for blog and service categories
- Hierarchy support for nested categories
- Usage statistics and optimization suggestions

**Tags Management:**

- Tag creation and management
- Usage analytics and popularity metrics
- Tag merging and cleanup tools

**Authors Management:**

- Author profile management
- Post statistics and performance metrics
- Bio and social media integration

## 📬 Contact Submissions

### Submission Management

**List View:**

- Paginated submissions with advanced filtering
- Status workflow (New → Read → Responded)
- Search by name, email, company, or content
- Date range filtering and sorting
- Bulk status updates

**Detail View:**

- Complete submission information
- Contact details and project requirements
- System metadata (IP, user agent, timestamp)
- Status update with confirmation
- Internal notes and comments system

**Analytics:**

- Submission trends and conversion rates
- Status distribution charts
- Response time metrics
- Project type and budget analytics

### Workflow Management

Three-stage status system:

1. **New** - Requires immediate attention
2. **Read** - Admin has reviewed the submission
3. **Responded** - Complete, response sent

## 🔍 Search & Filtering

### Global Search

- Search across all content types
- Real-time search suggestions
- Advanced filter combinations

### Content Filtering

- **Blog Posts**: Category, tag, author, status, date
- **Services**: Category, pricing tier, technology, status
- **Submissions**: Status, date range, project type, budget
- **Users**: Role, registration date, activity status

## 🎨 User Interface

### Design System

**Components:**

- Responsive sidebar navigation
- Data tables with sorting and pagination
- Form components with validation
- Modal dialogs and confirmations
- Loading states and error boundaries

**Theming:**

- Consistent with main site design
- Dark/light mode support
- Mobile-responsive layouts
- Accessible UI components

### Navigation

**Sidebar Menu:**

- Dashboard
- Analytics
- Blog Posts
- Services
- Categories
- Tags
- Authors
- Contact Submissions
- Users
- Settings

**Breadcrumbs:**

- Clear navigation path
- Quick access to parent sections
- Context-aware actions

## 🔧 API Endpoints

### Authentication

```
POST /api/auth/sign-in          # User login
POST /api/auth/sign-up          # User registration
POST /api/auth/sign-out         # User logout
GET  /api/auth/session          # Get current session
```

### Blog Management

```
GET    /api/admin/blog          # List blog posts
POST   /api/admin/blog          # Create blog post
GET    /api/admin/blog/[id]     # Get blog post
PUT    /api/admin/blog/[id]     # Update blog post
DELETE /api/admin/blog/[id]     # Delete blog post
```

### Services Management

```
GET    /api/admin/services      # List services
POST   /api/admin/services      # Create service
GET    /api/admin/services/[id] # Get service
PUT    /api/admin/services/[id] # Update service
DELETE /api/admin/services/[id] # Delete service
```

### Contact Submissions

```
GET    /api/admin/contact-submissions      # List submissions
GET    /api/admin/contact-submissions/[id] # Get submission
PUT    /api/admin/contact-submissions/[id] # Update submission
DELETE /api/admin/contact-submissions/[id] # Delete submission
```

### Analytics

```
GET /api/admin/analytics/dashboard    # Dashboard metrics
GET /api/admin/analytics/content      # Content performance
GET /api/admin/analytics/traffic      # Traffic analytics
GET /api/admin/analytics/submissions  # Contact analytics
```

## 🔒 Security Features

### Authentication Security

- **Session Management** - Secure cookies with HttpOnly flag
- **CSRF Protection** - Built-in CSRF token validation
- **Rate Limiting** - API endpoint protection
- **Input Validation** - Zod schema validation on all inputs

### Data Protection

- **SQL Injection Prevention** - Prepared statements via Drizzle ORM
- **XSS Protection** - Input sanitization and output encoding
- **File Upload Security** - Type validation and size limits
- **Access Control** - Role-based permissions on all operations

## 📈 Performance Optimization

### Database Optimization

- **Query Optimization** - Efficient joins and indexing
- **Pagination** - Limit large result sets
- **Caching** - Redis integration for frequently accessed data
- **Connection Pooling** - Optimized database connections

### Frontend Performance

- **Code Splitting** - Lazy loading of admin components
- **Image Optimization** - Next.js Image component
- **Bundle Optimization** - Tree shaking and minification
- **Loading States** - Skeleton loaders and progress indicators

## 🔍 SEO & Google Indexing

### Automatic Indexing

- **Google Search Console Integration** - Instant indexing notifications
- **Sitemap Updates** - Dynamic sitemap generation
- **URL Notifications** - Automatic Google indexing API calls
- **Batch Processing** - Bulk indexing operations

### SEO Management

- **Meta Tags** - Dynamic meta title and description
- **Open Graph** - Social media optimization
- **Structured Data** - JSON-LD schema markup
- **Canonical URLs** - Duplicate content prevention

## 📱 Mobile Administration

### Responsive Design

- **Mobile-First Approach** - Optimized for touch devices
- **Adaptive Navigation** - Collapsible sidebar on mobile
- **Touch-Friendly UI** - Larger buttons and touch targets
- **Offline Support** - Service worker for offline functionality

### Mobile Features

- **Quick Actions** - Streamlined mobile workflows
- **Gesture Support** - Swipe actions for common tasks
- **Push Notifications** - Real-time updates on mobile
- **Progressive Web App** - App-like experience on mobile

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/db

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Google Search Console
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Email (Optional)
EMAIL_FROM=admin@yoursite.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Site Configuration

The admin area includes a settings page for managing:

- **Site Information** - Name, description, contact details
- **SEO Settings** - Meta tags, analytics IDs, sitemap config
- **Email Settings** - SMTP configuration and templates
- **Feature Flags** - Enable/disable admin features
- **API Keys** - Google services and third-party integrations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Google Search Console account (optional)
- Email provider (optional)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd site-wave-website
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database:**

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Access admin area:**
   - Go to http://localhost:3000/admin
   - Use seeded admin credentials:
     - Email: admin@site-wave.com
     - Password: (created during setup)

### First Admin User

Create your first admin user using the registration system:

1. Run the add-user script:

   ```bash
   npx tsx scripts/add-user.ts
   ```

2. Follow the prompts to create an admin user

3. User will receive registration email to set password

## 📖 Usage Guide

### Creating Blog Posts

1. **Navigate to Blog Posts** - `/admin/blog`
2. **Click "New Post"** - Start with basic information
3. **Write Content** - Use markdown editor with live preview
4. **Add Media** - Upload images and optimize for web
5. **Set Categories/Tags** - Organize content for discovery
6. **Configure SEO** - Meta tags, descriptions, and keywords
7. **Preview** - Review appearance before publishing
8. **Publish** - Make live and notify search engines

### Managing Services

1. **Navigate to Services** - `/admin/services`
2. **Click "New Service"** - Multi-step form process
3. **Basic Information** - Title, description, pricing
4. **Features & Benefits** - Detailed service information
5. **Process Steps** - How the service works
6. **Gallery** - Upload service images
7. **FAQs** - Common questions and answers
8. **Technologies** - Technical specifications
9. **Preview & Publish** - Review and make live

### Handling Contact Submissions

1. **View Submissions** - `/admin/contact-submissions`
2. **Filter by Status** - New, Read, Responded
3. **Review Details** - Click submission to view full information
4. **Update Status** - Mark as read or responded
5. **Add Notes** - Internal comments for tracking
6. **Export Data** - Download for external processing

### Managing Users

1. **View Users** - `/admin/users`
2. **Add New User** - Send registration invitation
3. **Update Roles** - Change user permissions
4. **Monitor Activity** - View user login history
5. **Deactivate Users** - Suspend access if needed

## 🔍 Troubleshooting

### Common Issues

**Authentication Problems:**

- Check BETTER_AUTH_SECRET is set
- Verify database connection
- Clear browser cookies and try again

**Database Errors:**

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Run migrations: `npm run db:migrate`

**Permission Errors:**

- Verify user role in database
- Check middleware configuration
- Restart application after role changes

**Performance Issues:**

- Monitor database query performance
- Check network connectivity
- Optimize image sizes and formats

### Error Logging

The admin area includes comprehensive error logging:

- **Application Errors** - Logged to console and files
- **Database Errors** - Query failures and connection issues
- **Authentication Errors** - Login failures and session issues
- **API Errors** - Request/response logging with stack traces

## 🔄 Updates & Maintenance

### Regular Tasks

- **Database Backups** - Schedule regular PostgreSQL backups
- **Security Updates** - Keep dependencies updated
- **Performance Monitoring** - Monitor response times and errors
- **Content Cleanup** - Remove unused images and old drafts

### Monitoring

- **Application Health** - Monitor uptime and performance
- **Database Performance** - Query optimization and indexing
- **Security Alerts** - Failed login attempts and suspicious activity
- **User Activity** - Track admin actions and content changes

## 📊 Analytics & Reporting

### Built-in Analytics

- **Content Performance** - Page views, engagement metrics
- **User Behavior** - Navigation patterns and time spent
- **Conversion Tracking** - Contact form submissions and goals
- **SEO Performance** - Search rankings and click-through rates

### Custom Reports

- **Content Audit** - Review all published content
- **User Activity** - Admin actions and login history
- **Performance Metrics** - Site speed and availability
- **Security Reports** - Failed logins and security events

## 🎯 Future Enhancements

### Planned Features

- **Advanced Workflows** - Content approval processes
- **Multi-language Support** - International content management
- **API Documentation** - Interactive API explorer
- **Plugin System** - Extensible admin functionality
- **Advanced Analytics** - Machine learning insights

### Integration Opportunities

- **CRM Integration** - Connect with customer management systems
- **Email Marketing** - Newsletter and campaign management
- **Social Media** - Auto-posting and social analytics
- **E-commerce** - Product catalog and order management

---

## 📞 Support

For questions, issues, or feature requests:

- **Documentation** - Check this guide and implementation plans
- **GitHub Issues** - Report bugs and request features
- **Email Support** - Contact the development team
- **Community** - Join discussions and share experiences

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Compatibility:** Next.js 15, React 19, Node.js 18+
