"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/utils/analytics";
import {
  Clock,
  Gauge,
  FileText,
  Package,
  Users,
  Star,
  Download,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const stats: Stat[] = [
  {
    label: "Load Time",
    value: 0.8,
    suffix: "s",
    prefix: "<",
    icon: Clock,
    description: "Average page load time",
    color: "text-blue-500",
  },
  {
    label: "Performance Score",
    value: 98,
    suffix: "/100",
    icon: Gauge,
    description: "Google Lighthouse score",
    color: "text-green-500",
  },
  {
    label: "Pre-built Pages",
    value: 8,
    suffix: "+",
    icon: FileText,
    description: "Ready-to-use pages",
    color: "text-purple-500",
  },
  {
    label: "UI Components",
    value: 25,
    suffix: "+",
    icon: Package,
    description: "Reusable components",
    color: "text-orange-500",
  },
  {
    label: "GitHub Stars",
    value: 1200,
    suffix: "+",
    icon: Star,
    description: "Community support",
    color: "text-yellow-500",
  },
  {
    label: "Downloads",
    value: 5400,
    suffix: "+",
    icon: Download,
    description: "Template downloads",
    color: "text-pink-500",
  },
  {
    label: "Active Users",
    value: 890,
    suffix: "+",
    icon: Users,
    description: "Monthly active users",
    color: "text-indigo-500",
  },
  {
    label: "Growth Rate",
    value: 15,
    suffix: "%",
    icon: TrendingUp,
    description: "Monthly growth",
    color: "text-red-500",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const statCardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.8,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
    },
  },
};

// Floating number particles
const FloatingNumber = ({
  number,
  delay,
  index = 0,
}: {
  number: string;
  delay: number;
  index?: number;
}) => {
  const xOffset = (index % 4) * 100 - 150;
  const yOffset = Math.floor(index / 4) * 80 - 40;

  return (
    <motion.div
      className="absolute text-primary/20 font-bold text-sm select-none pointer-events-none"
      initial={{
        opacity: 0,
        scale: 0,
        x: xOffset,
        y: yOffset,
      }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1.2, 0],
        y: [yOffset, yOffset - 80],
        rotate: [0, 180],
        x: [xOffset, xOffset + 30, xOffset - 30, xOffset],
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 6,
      }}
    >
      {number}
    </motion.div>
  );
};

// Enhanced floating particles
const FloatingParticle = ({
  delay = 0,
  duration = 20,
  className = "",
}: {
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    className={`absolute w-3 h-3 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full ${className}`}
    initial={{
      opacity: 0,
      scale: 0,
    }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      rotate: 360,
      x: [0, 150, -150, 0],
      y: [0, -200, 200, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
  />
);

export function StatsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const handleStatClick = (statLabel: string) => {
    trackEvent({
      action: "stat_explore",
      category: "engagement",
      label: statLabel,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Enhanced background with animated gradient and particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 2.5}
            duration={25 + i * 3}
            className={`${
              i % 4 === 0
                ? "top-1/4 left-1/4"
                : i % 4 === 1
                ? "top-1/4 right-1/4"
                : i % 4 === 2
                ? "top-3/4 left-1/4"
                : "top-3/4 right-1/4"
            }`}
          />
        ))}
      </div>

      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/3 left-1/6 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 100, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.4, 1, 1.4],
          x: [0, -100, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
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
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                </motion.div>
                Performance & Growth
              </Badge>
            </motion.div>

            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Numbers That{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Real metrics from our production-ready template, backed by
              community adoption and performance benchmarks.
            </motion.p>
          </motion.div>

          {/* Enhanced Stats Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={statCardVariants}
                  whileHover={{
                    y: -15,
                    scale: 1.05,
                    rotateY: 10,
                    rotateX: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card
                    className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-2xl transition-all duration-500 cursor-pointer h-full"
                    onClick={() => handleStatClick(stat.label)}
                  >
                    {/* Floating numbers background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[
                        stat.value.toString(),
                        stat.suffix,
                        stat.prefix || "",
                      ].map((num, i) => (
                        <FloatingNumber
                          key={i}
                          number={num}
                          delay={index * 0.5 + i * 0.2}
                          index={i}
                        />
                      ))}
                    </div>

                    {/* Enhanced hover gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{ rotate: [0, 2, -2, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />

                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.3, 1],
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
                      <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>

                    <CardContent className="relative p-6 text-center">
                      {/* Animated icon */}
                      <motion.div
                        className="mb-4"
                        whileHover={{
                          scale: 1.3,
                          rotate: 15,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        >
                          <IconComponent
                            className={`h-8 w-8 ${stat.color} mx-auto`}
                          />
                        </motion.div>
                      </motion.div>

                      {/* Enhanced animated counter */}
                      <motion.div
                        className="mb-2"
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                          {stat.prefix && (
                            <span className="text-2xl opacity-80">
                              {stat.prefix}
                            </span>
                          )}
                          {inView && (
                            <CountUp
                              end={stat.value}
                              duration={2.5}
                              delay={index * 0.2}
                              decimals={stat.value < 1 ? 1 : 0}
                              preserveValue
                            />
                          )}
                          <span className="text-2xl opacity-80">
                            {stat.suffix}
                          </span>
                        </div>
                      </motion.div>

                      {/* Enhanced label and description */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                      >
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                          {stat.label}
                        </h3>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {stat.description}
                        </p>
                      </motion.div>

                      {/* Progress indicator */}
                      <motion.div
                        className="mt-4 h-1 bg-border rounded-full overflow-hidden"
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 + 1 }}
                      >
                        <motion.div
                          className={`h-full bg-gradient-to-r from-primary to-accent`}
                          initial={{ x: "-100%" }}
                          animate={inView ? { x: "0%" } : { x: "-100%" }}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.1 + 1.2,
                          }}
                        />
                      </motion.div>
                    </CardContent>

                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-lg transition-colors duration-300"
                      whileHover={{
                        boxShadow: [
                          "0 0 20px rgba(var(--primary), 0.3)",
                          "0 0 40px rgba(var(--primary), 0.1)",
                          "0 0 20px rgba(var(--primary), 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Enhanced bottom section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rounded-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-6"
                >
                  <Zap className="w-16 h-16 text-primary mx-auto" />
                </motion.div>

                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Impressive Performance
                </h3>

                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  These metrics demonstrate our commitment to delivering
                  high-quality, performant solutions that drive real results.
                </p>

                <motion.div
                  className="flex flex-wrap justify-center gap-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  {[
                    "✨ Production Ready",
                    "🚀 Optimized Performance",
                    "📈 Growing Community",
                    "🔧 Continuous Updates",
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-border/50"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={
                        inView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -180 }
                      }
                      transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      {feature}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
