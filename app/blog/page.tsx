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
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
// Import types for API responses
import type { BlogPostWithRelations, BlogListResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.util";
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

// Helper function to get the base URL for API calls during SSR
function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // Browser should use relative URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
  return "http://localhost:3000"; // Local development
}

export default async function BlogPage() {
  const baseUrl = getBaseUrl();

  // Initialize with fallback data
  let blogPosts: BlogPostWithRelations[] = [];
  let categories: Array<{ name: string; slug: string; count: number }> = [];
  let blogData: BlogListResponse = {
    posts: [],
    totalPages: 0,
    totalPosts: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  try {
    // Get blog posts and categories from the API
    const [blogResponse, categoriesResponse] = await Promise.all([
      fetch(`${baseUrl}/api/blog/posts?limit=20`),
      fetch(`${baseUrl}/api/blog/categories`),
    ]);

    if (!blogResponse.ok) {
      throw new Error(`Failed to fetch blog posts: ${blogResponse.statusText}`);
    }

    if (!categoriesResponse.ok) {
      throw new Error(
        `Failed to fetch categories: ${categoriesResponse.statusText}`
      );
    }

    const blogResponseData = await blogResponse.json();
    const categoriesResponseData = await categoriesResponse.json();

    if (!blogResponseData.success || !categoriesResponseData.success) {
      throw new Error("Failed to fetch blog data");
    }

    blogData = blogResponseData.data;
    blogPosts = blogData.posts;
    categories = categoriesResponseData.data.map(
      (c: { category: { name: string; slug: string }; postCount: number }) => ({
        name: c.category.name,
        slug: c.category.slug,
        count: c.postCount,
      })
    );
  } catch (error) {
    console.error("Error fetching blog data:", error);
    // Fallback data is already set above
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

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
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Categories:
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.slug}
                      variant={
                        category.slug === "all" ? "default" : "secondary"
                      }
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {category.name} ({category.count})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post Section */}
        {featuredPost && (
          <section className="container">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="size-4" />
                  <span>Featured Article</span>
                </div>
                <h2 className="text-2xl font-bold">Latest Insights</h2>
              </div>

              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={
                          featuredPost.featuredImage ||
                          "/images/blog/placeholder.jpg"
                        }
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/5 md:flex md:flex-col">
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="secondary">
                          {featuredPost.category.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl">
                        {featuredPost.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {featuredPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="size-4" />
                            <span>{featuredPost.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            <span>
                              {formatDate(
                                featuredPost.publishedAt ||
                                  featuredPost.createdAt
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            <span>{featuredPost.readingTime} min read</span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/blog/${featuredPost.slug}`}>
                            Read More
                            <ArrowRight className="ml-2 size-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Recent Articles</h2>
              <p className="text-muted-foreground">
                Explore our latest articles and insights
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={post.featuredImage || "/images/blog/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category.name}
                      </Badge>
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="size-3" />
                          <span className="text-xs">{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span className="text-xs">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span className="text-xs">
                            {post.readingTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show message if no posts */}
            {blogPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No blog posts found
                </h3>
                <p className="text-muted-foreground">
                  Check back later for new articles and insights.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pagination Section */}
        {blogData.totalPages > 1 && (
          <section className="container">
            <div className="mx-auto max-w-4xl">
              <div className="flex justify-center items-center gap-2">
                <Button variant="outline" disabled={!blogData.hasPreviousPage}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {blogData.currentPage} of {blogData.totalPages}
                </span>
                <Button variant="outline" disabled={!blogData.hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="container">
          <div className="mx-auto max-w-4xl">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Stay Updated with Our Latest Content
                </h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to our newsletter to receive the latest articles,
                  tutorials, and industry insights directly in your inbox.
                </p>
                <Button asChild>
                  <Link href="/contact">Subscribe Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
