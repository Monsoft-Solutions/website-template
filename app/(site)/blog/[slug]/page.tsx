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
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/utils/url.util";

// Import types
import type { BlogPostWithRelations } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.util";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

// Import client components for interactive features
import { BlogPostActions } from "@/components/blog/BlogPostActions";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/api/blog.service";
import { generateSeoMetadata } from "@/lib/config/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return generateSeoMetadata({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }

  const postDateString = post.publishedAt || post.createdAt;

  return generateSeoMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags.map((tag: { name: string }) => tag.name),
    type: "article",
    publishedTime: postDateString.toISOString(),
    authors: [post.author.name],
    url: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  let relatedPosts: BlogPostWithRelations[] = [];

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts (SSR)
  const relatedPostsResponse = await getRelatedBlogPosts(post.id, 3);

  relatedPosts = relatedPostsResponse;

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
                <Badge variant="secondary" asChild>
                  <Link href={`/blog/category/${post.category.slug}`}>
                    {post.category.name}
                  </Link>
                </Badge>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" asChild>
                    <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
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

            {/* Social Sharing - Client Component for Interactivity */}
            <BlogPostActions
              title={post.title}
              url={`${baseUrl}/blog/${post.slug}`}
            />
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
                            asChild
                          >
                            <Link href={`/blog/tag/${tag.slug}`}>
                              {tag.name}
                            </Link>
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
