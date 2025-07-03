"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Tag,
  Settings,
  Target,
  TrendingUp,
} from "lucide-react";

interface ServiceBenefitsSectionProps {
  benefits: string[];
  serviceInfo: {
    timeline: string;
    category: string;
    technologies: string[];
  };
}

// Benefit icons mapping
const benefitIcons = [Target, TrendingUp, CheckCircle, Settings];

export function ServiceBenefitsSection({
  benefits,
  serviceInfo,
}: ServiceBenefitsSectionProps) {
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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
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

  const rightSideVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-10" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-32 left-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-56 h-56 bg-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Benefits */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Section Header */}
            <motion.div className="mb-12" variants={itemVariants}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Target className="w-4 h-4" />
                Key Benefits
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                <span className="block text-foreground">Why Choose</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  This Service?
                </span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover the powerful advantages that make this service the
                perfect choice for your business growth.
              </p>
            </motion.div>

            {/* Benefits List */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefitIcons[index % benefitIcons.length];

                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-accent/5 transition-colors duration-300"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>

                    <div className="flex-1">
                      <p className="text-lg text-foreground leading-relaxed group-hover:text-primary transition-colors duration-300">
                        {benefit}
                      </p>

                      {/* Progress indicator */}
                      <motion.div
                        className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-3"
                        initial={{ width: 0 }}
                        animate={inView ? { width: "100%" } : { width: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Service Details */}
          <motion.div
            variants={rightSideVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="lg:pl-8"
          >
            <motion.div
              className="relative p-8 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-3xl shadow-lg"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background glow */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl opacity-0 blur-xl"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative">
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Service Details
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
                </motion.div>

                {/* Details Grid */}
                <div className="space-y-6">
                  {/* Timeline */}
                  <motion.div
                    className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">
                        Timeline
                      </span>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {serviceInfo.timeline}
                    </span>
                  </motion.div>

                  {/* Category */}
                  <motion.div
                    className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">
                        Category
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-medium">
                      {serviceInfo.category}
                    </Badge>
                  </motion.div>

                  {/* Technologies */}
                  {serviceInfo.technologies.length > 0 && (
                    <motion.div
                      className="p-4 bg-background/50 rounded-xl border border-border/30"
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">
                          Technologies
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {serviceInfo.technologies.map((tech, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                              duration: 0.4,
                              delay: 0.9 + index * 0.1,
                            }}
                          >
                            <Badge
                              variant="outline"
                              className="text-xs bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                            >
                              {tech}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-6 right-6 w-3 h-3 bg-primary/30 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
