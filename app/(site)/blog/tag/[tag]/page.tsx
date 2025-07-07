import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/utils/url.util";
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
  Tag,
} from "lucide-react";
import { getBlogPosts } from "@/lib/api/blog.service";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const tagName = tag.replace(/-/g, " ");

  return generateSeoMetadata({
    title: `${tagName} - Blog Tag`,
    description: `Explore all blog posts tagged with ${tagName}. Discover insights, tutorials, and articles related to ${tagName}.`,
    keywords: [tagName, "blog", "articles", "tag", "topics"],
  });
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
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
  let tagInfo: { name: string } | null = null;

  try {
    const blogResponse = await getBlogPosts({
      tagSlug: tag,
      page: currentPage,
      limit: 12,
    });

    blogData = blogResponse;

    // If no posts found, it might be an invalid tag
    if (blogData.posts.length === 0 && currentPage === 1) {
      notFound();
    }

    // Get tag info from the posts (find the tag in any post's tags)
    if (blogData.posts.length > 0) {
      const foundTag = blogData.posts[0].tags.find((t) => t.slug === tag);
      if (foundTag) {
        tagInfo = {
          name: foundTag.name,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
    notFound();
  }

  if (!tagInfo) {
    notFound();
  }

  return (
    <>
      <JsonLd
        type="WebSite"
        data={{
          name: `${tagInfo.name} - Blog Tag`,
          description: `All blog posts tagged with ${tagInfo.name}`,
          url: `${baseUrl}/blog/tag/${tag}`,
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
              <span className="text-foreground">#{tagInfo.name}</span>
            </nav>
          </div>
        </section>

        {/* Header Section */}
        <section className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="size-5 text-muted-foreground" />
              <Badge variant="outline" className="text-base px-3 py-1">
                {tagInfo.name}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              #{tagInfo.name}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Discover all our articles tagged with{" "}
              <strong>{tagInfo.name}</strong>. Find insights, tutorials, and
              expert advice on this topic.
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
                        <Badge variant="secondary" className="text-xs">
                          {post.category.name}
                        </Badge>
                        {post.tags
                          .filter((t) => t.slug !== tag)
                          .slice(0, 1)
                          .map((tagItem) => (
                            <Badge
                              key={tagItem.id}
                              variant="outline"
                              className="text-xs"
                              asChild
                            >
                              <Link href={`/blog/tag/${tagItem.slug}`}>
                                {tagItem.name}
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
                  There are no articles with this tag yet.
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
                    <Link href={`/blog/tag/${tag}?page=${currentPage - 1}`}>
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
                    <Link href={`/blog/tag/${tag}?page=${currentPage + 1}`}>
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
