import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, BookOpen, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBlogPostsForPreview } from "@/lib/api/blog.service";
import { BlogPostCard } from "./blog-preview-section/blog-post-card";
import { AnalyticsButton } from "./blog-preview-section/analytics-button";
import {
  formatDate,
  getCategoryColor,
} from "./blog-preview-section/blog-utils";
import type { BlogPostWithRelations } from "@/lib/types";

export async function BlogPreviewSection() {
  let allPosts: BlogPostWithRelations[] = [];

  try {
    // Fetch blog posts from the database
    allPosts = await getBlogPostsForPreview(4); // Get 4 latest posts
  } catch (error) {
    console.error("Failed to fetch blog posts during build:", error);
    // Continue with empty array - better than crashing the build
    allPosts = [];
  }

  // Use the first post as featured, rest as recent
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

  // If no posts available, show empty state
  if (!allPosts.length) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                <BookOpen className="w-3 h-3 mr-2" />
                Coming Soon
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Blog Articles Coming Soon
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We&apos;re working on bringing you the latest insights and
                tutorials. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {featuredPost && (
            <div className="mb-16">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Featured Article</h3>
                <p className="text-muted-foreground">Our latest content</p>
              </div>

              <Card className="group overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl transition-all duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={
                        featuredPost.featuredImage ||
                        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=center"
                      }
                      alt={featuredPost.title}
                      width={600}
                      height={400}
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={getCategoryColor(featuredPost.category.name)}
                      >
                        {featuredPost.category.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-8 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${featuredPost.slug}`}>
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
                        {featuredPost.author.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredPost.publishedAt!)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readingTime} min read
                      </div>
                    </div>

                    <AnalyticsButton
                      href={`/blog/${featuredPost.slug}`}
                      postTitle={featuredPost.title}
                      postCategory={featuredPost.category.name}
                      variant="default"
                      className="group w-fit"
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </AnalyticsButton>
                  </CardContent>
                </div>
              </Card>
            </div>
          )}

          {/* Recent Articles Grid */}
          {recentPosts.length > 0 && (
            <div className="mb-16">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Recent Articles</h3>
                <p className="text-muted-foreground">
                  Latest insights and tutorials from our team
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

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
                  <AnalyticsButton
                    href="/blog"
                    postTitle="View All Articles"
                    postCategory="Blog Preview Section"
                    size="lg"
                    isViewAllButton
                  >
                    View All Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </AnalyticsButton>
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
