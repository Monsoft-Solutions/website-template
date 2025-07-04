"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTime: number;
  featuredImage?: string;
  slug: string;
  trending?: boolean;
  likes?: number;
  comments?: number;
}

interface ArticlesGridProps {
  articles: Article[];
  title?: string;
  description?: string;
  showHeader?: boolean;
  className?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -12,
    scale: 1.03,
    transition: {
      duration: 0.3,
    },
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const getCategoryColor = (categoryName: string) => {
  const colors: Record<string, string> = {
    Development: "from-blue-500 to-cyan-500",
    Design: "from-purple-500 to-pink-500",
    Performance: "from-green-500 to-emerald-500",
    Strategy: "from-orange-500 to-red-500",
    Innovation: "from-indigo-500 to-purple-500",
    "AI & ML": "from-teal-500 to-blue-500",
  };
  return colors[categoryName] || "from-gray-500 to-slate-500";
};

export function ArticlesGrid({
  articles,
  title = "Latest Articles",
  description = "Explore our latest articles and insights",
  showHeader = true,
  className = "",
}: ArticlesGridProps) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className={`py-20 ${className}`} ref={ref}>
      <div className="container">
        <motion.div
          className="mx-auto max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          {showHeader && (
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <Badge variant="outline" className="mb-4 px-4 py-2">
                <BookOpen className="w-3 h-3 mr-2" />
                Fresh Perspectives
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  {title.split(" ")[0]}
                </span>{" "}
                {title.split(" ").slice(1).join(" ")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            </motion.div>
          )}

          {/* Articles Grid */}
          <AnimatePresence>
            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
            >
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group perspective-1000"
                  layout
                >
                  <motion.div variants={cardHoverVariants}>
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full">
                      {/* Trending Badge */}
                      {article.trending && (
                        <div className="absolute top-4 left-4 z-20">
                          <Badge className="bg-orange-500 text-white border-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        </div>
                      )}

                      {/* Featured Image */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-[16/10] relative">
                          <Image
                            src={
                              article.featuredImage ||
                              "/images/blog/placeholder.jpg"
                            }
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-4 right-4">
                          <Badge
                            className={`bg-gradient-to-r ${getCategoryColor(
                              article.category.name
                            )} text-white border-0 shadow-lg`}
                            asChild
                          >
                            <Link
                              href={`/blog/category/${article.category.slug}`}
                            >
                              {article.category.name}
                            </Link>
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-xl mb-3 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            <Link href={`/blog/${article.slug}`}>
                              {article.title}
                            </Link>
                          </CardTitle>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {article.excerpt}
                          </p>
                        </CardHeader>

                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            {article.author.avatar ? (
                              <Image
                                src={article.author.avatar}
                                alt={article.author.name}
                                width={16}
                                height={16}
                                className="rounded-full"
                              />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            <span>{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime} min</span>
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        {(article.likes || article.comments) && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                            {article.likes && (
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{article.likes}</span>
                              </div>
                            )}
                            {article.comments && (
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{article.comments}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="group/btn border-0 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                            asChild
                          >
                            <Link href={`/blog/${article.slug}`}>
                              Read More
                              <ArrowRight className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-muted/50"
                          >
                            <Share2 className="w-3 h-3" />
                            <span className="sr-only">Share article</span>
                          </Button>
                        </div>
                      </CardContent>

                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent,white)] dark:bg-grid-slate-700/25 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

                      {/* Morphing Border */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getCategoryColor(
                            article.category.name
                          )} opacity-20`}
                        />
                        <div className="absolute inset-[1px] rounded-xl bg-card" />
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {articles.length === 0 && (
            <motion.div className="text-center py-16" variants={itemVariants}>
              <BookOpen className="mx-auto w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
              <Button variant="outline" asChild>
                <Link href="/blog">View All Articles</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
