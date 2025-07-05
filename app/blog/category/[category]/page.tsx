import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { clientEnv } from "@/lib/env-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import type { BlogListResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.util";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return clientEnv.NEXT_PUBLIC_SITE_URL;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = category.replace(/-/g, " ");

  return generateSeoMetadata({
    title: `${categoryName} - Blog Category`,
    description: `Explore all blog posts in the ${categoryName} category. Discover insights, tutorials, and articles about ${categoryName}.`,
    keywords: [categoryName, "blog", "articles", "category"],
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const baseUrl = getBaseUrl();

  // Initialize with fallback data
  let blogData: BlogListResponse = {
    posts: [],
    totalPages: 0,
    totalPosts: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let categoryInfo: { name: string; description?: string } | null = null;

  try {
    // Get blog posts for this category
    const blogResponse = await fetch(
      `${baseUrl}/api/blog/posts?categorySlug=${category}&page=${currentPage}&limit=12`
    );

    if (!blogResponse.ok) {
      throw new Error(`Failed to fetch blog posts: ${blogResponse.statusText}`);
    }

    const blogResponseData = await blogResponse.json();

    if (!blogResponseData.success) {
      throw new Error("Failed to fetch blog data");
    }

    blogData = blogResponseData.data;

    // If no posts found, it might be an invalid category
    if (blogData.posts.length === 0 && currentPage === 1) {
      notFound();
    }

    // Get category info from the first post (if available)
    if (blogData.posts.length > 0) {
      categoryInfo = {
        name: blogData.posts[0].category.name,
        description: blogData.posts[0].category.description || undefined,
      };
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
    notFound();
  }

  if (!categoryInfo) {
    notFound();
  }

  return (
    <>
      <JsonLd
        type="WebSite"
        data={{
          name: `${categoryInfo.name} - Blog Category`,
          description:
            categoryInfo.description ||
            `All blog posts in the ${categoryInfo.name} category`,
          url: `${baseUrl}/blog/category/${category}`,
        }}
      />

      <div className="flex flex-col gap-12 py-8">
        {/* Breadcrumb Navigation */}
        <section className="container">
          <div className="mx-auto max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="size-4" />
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <ChevronRight className="size-4" />
              <span className="text-foreground">{categoryInfo.name}</span>
            </nav>
          </div>
        </section>

        {/* Header Section */}
        <section className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              {categoryInfo.name}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {categoryInfo.name} Articles
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {categoryInfo.description ||
                `Discover all our articles about ${categoryInfo.name}. Find insights, tutorials, and expert advice.`}
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              {blogData.totalPosts}{" "}
              {blogData.totalPosts === 1 ? "article" : "articles"} found
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="container">
          <div className="mx-auto max-w-6xl">
            {blogData.posts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogData.posts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={
                          post.featuredImage || "/images/blog/placeholder.jpg"
                        }
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs"
                            asChild
                          >
                            <Link href={`/blog/tag/${tag.slug}`}>
                              {tag.name}
                            </Link>
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
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground">
                  There are no articles in this category yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/blog">Browse All Articles</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Pagination Section */}
        {blogData.totalPages > 1 && (
          <section className="container">
            <div className="mx-auto max-w-4xl">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!blogData.hasPreviousPage}
                  asChild={blogData.hasPreviousPage}
                >
                  {blogData.hasPreviousPage ? (
                    <Link
                      href={`/blog/category/${category}?page=${
                        currentPage - 1
                      }`}
                    >
                      Previous
                    </Link>
                  ) : (
                    <span>Previous</span>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {blogData.currentPage} of {blogData.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!blogData.hasNextPage}
                  asChild={blogData.hasNextPage}
                >
                  {blogData.hasNextPage ? (
                    <Link
                      href={`/blog/category/${category}?page=${
                        currentPage + 1
                      }`}
                    >
                      Next
                    </Link>
                  ) : (
                    <span>Next</span>
                  )}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <section className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Button variant="ghost" asChild>
              <Link href="/blog">← Back to All Articles</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
