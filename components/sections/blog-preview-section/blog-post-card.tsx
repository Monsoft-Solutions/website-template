"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPostWithRelations } from "@/lib/types";
import { AnalyticsButton } from "./analytics-button";
import { formatDate, getCategoryColor } from "./blog-utils";

interface BlogPostCardProps {
  post: BlogPostWithRelations;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={
            post.featuredImage ||
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop&crop=center"
          }
          alt={post.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getCategoryColor(post.category.name)}>
            {post.category.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </CardDescription>
        </CardHeader>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {post.author.name}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt!)}
          </span>
          <AnalyticsButton
            href={`/blog/${post.slug}`}
            postTitle={post.title}
            postCategory={post.category.name}
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-primary hover:text-primary/80"
          >
            Read more →
          </AnalyticsButton>
        </div>
      </CardContent>
    </Card>
  );
}
