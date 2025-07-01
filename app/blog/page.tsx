import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Blog",
  description:
    "Discover insights, tutorials, and industry trends. Stay updated with our latest articles on technology, design, and digital innovation.",
  keywords: [
    "blog",
    "articles",
    "tutorials",
    "technology",
    "design",
    "insights",
  ],
});

// Dummy blog data - this would typically come from a database or CMS
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15: A Complete Guide",
    slug: "getting-started-nextjs-15",
    excerpt:
      "Learn how to build modern web applications with the latest features in Next.js 15, including the new App Router and Server Components.",
    content: "Full content would be here...",
    featuredImage: "/images/blog/nextjs-guide.jpg",
    category: "Web Development",
    categorySlug: "web-development",
    author: {
      name: "Sarah Chen",
      avatar: "/images/authors/sarah.jpg",
    },
    publishedAt: "2024-01-15",
    readingTime: 8,
    tags: ["Next.js", "React", "JavaScript", "Web Development"],
  },
  {
    id: 2,
    title: "The Future of Web Design: Trends to Watch in 2024",
    slug: "future-web-design-trends-2024",
    excerpt:
      "Explore the latest design trends shaping the digital landscape, from minimalism to interactive experiences and AI-powered design tools.",
    content: "Full content would be here...",
    featuredImage: "/images/blog/design-trends.jpg",
    category: "Design",
    categorySlug: "design",
    author: {
      name: "Michael Rodriguez",
      avatar: "/images/authors/michael.jpg",
    },
    publishedAt: "2024-01-12",
    readingTime: 6,
    tags: ["Design", "UI/UX", "Trends", "2024"],
  },
  {
    id: 3,
    title: "Building Scalable APIs with TypeScript and Node.js",
    slug: "scalable-apis-typescript-nodejs",
    excerpt:
      "Learn best practices for creating robust, type-safe APIs that can handle growth and maintain code quality in enterprise applications.",
    content: "Full content would be here...",
    featuredImage: "/images/blog/typescript-api.jpg",
    category: "Backend Development",
    categorySlug: "backend-development",
    author: {
      name: "Alex Johnson",
      avatar: "/images/authors/alex.jpg",
    },
    publishedAt: "2024-01-10",
    readingTime: 12,
    tags: ["TypeScript", "Node.js", "API", "Backend"],
  },
  {
    id: 4,
    title: "SEO Best Practices for Modern Websites",
    slug: "seo-best-practices-modern-websites",
    excerpt:
      "Optimize your website for search engines with proven strategies, technical SEO improvements, and content optimization techniques.",
    content: "Full content would be here...",
    featuredImage: "/images/blog/seo-guide.jpg",
    category: "SEO",
    categorySlug: "seo",
    author: {
      name: "Emily Watson",
      avatar: "/images/authors/emily.jpg",
    },
    publishedAt: "2024-01-08",
    readingTime: 10,
    tags: ["SEO", "Marketing", "Website Optimization"],
  },
  {
    id: 5,
    title: "React Performance Optimization: Tips and Techniques",
    slug: "react-performance-optimization",
    excerpt:
      "Discover advanced techniques to improve your React application's performance, from code splitting to memoization and virtual DOM optimization.",
    content: "Full content would be here...",
    featuredImage: "/images/blog/react-performance.jpg",
    category: "Web Development",
    categorySlug: "web-development",
    author: {
      name: "Sarah Chen",
      avatar: "/images/authors/sarah.jpg",
    },
    publishedAt: "2024-01-05",
    readingTime: 15,
    tags: ["React", "Performance", "Optimization", "JavaScript"],
  },
  {
    id: 6,
    title: "Database Design Patterns for Modern Applications",
    slug: "database-design-patterns",
    excerpt:
      "Explore essential database design patterns and when to use them for building efficient, scalable data layers in your applications.",
    content: "Full content would be here...",
    featuredImage: "/images/blog/database-patterns.jpg",
    category: "Backend Development",
    categorySlug: "backend-development",
    author: {
      name: "Alex Johnson",
      avatar: "/images/authors/alex.jpg",
    },
    publishedAt: "2024-01-03",
    readingTime: 11,
    tags: ["Database", "Architecture", "Patterns", "SQL"],
  },
];

const categories = [
  { name: "All", slug: "all", count: blogPosts.length },
  { name: "Web Development", slug: "web-development", count: 2 },
  { name: "Design", slug: "design", count: 1 },
  { name: "Backend Development", slug: "backend-development", count: 2 },
  { name: "SEO", slug: "seo", count: 1 },
];

const featuredPost = blogPosts[0];
const otherPosts = blogPosts.slice(1);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      <JsonLd
        type="WebSite"
        data={{
          name: "Blog",
          description:
            "Insights, tutorials, and industry trends in technology and design",
          url: "https://monsoft.com/blog",
        }}
      />

      <div className="flex flex-col gap-12 py-8">
        {/* Header Section */}
        <section className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Our Blog
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Discover insights, tutorials, and industry trends. Stay updated
              with our latest articles on technology, design, and digital
              innovation.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.slug}
                    variant={category.slug === "all" ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary/90"
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Featured Article
            </h2>
            <Separator />
          </div>

          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-full">
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="default">{featuredPost.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(featuredPost.publishedAt)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readingTime} min read
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 hover:text-primary transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h3>

                <p className="text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {featuredPost.author.name}
                    </span>
                  </div>

                  <Button variant="outline" asChild>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Blog Posts Grid */}
        <section className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Latest Articles</h2>
            <Separator />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min
                    </div>
                  </div>

                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>

                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {post.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <section className="container">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="container">
          <Card className="bg-muted/50">
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to get the latest articles and
                insights delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
