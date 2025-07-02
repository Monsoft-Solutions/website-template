"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/markdown";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { formatDate } from "@/lib/utils/date.util";
import { useBlogPost } from "@/lib/hooks";
import type { BlogPostWithRelations } from "@/lib/types";

interface ClientBlogPostProps {
  slug: string;
}

export function ClientBlogPost({ slug }: ClientBlogPostProps) {
  const router = useRouter();
  const { data: post, isLoading, error, getRelatedPosts } = useBlogPost(slug);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostWithRelations[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    async function loadRelatedPosts() {
      if (post) {
        setLoadingRelated(true);
        try {
          const related = await getRelatedPosts(3);
          setRelatedPosts(related);
        } catch (error) {
          console.error("Failed to load related posts", error);
        } finally {
          setLoadingRelated(false);
        }
      }
    }

    loadRelatedPosts();
  }, [post, getRelatedPosts]);

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-muted-foreground">Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-red-500">Error: {error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-muted-foreground">Blog post not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Back button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="group flex items-center gap-2 p-0 text-primary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to blog
        </Button>
      </div>

      {/* Post header */}
      <div className="mb-8">
        {post.featuredImage && (
          <div className="aspect-video relative mb-8 w-full overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              priority
            />
          </div>
        )}

        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishedAt?.toString() || ""}>
              {post.publishedAt
                ? formatDate(post.publishedAt)
                : "Not published"}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author.name}</span>
          </div>
          {post.category && (
            <Link href={`/blog/category/${post.category.slug}`} passHref>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {post.category.name}
              </Badge>
            </Link>
          )}
        </div>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}
      </div>

      {/* Post content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown content={post.content} />
      </div>

      {/* Author bio */}
      {post.author && (
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="mb-4 text-2xl font-bold">About the Author</h2>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {post.author.avatarUrl && (
                <AvatarImage
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                />
              )}
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{post.author.name}</h3>
              {post.author.bio && (
                <p className="text-muted-foreground">{post.author.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-2 text-lg font-semibold">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`} passHref>
                <Badge variant="outline" className="hover:bg-secondary">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <Card
                key={related.id}
                className="overflow-hidden hover:shadow-md"
              >
                {related.featuredImage && (
                  <div className="aspect-video relative w-full overflow-hidden">
                    <Image
                      src={related.featuredImage}
                      alt={related.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link
                      href={`/blog/${related.slug}`}
                      className="hover:underline"
                    >
                      {related.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {related.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={related.publishedAt?.toString() || ""}>
                      {related.publishedAt
                        ? formatDate(related.publishedAt)
                        : "Not published"}
                    </time>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {loadingRelated && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Loading related posts...</p>
        </div>
      )}
    </div>
  );
}
