"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import {
  CheckCircle2,
  Package,
  FileText,
  Download,
  Star,
  Gift,
  BookOpen,
  Settings,
  Zap,
  Shield,
  Trophy,
  Sparkles,
} from "lucide-react";

interface ServiceDeliverablesSectionProps {
  deliverables: string[];
}

// Deliverable icons mapping
const deliverableIcons = [
  Package,
  FileText,
  Download,
  BookOpen,
  Settings,
  Shield,
  Trophy,
  Star,
  Gift,
  Zap,
  CheckCircle2,
  Sparkles,
];

export function ServiceDeliverablesSection({
  deliverables,
}: ServiceDeliverablesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
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

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: "easeInOut" as const },
        opacity: { duration: 0.3 },
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-32 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-64 h-64 bg-accent/10 rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Package floating animation */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl blur-lg"
          animate={{
            scale: [0.8, 1.3, 0.8],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
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
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Package className="w-4 h-4" />
            </motion.div>
            What You&apos;ll Receive
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Complete</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Deliverables
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need for a successful launch and long-term success,
            delivered with attention to detail and quality.
          </p>
        </motion.div>

        {/* Deliverables List */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliverables.map((deliverable, index) => {
              const IconComponent =
                deliverableIcons[index % deliverableIcons.length];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 overflow-hidden"
                    whileHover={{ borderColor: "hsl(var(--primary))" }}
                  >
                    {/* Background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      {/* Animated checkmark */}
                      <motion.div
                        className="flex-shrink-0 w-6 h-6 relative mt-1"
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <motion.div
                          className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <motion.svg
                            className="w-4 h-4 text-primary"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <motion.path
                              d="M6 10l2 2 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              variants={checkmarkVariants}
                            />
                          </motion.svg>
                        </motion.div>
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        className="flex-shrink-0 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <IconComponent className="w-5 h-5 text-primary" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <motion.h3
                          className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {deliverable}
                        </motion.h3>
                      </div>

                      {/* Decorative arrow */}
                      <motion.div
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          className="w-5 h-5 text-primary/60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute bottom-4 right-6 w-1 h-1 bg-accent/50 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </motion.div>

                  {/* Side indicator */}
                  <motion.div
                    className={`absolute top-6 ${
                      isEven ? "-left-1" : "-right-1"
                    } w-2 h-8 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100`}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom message */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            Each deliverable is crafted with precision and tested thoroughly to
            ensure it meets the highest standards of quality and performance.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
