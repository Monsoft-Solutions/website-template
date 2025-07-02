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
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogFilters } from "@/components/blog/BlogFilters";
// Import types for API responses
import type { BlogPostWithRelations, BlogListResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.util";
import { Calendar, Clock, User, BookOpen, ArrowRight } from "lucide-react";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

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

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const currentCategory = params.category || "all";
  const currentSearch = params.search || "";
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
    // Build API URL with search parameters
    const apiParams = new URLSearchParams();
    apiParams.set("limit", "12");
    apiParams.set("page", currentPage.toString());

    if (currentCategory && currentCategory !== "all") {
      apiParams.set("categorySlug", currentCategory);
    }

    if (currentSearch) {
      apiParams.set("searchQuery", currentSearch);
    }

    // Get blog posts and categories from the API
    const [blogResponse, categoriesResponse] = await Promise.all([
      fetch(`${baseUrl}/api/blog/posts?${apiParams.toString()}`),
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
            {(currentSearch || currentCategory !== "all") && (
              <div className="mt-4 text-sm text-muted-foreground">
                {blogData.totalPosts === 0
                  ? "No results found"
                  : `${blogData.totalPosts} ${
                      blogData.totalPosts === 1 ? "result" : "results"
                    } found`}
              </div>
            )}
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="container">
          <div className="mx-auto max-w-6xl">
            <BlogFilters
              categories={categories}
              currentCategory={currentCategory}
              currentSearch={currentSearch}
              currentPage={currentPage}
              totalPages={blogData.totalPages}
            />
          </div>
        </section>

        {/* Featured Post Section */}
        {featuredPost &&
          currentPage === 1 &&
          !currentSearch &&
          currentCategory === "all" && (
            <section className="container">
              <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Featured Article</h2>
                  <p className="text-muted-foreground">
                    Our latest and most popular content
                  </p>
                </div>
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-[4/3] md:aspect-auto relative">
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
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">
                          {featuredPost.category.name}
                        </Badge>
                        {featuredPost.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="outline" asChild>
                            <Link href={`/blog/tag/${tag.slug}`}>
                              {tag.name}
                            </Link>
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 line-clamp-2">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                          <User className="size-3" />
                          <span>{featuredPost.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>
                            {formatDate(
                              featuredPost.publishedAt || featuredPost.createdAt
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{featuredPost.readingTime} min</span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 size-4" />
                        </Link>
                      </Button>
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
              <h2 className="text-2xl font-bold">
                {featuredPost &&
                currentPage === 1 &&
                !currentSearch &&
                currentCategory === "all"
                  ? "Recent Articles"
                  : "Articles"}
              </h2>
              <p className="text-muted-foreground">
                {currentSearch
                  ? `Search results for "${currentSearch}"`
                  : currentCategory !== "all"
                  ? `Articles in ${
                      categories.find((c) => c.slug === currentCategory)
                        ?.name || currentCategory
                    }`
                  : "Explore our latest articles and insights"}
              </p>
            </div>

            {(featuredPost &&
            currentPage === 1 &&
            !currentSearch &&
            currentCategory === "all"
              ? otherPosts
              : blogPosts
            ).length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(featuredPost &&
                currentPage === 1 &&
                !currentSearch &&
                currentCategory === "all"
                  ? otherPosts
                  : blogPosts
                ).map((post) => (
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
                        <Badge variant="secondary" className="text-xs" asChild>
                          <Link href={`/blog/category/${post.category.slug}`}>
                            {post.category.name}
                          </Link>
                        </Badge>
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
                  {currentSearch || currentCategory !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Check back later for new articles and insights."}
                </p>
                {(currentSearch || currentCategory !== "all") && (
                  <Button asChild className="mt-4" variant="outline">
                    <Link href="/blog">View All Articles</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

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
