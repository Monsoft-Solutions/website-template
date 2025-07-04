"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Palette,
  Zap,
  Target,
  Rocket,
  Brain,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  count: number;
  description: string;
  color: string;
  icon: string;
  trending?: boolean;
}

interface CategoryHubProps {
  categories: Category[];
}

// Icon mapping
const iconMap = {
  code: Code,
  palette: Palette,
  zap: Zap,
  target: Target,
  rocket: Rocket,
  brain: Brain,
  layers: Layers,
};

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
    y: 30,
    scale: 0.9,
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
    y: -8,
    scale: 1.05,
    rotateY: 5,
    transition: {
      duration: 0.3,
    },
  },
};

// Default categories if none provided
const defaultCategories: Category[] = [
  {
    name: "Development",
    slug: "development",
    count: 45,
    description: "Code tutorials, frameworks, and best practices",
    color: "from-blue-500 to-cyan-500",
    icon: "code",
    trending: true,
  },
  {
    name: "Design",
    slug: "design",
    count: 32,
    description: "UI/UX, visual design, and creative workflows",
    color: "from-purple-500 to-pink-500",
    icon: "palette",
  },
  {
    name: "Performance",
    slug: "performance",
    count: 28,
    description: "Optimization, speed, and efficiency techniques",
    color: "from-green-500 to-emerald-500",
    icon: "zap",
  },
  {
    name: "Strategy",
    slug: "strategy",
    count: 24,
    description: "Business insights and growth strategies",
    color: "from-orange-500 to-red-500",
    icon: "target",
  },
  {
    name: "Innovation",
    slug: "innovation",
    count: 19,
    description: "Emerging tech and future trends",
    color: "from-indigo-500 to-purple-500",
    icon: "rocket",
    trending: true,
  },
  {
    name: "AI & ML",
    slug: "ai-ml",
    count: 15,
    description: "Artificial intelligence and machine learning",
    color: "from-teal-500 to-blue-500",
    icon: "brain",
  },
];

export function CategoryHub({
  categories = defaultCategories,
}: CategoryHubProps) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-background"
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
              <Layers className="w-3 h-3 mr-2" />
              Explore by Passion
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Category
              </span>{" "}
              Discovery Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find your niche with our expertly organized content categories.
              Each section is crafted to deliver maximum value and actionable
              insights.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
          >
            {categories.map((category) => {
              const IconComponent =
                iconMap[category.icon as keyof typeof iconMap] || Code;

              return (
                <motion.div
                  key={category.slug}
                  variants={itemVariants}
                  whileHover="hover"
                  className="perspective-1000"
                >
                  <motion.div variants={cardHoverVariants}>
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                      />

                      <CardContent className="relative z-10 p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`p-3 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {category.count}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Articles
                            </div>
                            {category.trending && (
                              <Badge
                                variant="outline"
                                className="mt-1 text-xs border-orange-500 text-orange-600"
                              >
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            <Link href={`/blog/category/${category.slug}`}>
                              {category.name}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {category.description}
                          </p>
                        </div>

                        {/* CTA */}
                        <Button
                          variant="outline"
                          className="w-full group/btn border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                          asChild
                        >
                          <Link href={`/blog/category/${category.slug}`}>
                            Explore {category.name}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>

                      {/* Morphing Border Effect */}
                      <div className="absolute inset-0 rounded-xl">
                        <div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                        />
                        <div className="absolute inset-[1px] rounded-xl bg-card" />
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div className="text-center" variants={itemVariants}>
            <Card className="border-dashed border-2 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-2">
                  Can&apos;t Find What You&apos;re Looking For?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explore our complete collection of articles or use our
                  powerful search to find exactly what you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="group">
                    <Link href="/blog">
                      Browse All Articles
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/blog?search=">Advanced Search</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
