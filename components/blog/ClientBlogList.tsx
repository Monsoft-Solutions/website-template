"use client";

import { useState } from "react";
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
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils/date.util";
import { useBlogPosts } from "@/lib/hooks";
import type { BlogListOptions } from "@/lib/types";

interface BlogListProps {
  initialOptions?: BlogListOptions;
}

export function ClientBlogList({ initialOptions = {} }: BlogListProps) {
  const [options, setOptions] = useState<BlogListOptions>(initialOptions);
  const { data, isLoading, error } = useBlogPosts(options);
  const [searchQuery, setSearchQuery] = useState(
    initialOptions.searchQuery || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOptions((prev) => ({ ...prev, searchQuery, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    setOptions((prev) => ({ ...prev, categorySlug, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-muted-foreground">No blog posts found.</p>
        {options.searchQuery && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              setOptions((prev) => ({
                ...prev,
                searchQuery: undefined,
                page: 1,
              }))
            }
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blog posts..."
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {/* Blog posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            {post.featuredImage && (
              <div className="aspect-video relative w-full overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-all hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt?.toString() || ""}>
                  {post.publishedAt
                    ? formatDate(post.publishedAt)
                    : "Not published"}
                </time>
                <span className="text-muted-foreground">•</span>
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <CardTitle className="line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                {post.category && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleCategoryChange(post.category.slug)}
                  >
                    {post.category.name}
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <Button
                  asChild
                  variant="ghost"
                  className="group p-0 text-primary"
                >
                  <Link href={`/blog/${post.slug}`}>
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(data.currentPage - 1)}
            disabled={!data.hasPreviousPage}
          >
            Previous
          </Button>

          {[...Array(data.totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={i + 1 === data.currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(data.currentPage + 1)}
            disabled={!data.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
