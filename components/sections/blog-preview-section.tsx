"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/utils/analytics";
import { Calendar, Clock, ArrowRight, BookOpen, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  image: string;
  slug: string;
  featured?: boolean;
}

// Mock blog posts data - in real app, this would come from your blog API
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with Next.js 15",
    excerpt:
      "Explore the latest features in Next.js 15 including the new App Router, Server Components, and performance improvements that make building modern web apps easier than ever.",
    category: "Development",
    author: "John Developer",
    publishedAt: "2024-01-15",
    readingTime: 8,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    slug: "building-modern-web-apps-nextjs-15",
    featured: true,
  },
  {
    id: "2",
    title: "TypeScript Best Practices for Large Applications",
    excerpt:
      "Learn advanced TypeScript patterns and best practices that help you build maintainable, scalable applications with better developer experience.",
    category: "TypeScript",
    author: "Sarah Engineer",
    publishedAt: "2024-01-12",
    readingTime: 12,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    slug: "typescript-best-practices-large-applications",
  },
  {
    id: "3",
    title: "Optimizing SEO for Modern React Applications",
    excerpt:
      "Complete guide to implementing SEO best practices in React applications, including server-side rendering, meta tags, and structured data.",
    category: "SEO",
    author: "Mike Marketing",
    publishedAt: "2024-01-10",
    readingTime: 6,
    image:
      "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    slug: "optimizing-seo-react-applications",
  },
];

export function BlogPreviewSection() {
  const handleBlogClick = (postTitle: string, postCategory: string) => {
    trackEvent({
      action: "blog_preview_click",
      category: "engagement",
      label: `${postCategory}: ${postTitle}`,
    });
  };

  const handleViewAllClick = () => {
    trackEvent({
      action: "view_all_blog_click",
      category: "navigation",
      label: "Blog Preview Section",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Development:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      TypeScript:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      SEO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Performance:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-2" />
              Latest Articles
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Learn from Our{" "}
              <span className="text-primary">Expert Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay up-to-date with the latest trends, best practices, and
              tutorials in web development, design, and technology.
            </p>
          </div>

          {/* Featured Post */}
          {blogPosts.find((post) => post.featured) && (
            <div className="mb-16">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Featured Article</h3>
                <p className="text-muted-foreground">
                  Our most popular content this month
                </p>
              </div>

              {(() => {
                const featuredPost = blogPosts.find((post) => post.featured)!;
                return (
                  <Card className="group overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl transition-all duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          width={600}
                          height={400}
                          className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge
                            className={getCategoryColor(featuredPost.category)}
                          >
                            {featuredPost.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-8 flex flex-col justify-center">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                            <Link
                              href={`/blog/${featuredPost.slug}`}
                              onClick={() =>
                                handleBlogClick(
                                  featuredPost.title,
                                  featuredPost.category
                                )
                              }
                            >
                              {featuredPost.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed">
                            {featuredPost.excerpt}
                          </CardDescription>
                        </CardHeader>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {featuredPost.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredPost.publishedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime} min read
                          </div>
                        </div>

                        <Button className="group w-fit" asChild>
                          <Link
                            href={`/blog/${featuredPost.slug}`}
                            onClick={() =>
                              handleBlogClick(
                                featuredPost.title,
                                featuredPost.category
                              )
                            }
                          >
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                );
              })()}
            </div>
          )}

          {/* Recent Articles Grid */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Recent Articles</h3>
              <p className="text-muted-foreground">
                Latest insights and tutorials from our team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts
                .filter((post) => !post.featured)
                .map((post) => (
                  <Card
                    key={post.id}
                    className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            onClick={() =>
                              handleBlogClick(post.title, post.category)
                            }
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-primary hover:text-primary/80"
                          asChild
                        >
                          <Link
                            href={`/blog/${post.slug}`}
                            onClick={() =>
                              handleBlogClick(post.title, post.category)
                            }
                          >
                            Read more →
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="border-dashed bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Want to Read More?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Explore our complete library of articles covering web
                  development, design, and technology trends. New content
                  published weekly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={handleViewAllClick} asChild>
                    <Link href="/blog">
                      View All Articles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">Subscribe to Newsletter</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
