"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Search } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Floating particles for visual interest
const FloatingParticle = ({
  delay = 0,
  duration = 20,
  initialX = 0,
  initialY = 0,
}: {
  delay?: number;
  duration?: number;
  initialX?: number;
  initialY?: number;
}) => (
  <motion.div
    className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full"
    initial={{
      opacity: 0,
      x: initialX,
      y: initialY,
      scale: 0,
    }}
    animate={{
      opacity: [0, 1, 0],
      y: initialY - 300,
      x: [initialX, initialX + 50, initialX - 30, initialX],
      scale: [0, 1, 0.5, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  />
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
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

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

interface BlogHeroProps {
  totalPosts?: number;
  totalAuthors?: number;
  totalReads?: number;
}

export function BlogHero({
  totalPosts = 150,
  totalAuthors = 25,
  totalReads = 50000,
}: BlogHeroProps) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, -150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -75]);

  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Animated Background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.3))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.3))]" />

        {/* Floating Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 3}
            duration={25 + i * 2}
            initialX={Math.random() * 100}
            initialY={600 + Math.random() * 200}
          />
        ))}
      </div>

      <div className="container relative z-10" ref={ref}>
        <motion.div
          className="mx-auto max-w-4xl text-center"
          style={{ y: contentY }}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 border-primary/30 bg-background/80 backdrop-blur-sm"
            >
              <BookOpen className="w-3 h-3 mr-2" />
              Knowledge Hub
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6"
            variants={itemVariants}
          >
            <span className="block">Discover Stories That</span>
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Shape Tomorrow
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Expert insights, cutting-edge tutorials, and industry trends from
            thought leaders who are redefining digital innovation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <Button size="lg" className="px-8 py-3 group">
              Start Reading
              <TrendingUp className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 group">
              <Search className="mr-2 w-4 h-4" />
              Explore Topics
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            variants={statsVariants}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {totalPosts.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">
                Articles Published
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {totalAuthors.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">
                Expert Authors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {totalReads.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">
                Monthly Readers
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
