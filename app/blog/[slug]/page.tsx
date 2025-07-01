import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ChevronRight,
} from "lucide-react";

// Dummy blog data - this would typically come from a database or CMS
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15: A Complete Guide",
    slug: "getting-started-nextjs-15",
    excerpt:
      "Learn how to build modern web applications with the latest features in Next.js 15, including the new App Router and Server Components.",
    content: `
      <h2>Introduction to Next.js 15</h2>
      <p>Next.js 15 brings exciting new features that revolutionize how we build modern web applications. This comprehensive guide will walk you through everything you need to know to get started with the latest version.</p>
      
      <h2>What's New in Next.js 15</h2>
      <p>The latest version introduces several groundbreaking features that enhance developer experience and application performance:</p>
      
      <h3>1. Enhanced App Router</h3>
      <p>The App Router has been significantly improved with better performance, more intuitive routing patterns, and enhanced developer experience. The new routing system provides:</p>
      <ul>
        <li>Improved performance with optimized bundling</li>
        <li>Better SEO capabilities out of the box</li>
        <li>Enhanced developer experience with better error handling</li>
        <li>Simplified data fetching patterns</li>
      </ul>
      
      <h3>2. Server Components by Default</h3>
      <p>Server Components are now the default in Next.js 15, providing better performance and reduced client-side JavaScript. This approach offers:</p>
      <ul>
        <li>Faster initial page loads</li>
        <li>Reduced bundle sizes</li>
        <li>Better SEO performance</li>
        <li>Improved Core Web Vitals scores</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To create a new Next.js 15 project, run the following command:</p>
      <pre><code>npx create-next-app@latest my-app --typescript --tailwind --eslint</code></pre>
      
      <h2>Key Features to Explore</h2>
      <p>Once you have your project set up, here are the key features you should explore:</p>
      
      <h3>1. File-based Routing</h3>
      <p>Next.js uses a file-based routing system that makes it easy to create pages and API routes. Simply create files in the app directory, and they automatically become routes.</p>
      
      <h3>2. Data Fetching</h3>
      <p>Next.js 15 provides several methods for data fetching, including static generation, server-side rendering, and client-side fetching. Choose the method that best fits your use case.</p>
      
      <h2>Best Practices</h2>
      <p>When working with Next.js 15, keep these best practices in mind:</p>
      <ul>
        <li>Use TypeScript for better developer experience</li>
        <li>Implement proper error boundaries</li>
        <li>Optimize images using the Image component</li>
        <li>Use proper caching strategies</li>
        <li>Implement comprehensive testing</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Next.js 15 represents a significant step forward in React framework development. With its enhanced performance, improved developer experience, and powerful features, it's an excellent choice for building modern web applications.</p>
      
      <p>Start exploring Next.js 15 today and experience the future of web development. The learning curve is gentle, and the benefits are substantial.</p>
    `,
    featuredImage: "/images/blog/nextjs-guide.jpg",
    category: "Web Development",
    categorySlug: "web-development",
    author: {
      name: "Sarah Chen",
      avatar: "/images/authors/sarah.jpg",
      bio: "Sarah is a senior full-stack developer with over 8 years of experience in modern web technologies. She specializes in React, Next.js, and Node.js development.",
      social: {
        twitter: "@sarahchen",
        linkedin: "sarahchen",
        github: "sarahchen",
      },
    },
    publishedAt: "2024-01-15",
    readingTime: 8,
    tags: ["Next.js", "React", "JavaScript", "Web Development"],
    tableOfContents: [
      { id: "introduction", title: "Introduction to Next.js 15", level: 2 },
      { id: "whats-new", title: "What's New in Next.js 15", level: 2 },
      { id: "enhanced-app-router", title: "Enhanced App Router", level: 3 },
      {
        id: "server-components",
        title: "Server Components by Default",
        level: 3,
      },
      { id: "getting-started", title: "Getting Started", level: 2 },
      { id: "key-features", title: "Key Features to Explore", level: 2 },
      { id: "file-based-routing", title: "File-based Routing", level: 3 },
      { id: "data-fetching", title: "Data Fetching", level: 3 },
      { id: "best-practices", title: "Best Practices", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  // Add more posts as needed
];

const relatedPosts = [
  {
    id: 2,
    title: "React Performance Optimization: Tips and Techniques",
    slug: "react-performance-optimization",
    excerpt:
      "Discover advanced techniques to improve your React application's performance.",
    featuredImage: "/images/blog/react-performance.jpg",
    category: "Web Development",
    readingTime: 15,
  },
  {
    id: 3,
    title: "Building Scalable APIs with TypeScript and Node.js",
    slug: "scalable-apis-typescript-nodejs",
    excerpt: "Learn best practices for creating robust, type-safe APIs.",
    featuredImage: "/images/blog/typescript-api.jpg",
    category: "Backend Development",
    readingTime: 12,
  },
  {
    id: 4,
    title: "The Future of Web Design: Trends to Watch in 2024",
    slug: "future-web-design-trends-2024",
    excerpt: "Explore the latest design trends shaping the digital landscape.",
    featuredImage: "/images/blog/design-trends.jpg",
    category: "Design",
    readingTime: 6,
  },
];

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return generateSeoMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    type: "article",
    publishedTime: post.publishedAt,
    authors: [post.author.name],
    url: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        type="Article"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          author: post.author.name,
          url: `/blog/${post.slug}`,
        }}
      />

      <article className="py-8">
        {/* Breadcrumb */}
        <div className="container mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/blog/category/${post.categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {post.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="truncate">{post.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="container mb-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <Badge variant="default" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>

              <Separator orientation="vertical" className="h-8" />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents - Hidden on mobile */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {post.tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm hover:text-primary transition-colors ${
                            item.level === 3 ? "pl-4" : ""
                          }`}
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-2">
              <div
                className="prose prose-lg max-w-none prose-headings:scroll-mt-24"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                      <AvatarFallback>
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        About {post.author.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {post.author.bio}
                      </p>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://twitter.com/${post.author.social.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://linkedin.com/in/${post.author.social.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </main>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Share this article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest articles delivered to your inbox.
                  </p>
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        <section className="container mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card
                key={relatedPost.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={relatedPost.featuredImage}
                    alt={relatedPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="text-xs w-fit mb-2">
                    {relatedPost.category}
                  </Badge>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{relatedPost.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {relatedPost.readingTime} min read
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${relatedPost.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="container mt-16">
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
