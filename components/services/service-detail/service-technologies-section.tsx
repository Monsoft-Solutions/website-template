"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import {
  Code2,
  Sparkles,
  Layers,
  Zap,
  Database,
  Globe,
  Server,
  Smartphone,
  Palette,
  Shield,
  Cloud,
  Terminal,
} from "lucide-react";

interface ServiceTechnologiesSectionProps {
  technologies: string[];
}

// Technology icons mapping
const technologyIcons = [
  Code2,
  Database,
  Globe,
  Server,
  Smartphone,
  Layers,
  Palette,
  Shield,
  Cloud,
  Terminal,
  Zap,
  Sparkles,
];

export function ServiceTechnologiesSection({
  technologies,
}: ServiceTechnologiesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tech grid pattern */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-xl rotate-45"
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [45, 225, 45],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          variants={headerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Code2 className="w-4 h-4" />
            </motion.div>
            Technology Stack
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Cutting-Edge</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We leverage the latest and most reliable technologies to build
            robust, scalable, and future-proof solutions.
          </p>
        </motion.div>

        {/* Technologies Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {technologies.map((technology, index) => {
            const IconComponent =
              technologyIcons[index % technologyIcons.length];

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -8, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 overflow-hidden aspect-square flex flex-col items-center justify-center text-center"
                  whileHover={{ borderColor: "hsl(var(--primary))" }}
                >
                  {/* Background glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="relative z-10 mb-3 p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <IconComponent className="w-6 h-6 text-primary" />
                  </motion.div>

                  {/* Technology name */}
                  <motion.h3
                    className="relative z-10 text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {technology}
                  </motion.h3>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                  <motion.div
                    className="absolute bottom-2 left-2 w-1 h-1 bg-accent/50 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />

                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Floating indicator */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0, y: 10 }}
                  whileHover={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Call-to-Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            Our technology choices are driven by performance, scalability, and
            long-term maintainability to ensure your project&apos;s success.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
