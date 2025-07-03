"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/utils/analytics";
import {
  Code,
  Search,
  Zap,
  Database,
  BarChart3,
  Palette,
  Shield,
  Smartphone,
  Check,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  category: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Next.js 15 Ready",
    description:
      "Built with the latest Next.js features and best practices for maximum performance",
    benefits: ["App Router", "Server Components", "TypeScript"],
    category: "Technical",
    color: "text-yellow-500",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description:
      "Advanced SEO with dynamic metadata, sitemaps, and structured data",
    benefits: ["Dynamic Metadata", "JSON-LD Support", "Auto Sitemaps"],
    category: "SEO",
    color: "text-blue-500",
  },
  {
    icon: Code,
    title: "Modern UI",
    description:
      "Beautiful, accessible components with Tailwind CSS and shadcn/ui",
    benefits: ["Shadcn/ui", "Dark Mode", "Responsive"],
    category: "UI/UX",
    color: "text-purple-500",
  },
  {
    icon: Database,
    title: "Database Ready",
    description:
      "PostgreSQL with Drizzle ORM for type-safe database operations",
    benefits: ["Drizzle ORM", "Migrations", "Type Safety"],
    category: "Technical",
    color: "text-green-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Built-in",
    description:
      "Google Analytics 4 with comprehensive event tracking and performance monitoring",
    benefits: ["GA4 Integration", "Event Tracking", "Performance Metrics"],
    category: "Analytics",
    color: "text-orange-500",
  },
  {
    icon: Palette,
    title: "Blog System",
    description:
      "Full-featured blog with categories, tags, search, and content management",
    benefits: ["Dynamic Routing", "Full-text Search", "Content Management"],
    category: "Features",
    color: "text-pink-500",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description:
      "Security best practices, form validation, and error handling built-in",
    benefits: ["Form Validation", "Error Boundaries", "Security Headers"],
    category: "Technical",
    color: "text-red-500",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "Responsive design with touch-friendly interfaces and optimal mobile experience",
    benefits: ["Touch Optimized", "Progressive Enhancement", "Fast Loading"],
    category: "UI/UX",
    color: "text-indigo-500",
  },
];

const categories = [
  "All",
  "Technical",
  "SEO",
  "UI/UX",
  "Analytics",
  "Features",
];

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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.8,
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

const categoryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// Floating particles for background
const FloatingIcon = ({
  icon: Icon,
  delay = 0,
  duration = 15,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{
      opacity: 0,
      scale: 0,
    }}
    animate={{
      opacity: [0, 0.1, 0],
      scale: [0, 1, 0],
      rotate: 360,
      x: [0, 100, -100, 0],
      y: [0, -100, 100, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
  >
    <Icon className="w-8 h-8 text-primary/20" />
  </motion.div>
);

export function FeaturesSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleFeatureClick = (featureTitle: string, category: string) => {
    trackEvent({
      action: "feature_explore",
      category: "engagement",
      label: `${category}: ${featureTitle}`,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Enhanced Background with floating icons */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30" />

      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {features.slice(0, 6).map((feature, index) => (
          <FloatingIcon
            key={index}
            icon={feature.icon}
            delay={index * 2}
            duration={20 + index * 2}
            className={`${
              index % 3 === 0
                ? "top-1/4 left-1/4"
                : index % 3 === 1
                ? "top-3/4 right-1/4"
                : "top-1/2 left-3/4"
            }`}
          />
        ))}
      </div>

      {/* Animated background gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container relative z-10">
        <div className="mx-auto max-w-7xl">
          {/* Enhanced Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="mb-4 px-4 py-2 bg-background/80 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                </motion.div>
                Features & Capabilities
              </Badge>
            </motion.div>

            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Everything You Need to Build{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Modern Websites
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our template includes all the essential features and tools you
              need to create professional, high-performance websites with
              minimal setup.
            </motion.p>
          </motion.div>

          {/* Enhanced Category Filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {categories.map((category) => (
              <motion.div
                key={category}
                variants={categoryVariants}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer transition-all duration-300 hover:shadow-md"
                >
                  {category}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={cardVariants}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card
                    className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-xl transition-all duration-500 cursor-pointer h-full"
                    onClick={() =>
                      handleFeatureClick(feature.title, feature.category)
                    }
                  >
                    {/* Enhanced Hover Gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      animate={{ rotate: [0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />

                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: { duration: 2, repeat: Infinity },
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                    </motion.div>

                    <CardHeader className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <motion.div
                          whileHover={{
                            scale: 1.2,
                            rotate: 10,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IconComponent
                            className={`h-10 w-10 ${feature.color} transition-all duration-300`}
                          />
                        </motion.div>
                        <Badge
                          variant="outline"
                          className="text-xs bg-background/50 backdrop-blur-sm"
                        >
                          {feature.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative">
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <motion.li
                            key={benefit}
                            className="flex items-center gap-2 text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1 + benefitIndex * 0.05,
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            </motion.div>
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {benefit}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Feature exploration hint */}
                      <motion.div
                        className="mt-4 text-xs text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                      >
                        Click to explore →
                      </motion.div>
                    </CardContent>

                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-lg transition-colors duration-300"
                      whileHover={{
                        boxShadow: "0 0 20px rgba(var(--primary), 0.3)",
                      }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Enhanced Call-to-Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rounded-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Explore all features in our interactive demo
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-primary font-medium cursor-pointer"
                >
                  View Live Demo →
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
