import { db } from "../../index";
import {
  blogPosts,
  categories,
  authors,
  type NewBlogPost,
} from "../../schema/index";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Get sample blog post data with dynamic references
 */
const getBlogPostData = async (): Promise<NewBlogPost[]> => {
  // Fetch existing categories and authors
  const [categoriesData, authorsData] = await Promise.all([
    db.select().from(categories),
    db.select().from(authors),
  ]);

  if (categoriesData.length === 0 || authorsData.length === 0) {
    throw new Error("Categories and authors must be seeded before blog posts");
  }

  const webDevCategory = categoriesData.find(
    (c) => c.slug === "web-development"
  )!;
  const designCategory = categoriesData.find((c) => c.slug === "design")!;
  const businessCategory = categoriesData.find((c) => c.slug === "business")!;

  const johnAuthor = authorsData.find((a) => a.email === "john@example.com")!;
  const janeAuthor = authorsData.find((a) => a.email === "jane@example.com")!;
  const mikeAuthor = authorsData.find((a) => a.email === "mike@example.com")!;

  return [
    {
      title: "Getting Started with Next.js 15",
      slug: "getting-started-nextjs-15",
      excerpt:
        "Learn how to build modern web applications with the latest version of Next.js.",
      content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make building React applications even better. In this comprehensive guide, we'll explore the key features and how to get started.

## What's New in Next.js 15

- Improved App Router with better performance
- Enhanced Server Components
- Better TypeScript support
- New experimental features

## Setting Up Your First Project

To get started with Next.js 15, run the following command:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will create a new Next.js application with all the latest features and best practices.

## Key Features to Explore

1. **App Router**: The new routing system based on the file system
2. **Server Components**: Render components on the server for better performance
3. **Streaming**: Improve user experience with progressive rendering
4. **Built-in SEO**: Automatic meta tags and sitemap generation

Start building amazing applications with Next.js 15 today!`,
      featuredImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      authorId: johnAuthor.id,
      categoryId: webDevCategory.id,
      status: "published",
      publishedAt: new Date(),
      metaTitle: "Getting Started with Next.js 15 - Complete Guide",
      metaDescription:
        "Learn how to build modern web applications with Next.js 15. Complete guide with examples and best practices.",
      metaKeywords: "Next.js, React, web development, JavaScript, TypeScript",
    },
    {
      title: "The Future of Web Design: Trends for 2024",
      slug: "future-web-design-trends-2024",
      excerpt:
        "Explore the latest design trends that will shape the web in 2024 and beyond.",
      content: `# The Future of Web Design: Trends for 2024

Web design continues to evolve at a rapid pace. Here are the key trends that are shaping the future of web design in 2024.

## 1. Minimalist Design

Less is more. Clean, simple designs that focus on content and user experience.

## 2. Dark Mode Everything

Dark themes are no longer optional - they're expected by users.

## 3. Micro-Interactions

Small animations and interactions that provide feedback and delight users.

## 4. AI-Powered Personalization

Using AI to create personalized experiences for each user.

## 5. Sustainable Web Design

Designing with environmental impact in mind - faster loading, less energy consumption.

Stay ahead of these trends to create websites that users love!`,
      featuredImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      authorId: janeAuthor.id,
      categoryId: designCategory.id,
      status: "published",
      publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      metaTitle: "Web Design Trends 2024 - Future of Digital Design",
      metaDescription:
        "Discover the latest web design trends for 2024. Learn about minimalist design, dark mode, micro-interactions, and more.",
      metaKeywords: "web design, design trends, UI design, UX design, 2024",
    },
    {
      title: "Building a Successful Tech Startup: Lessons Learned",
      slug: "building-successful-tech-startup-lessons",
      excerpt:
        "Key insights and lessons from building and scaling a tech startup from zero to success.",
      content: `# Building a Successful Tech Startup: Lessons Learned

Starting a tech company is challenging but rewarding. Here are the key lessons I've learned from building a successful startup.

## 1. Validate Early and Often

Don't build in isolation. Get your product in front of users as soon as possible.

## 2. Focus on Problem-Solution Fit

Make sure you're solving a real problem that people are willing to pay for.

## 3. Build a Strong Team

Your team is everything. Hire people who are better than you in their areas of expertise.

## 4. Customer Feedback is Gold

Listen to your customers and iterate based on their feedback.

## 5. Don't Scale Too Early

Perfect your product and business model before scaling.

## Conclusion

Building a startup is a marathon, not a sprint. Focus on building something people love.`,
      featuredImage:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
      authorId: mikeAuthor.id,
      categoryId: businessCategory.id,
      status: "published",
      publishedAt: new Date(Date.now() - 172800000), // 2 days ago
      metaTitle: "Building a Successful Tech Startup - Entrepreneur Guide",
      metaDescription:
        "Learn key lessons for building a successful tech startup. Tips on validation, team building, and scaling your business.",
      metaKeywords:
        "startup, entrepreneurship, tech startup, business, scaling",
    },
    {
      title: "TypeScript Best Practices for Large Applications",
      slug: "typescript-best-practices-large-applications",
      excerpt:
        "Essential TypeScript patterns and practices for building maintainable large-scale applications.",
      content: `# TypeScript Best Practices for Large Applications

TypeScript is essential for building large, maintainable applications. Here are the best practices we've learned.

## 1. Strict Type Checking

Always enable strict mode in your TypeScript configuration.

## 2. Use Interfaces and Types Effectively

- Prefer interfaces for object shapes
- Use type aliases for unions and primitives
- Document complex types

## 3. Organize Your Types

Create dedicated type files and barrel exports for better organization.

## 4. Leverage Utility Types

TypeScript provides powerful utility types like \`Partial\`, \`Pick\`, and \`Omit\`.

## 5. Write Type-Safe Code

- Avoid \`any\` at all costs
- Use type guards for runtime type checking
- Implement proper error handling

These practices will help you build robust, type-safe applications that scale.`,
      featuredImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      authorId: johnAuthor.id,
      categoryId: webDevCategory.id,
      status: "draft",
      metaTitle: "TypeScript Best Practices - Large Scale Applications",
      metaDescription:
        "Essential TypeScript patterns and practices for building maintainable large-scale applications.",
      metaKeywords:
        "TypeScript, JavaScript, web development, best practices, large applications",
    },
  ];
};

/**
 * Execute blog posts seeding operation
 */
const execute = async (): Promise<number> => {
  const blogPostData = await getBlogPostData();

  const insertedPosts = await db
    .insert(blogPosts)
    .values(blogPostData)
    .returning();

  return insertedPosts.length;
};

/**
 * Clear blog posts data
 */
const clear = async (): Promise<void> => {
  await db.delete(blogPosts);
};

/**
 * Blog posts seed operation configuration
 */
export const blogPostsSeed: SeedOperation = {
  config: {
    name: "blog-posts",
    order: 4,
    description: "Seed blog posts with references to categories and authors",
  },
  execute,
  clear,
};
