"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Settings,
  Target,
  Zap,
  Rocket,
  PlayCircle,
  Users,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

interface ServiceProcessSectionProps {
  process: ProcessStep[];
}

// Process step icons mapping with more variety
const processIcons = [Target, Settings, Zap, CheckCircle2, Rocket, Trophy];

// Process item component with enhanced animations
const ProcessItem = ({
  step,
  title,
  description,
  duration,
  index,
  side,
  color,
}: ProcessStep & {
  index: number;
  side: "left" | "right";
  color: string;
}) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const IconComponent = processIcons[index % processIcons.length];

  const variants = {
    hidden: {
      opacity: 0,
      x: side === "left" ? -100 : 100,
      y: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="relative mb-16 w-full">
      {/* Timeline connector line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/40 via-accent/30 to-primary/40 lg:block hidden" />

      {/* Timeline node with enhanced animation */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-background border-4 border-primary rounded-full shadow-lg z-10 lg:block hidden flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{
          duration: 0.6,
          delay: index * 0.2 + 0.3,
          type: "spring",
          stiffness: 200,
        }}
      >
        <motion.span
          className="text-sm font-bold text-primary"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
        >
          {step}
        </motion.span>

        {/* Node glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/30 rounded-full blur-lg"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      </motion.div>

      <motion.div
        ref={ref}
        className={`flex ${
          side === "left"
            ? "lg:justify-start lg:pr-8"
            : "lg:justify-end lg:pl-8"
        } justify-center`}
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Content Card */}
        <motion.div
          className="w-full max-w-lg"
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          <div className="relative group">
            {/* Enhanced glow effect */}
            <motion.div
              className={`absolute -inset-1 ${color} opacity-0 group-hover:opacity-30 blur-xl rounded-2xl transition-opacity duration-500`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Main card with glassmorphism */}
            <div className="relative p-8 bg-card/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden">
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                animate={{
                  backgroundPosition:
                    side === "left"
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
                    "conic-gradient(from 0deg, currentColor, transparent, currentColor)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Step badge with animation */}
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                >
                  <Badge
                    className={`${color} text-white px-4 py-2 text-sm font-semibold shadow-lg`}
                  >
                    <motion.span
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Step {step}
                    </motion.span>
                  </Badge>
                </motion.div>
                {duration && (
                  <motion.div
                    className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={
                      inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                    }
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
                  >
                    <Clock className="w-4 h-4" />
                    {duration}
                  </motion.div>
                )}
              </div>

              {/* Icon with enhanced effects */}
              <motion.div
                className={`relative w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow duration-300`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={
                  inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.2 + 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <IconComponent className="w-7 h-7 text-white relative z-10" />
                </motion.div>

                {/* Icon background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </motion.div>

              {/* Content */}
              <motion.h3
                className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
              >
                {title}
              </motion.h3>

              <motion.p
                className="text-muted-foreground mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
              >
                {description}
              </motion.p>

              {/* Enhanced progress indicator */}
              <motion.div
                className="h-2 bg-gradient-to-r from-muted to-muted rounded-full overflow-hidden mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={inView ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 1.2, delay: index * 0.2 + 1 }}
                />
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary/30 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2 + index * 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Completion status */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export function ServiceProcessSection({ process }: ServiceProcessSectionProps) {
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

  const processColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

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
      className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background"
    >
      {/* Enhanced animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Multiple floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 100, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-56 h-56 bg-accent/5 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -80, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-40 h-40 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl"
          animate={{
            scale: [0.8, 1.5, 0.8],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Enhanced Section Header */}
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
              <PlayCircle className="w-4 h-4" />
            </motion.div>
            Our Process
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">How We</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Bring Your Vision to Life
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our proven methodology ensures quality results, transparent
            communication, and successful project delivery every time.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="max-w-4xl mx-auto">
          {process.map((step, index) => (
            <ProcessItem
              key={index}
              {...step}
              index={index}
              side={index % 2 === 0 ? "left" : "right"}
              color={processColors[index % processColors.length]}
            />
          ))}
        </div>

        {/* Success Outcome Section */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative p-12 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-3xl shadow-xl">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h3>

              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Let&apos;s discuss your project and see how our proven process
                can bring your vision to life with exceptional results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg group"
                  asChild
                >
                  <Link href="/contact">
                    Start Your Project
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-sm hover:bg-primary/10 border-primary/20 hover:border-primary/50 group"
                  asChild
                >
                  <Link href="/contact">
                    <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Schedule Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
