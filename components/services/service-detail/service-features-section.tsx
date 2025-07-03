"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Rocket,
  Target,
  Settings,
  Globe,
  Code,
  Palette,
} from "lucide-react";

interface ServiceFeaturesSectionProps {
  features: string[];
}

// Enhanced feature icons mapping with more variety
const featureIcons = [
  CheckCircle,
  Star,
  Shield,
  Zap,
  Sparkles,
  Rocket,
  Target,
  Settings,
  Globe,
  Code,
  Palette,
  ArrowRight,
];

export function ServiceFeaturesSection({
  features,
}: ServiceFeaturesSectionProps) {
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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
      className="relative py-24 overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-accent/5 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Additional background patterns */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
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
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            What You Get
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Premium</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Features Included
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive features designed to meet your business needs and
            exceed your expectations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const IconComponent = featureIcons[index % featureIcons.length];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative p-8 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Background glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-5"
                    animate={{
                      backgroundPosition: isEven
                        ? ["0% 0%", "100% 100%"]
                        : ["100% 0%", "0% 100%"],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Icon with enhanced animation */}
                  <motion.div
                    className="relative w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Icon glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-0 group-hover:opacity-50"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>

                  {/* Feature text */}
                  <p className="text-foreground leading-relaxed text-lg font-medium group-hover:text-primary transition-colors duration-300 relative z-10">
                    {feature}
                  </p>

                  {/* Progress indicator */}
                  <motion.div
                    className="mt-4 h-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={inView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ x: "-100%" }}
                      animate={inView ? { x: "0%" } : { x: "-100%" }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                    />
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />

                  {/* Additional floating dots */}
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-accent/40 rounded-full"
                        animate={{
                          scale: [0.5, 1, 0.5],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2 + index * 0.1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Hover arrow indicator */}
                  <motion.div
                    className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-border/30 text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium">And much more included</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
