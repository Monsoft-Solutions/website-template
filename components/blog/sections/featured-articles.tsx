"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Star,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FeaturedArticle {
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
  featured?: boolean;
  trending?: boolean;
}

interface FeaturedArticlesProps {
  articles: FeaturedArticle[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
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
      duration: 0.6,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
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

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const featuredArticle =
    articles.find((article) => article.featured) || articles[0];
  const otherArticles = articles
    .filter((article) => article.id !== featuredArticle?.id)
    .slice(0, 4);

  return (
    <section
      className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/30"
      ref={ref}
    >
      <div className="container">
        <motion.div
          className="mx-auto max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Star className="w-3 h-3 mr-2" />
              Handpicked Excellence
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Featured
              </span>{" "}
              Articles
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our editorial team curates the most impactful content to
              accelerate your growth and keep you ahead of the curve.
            </p>
          </motion.div>

          {featuredArticle && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Main Featured Article */}
              <motion.div
                className="lg:col-span-2"
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-2xl transition-shadow duration-500"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-30" />

                  {/* Content */}
                  <div className="relative z-10 p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[400px]">
                      {/* Text Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <Badge className="bg-primary text-primary-foreground">
                            {featuredArticle.category.name}
                          </Badge>
                          {featuredArticle.trending && (
                            <Badge
                              variant="outline"
                              className="border-orange-500 text-orange-600"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                          <Link href={`/blog/${featuredArticle.slug}`}>
                            {featuredArticle.title}
                          </Link>
                        </h3>

                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                          {featuredArticle.excerpt}
                        </p>

                        {/* Author & Meta */}
                        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {featuredArticle.author.avatar ? (
                              <Image
                                src={featuredArticle.author.avatar}
                                alt={featuredArticle.author.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span>{featuredArticle.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(featuredArticle.publishedAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{featuredArticle.readingTime} min</span>
                          </div>
                        </div>

                        <Button asChild size="lg" className="group/btn">
                          <Link href={`/blog/${featuredArticle.slug}`}>
                            Read Article
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>

                      {/* Image */}
                      <div className="relative">
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                          <Image
                            src={
                              featuredArticle.featuredImage ||
                              "/images/blog/placeholder.jpg"
                            }
                            alt={featuredArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4">
                          <motion.div
                            className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Bookmark className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Side Articles */}
              <motion.div className="space-y-6" variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4">More Featured</h3>
                {otherArticles.slice(0, 3).map((article) => (
                  <motion.div
                    key={article.id}
                    className="group"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="aspect-square w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                article.featuredImage ||
                                "/images/blog/placeholder.jpg"
                              }
                              alt={article.title}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge variant="outline" className="text-xs mb-2">
                              {article.category.name}
                            </Badge>
                            <h4 className="font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              <Link href={`/blog/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{article.readingTime} min</span>
                              <span>•</span>
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* View All Button */}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/blog">
                    View All Articles
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
