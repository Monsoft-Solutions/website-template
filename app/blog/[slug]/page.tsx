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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/markdown";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
// Import types for API responses
import type { BlogPostWithRelations } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.util";
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

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Helper function to get the base URL for API calls during SSR
function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // Browser should use relative URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
  return "http://localhost:3000"; // Local development
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/api/blog/posts/${encodeURIComponent(slug)}`
    );
    if (!response.ok) {
      return generateSeoMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    const result = await response.json();
    if (!result.success) {
      return generateSeoMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    const post = result.data;

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return generateSeoMetadata({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags.map((tag: { name: string }) => tag.name),
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      authors: [post.author.name],
      url: `/blog/${post.slug}`,
    });
  } catch (error) {
    console.error("Error fetching blog post for metadata:", error);
    return generateSeoMetadata({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  let post: BlogPostWithRelations | null = null;
  let relatedPosts: BlogPostWithRelations[] = [];

  try {
    // Fetch the blog post
    const postResponse = await fetch(
      `${baseUrl}/api/blog/posts/${encodeURIComponent(slug)}`
    );

    if (postResponse.status === 404) {
      notFound();
    }

    if (!postResponse.ok) {
      throw new Error(`Failed to fetch blog post: ${postResponse.statusText}`);
    }

    const postResult = await postResponse.json();
    if (!postResult.success) {
      throw new Error("Failed to fetch blog post");
    }

    post = postResult.data;

    // Fetch related posts
    const relatedResponse = await fetch(
      `${baseUrl}/api/blog/posts/${encodeURIComponent(slug)}/related?limit=3`
    );

    if (relatedResponse.ok) {
      const relatedResult = await relatedResponse.json();
      if (relatedResult.success) {
        relatedPosts = relatedResult.data;
      }
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }

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
          author: {
            "@type": "Person",
            name: post.author.name,
          },
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt,
          image: post.featuredImage,
          publisher: {
            "@type": "Organization",
            name: "Monsoft Solutions",
          },
        }}
      />

      <div className="flex flex-col gap-8 py-8">
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
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="hover:text-foreground"
              >
                {post.category.name}
              </Link>
              <ChevronRight className="size-4" />
              <span className="text-foreground">{post.title}</span>
            </nav>

            <Button variant="ghost" asChild className="mb-8 -ml-4">
              <Link href="/blog">
                <ArrowLeft className="mr-2 size-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Article Header */}
        <section className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary">{post.category.name}</Badge>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={post.author.avatarUrl || undefined} />
                    <AvatarFallback>
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>By {post.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-[2/1] relative rounded-lg overflow-hidden mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Social Sharing */}
            <div className="flex items-center justify-between mb-8 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Share2 className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Share this article</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Twitter className="size-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Facebook className="size-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Linkedin className="size-4" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Copy className="size-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="prose prose-lg max-w-none">
                  <Markdown content={post.content} />
                </div>

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ThumbsUp className="size-4" />
                        Helpful
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Bookmark className="size-4" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="size-4" />
                        Discuss
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {formatDate(post.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Author Info */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={post.author.avatarUrl || undefined}
                          />
                          <AvatarFallback>
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm">
                            {post.author.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Author
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    {post.author.bio && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {post.author.bio}
                        </p>
                      </CardContent>
                    )}
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Related Articles</h2>
                <p className="text-muted-foreground">
                  More articles from the {post.category.name} category
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={
                          relatedPost.featuredImage ||
                          "/images/blog/placeholder.jpg"
                        }
                        alt={relatedPost.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {relatedPost.category.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {relatedPost.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {relatedPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="size-3" />
                          <span className="text-xs">
                            {relatedPost.readingTime} min
                          </span>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/blog/${relatedPost.slug}`}>
                            Read More
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="container">
          <div className="mx-auto max-w-4xl">
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Stay Updated with Our Latest Articles
                </h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to our newsletter to receive the latest insights and
                  tutorials directly in your inbox.
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
