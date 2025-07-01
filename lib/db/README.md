# Database Setup with Drizzle ORM

This directory contains the database configuration for the Site Wave website template using Drizzle ORM with PostgreSQL.

## 📦 Dependencies Installed

The following packages have been installed for the database setup:

- `drizzle-orm` - TypeScript ORM for PostgreSQL
- `postgres` - PostgreSQL client for Node.js
- `dotenv` - Environment variable management
- `drizzle-kit` - Migration and tooling (dev dependency)
- `tsx` - TypeScript execution engine (dev dependency)

## 🗂 File Structure

```
lib/db/
├── README.md          # This file
├── index.ts           # Database connection and configuration
├── schema.ts          # Database schema definitions
├── seed.ts            # Database seeding script
└── migrations/        # Generated migration files (auto-generated)
```

## 🔧 Environment Setup

1. **Create Environment File**: Copy `.env.example` to `.env.local` and configure your database URL:

```bash
cp .env.example .env.local
```

2. **Configure Database URL**: Update your `.env.local` file with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database_name
```

### Local Development Options

#### Option 1: Docker PostgreSQL (Recommended)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name site-wave-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_USER=sitewave \
  -e POSTGRES_DB=site_wave_db \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL would be:
DATABASE_URL=postgresql://sitewave:mypassword@localhost:5432/site_wave_db
```

#### Option 2: Cloud PostgreSQL

- **Supabase**: Create a project at [supabase.com](https://supabase.com)
- **Neon**: Create a database at [neon.tech](https://neon.tech)
- **Railway**: Deploy at [railway.app](https://railway.app)
- **Vercel Postgres**: Use with Vercel hosting

## 📋 Database Schema

The database includes the following tables:

### Core Tables

- **categories** - Blog post categories
- **authors** - Blog post authors
- **tags** - Blog post tags
- **blog_posts** - Main blog posts table
- **blog_posts_tags** - Many-to-many relationship between posts and tags
- **contact_submissions** - Contact form submissions

### Key Features

- UUID primary keys for better scalability
- Proper foreign key relationships
- TypeScript types automatically inferred
- Enums for status fields
- Timestamps with auto-update
- SEO-friendly slugs

## 🚀 Available Scripts

Add these scripts to your workflow:

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema changes directly (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with initial data
npm run db:seed
```

## 📊 Database Operations

### Initial Setup

1. **Generate and run migrations**:

```bash
npm run db:generate
npm run db:migrate
```

2. **Or push schema directly** (for development):

```bash
npm run db:push
```

3. **Seed with initial data**:

```bash
npm run db:seed
```

### Using Drizzle Studio

Drizzle Studio provides a visual interface for your database:

```bash
npm run db:studio
```

This will open a web interface where you can:

- Browse all tables and data
- Run queries
- Edit records
- View relationships

## 💻 Usage in Code

### Importing the Database

```typescript
import { db } from "@/lib/db";
import { blogPosts, categories, authors } from "@/lib/db/schema";
```

### Basic Queries

```typescript
// Select all published posts
const posts = await db
  .select()
  .from(blogPosts)
  .where(eq(blogPosts.status, "published"));

// Insert a new category
const [category] = await db
  .insert(categories)
  .values({
    name: "New Category",
    slug: "new-category",
    description: "A new category for blog posts",
  })
  .returning();

// Update a post
await db
  .update(blogPosts)
  .set({ title: "Updated Title" })
  .where(eq(blogPosts.id, postId));

// Delete a post
await db.delete(blogPosts).where(eq(blogPosts.id, postId));
```

### Relational Queries

```typescript
// Get posts with their authors and categories
const postsWithDetails = await db
  .select({
    post: blogPosts,
    author: authors,
    category: categories,
  })
  .from(blogPosts)
  .leftJoin(authors, eq(blogPosts.authorId, authors.id))
  .leftJoin(categories, eq(blogPosts.categoryId, categories.id));
```

## 🔄 Migration Workflow

1. **Make schema changes** in `schema.ts`
2. **Generate migration**:
   ```bash
   npm run db:generate
   ```
3. **Review the generated SQL** in `lib/db/migrations/`
4. **Apply migration**:
   ```bash
   npm run db:migrate
   ```

## 🧪 Development vs Production

### Development

- Use `db:push` for rapid iteration
- Use local PostgreSQL or development cloud database
- Enable query logging

### Production

- Always use migrations (`db:generate` + `db:migrate`)
- Use production PostgreSQL instance
- Disable query logging
- Set proper connection pooling

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Database Credentials**: Use strong passwords and rotate regularly
3. **Connection Pooling**: Configure appropriate connection limits
4. **SSL**: Always use SSL in production (`?ssl=true` in connection string)

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find name 'process'"**:

   - Ensure `@types/node` is installed: `npm install -D @types/node`

2. **Connection errors**:

   - Verify DATABASE_URL is correct
   - Check if PostgreSQL is running
   - Confirm network connectivity

3. **Migration conflicts**:

   - Check for concurrent schema changes
   - Reset migrations if needed (development only)

4. **Type errors**:
   - Regenerate types: `npm run db:generate`
   - Restart TypeScript server

### Getting Help

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Check the implementation plan document for detailed requirements

## 📝 Next Steps

After setting up the database:

1. **Implement API routes** for CRUD operations
2. **Create blog components** to display data
3. **Add authentication** if needed
4. **Set up email notifications** for contact forms
5. **Implement SEO features** using the meta fields

The database is now ready to support a full-featured website with blog functionality!
