"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Rocket,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";

interface ServiceCtaSectionProps {
  serviceTitle: string;
}

export function ServiceCtaSection({ serviceTitle }: ServiceCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scaleProgress = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.8, 1, 1.2]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-30" />

        {/* Large central gradient */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          style={{ scale: scaleProgress }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 w-48 h-48 bg-accent/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Floating icons */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 text-primary/30"
          variants={floatingVariants}
          animate="animate"
        >
          <Rocket className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-12 h-12 text-accent/30"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        >
          <Star className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-1/3 w-14 h-14 text-primary/20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        >
          <Target className="w-full h-full" />
        </motion.div>

        {/* Sparkles */}
        <motion.div
          className="absolute top-1/3 right-1/5 w-8 h-8 text-accent/40"
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-6 h-6 text-primary/40"
          animate={{
            scale: [0, 1, 0],
            rotate: [0, -180, -360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            delay: 0.5,
          }}
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Main heading */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-8"
              whileHover={{
                scale: 1.05,
                backgroundColor: "hsl(var(--primary)/30)",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              Ready to Get Started?
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="block text-foreground">
                Let&apos;s Build Your
              </span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {serviceTitle} Solution
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Transform your vision into reality with our expert team. Get
              started today and see the difference professional{" "}
              {serviceTitle.toLowerCase()} can make.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            variants={itemVariants}
          >
            {/* Primary CTA */}
            <Link href="/contact">
              <motion.div
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Your Project
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>

            {/* Secondary CTA */}
            <Link href="/contact">
              <motion.div
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Schedule Consultation
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Contact options */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {/* Phone */}
            <motion.div
              className="group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300"
                whileHover={{
                  borderColor: "hsl(var(--primary)/30)",
                  backgroundColor: "hsl(var(--card)/80)",
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <Phone className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Call Us
                </h3>
                <p className="text-muted-foreground">
                  Speak directly with our experts
                </p>
                <motion.a
                  href="tel:+1234567890"
                  className="inline-block mt-3 text-primary font-medium hover:underline"
                  whileHover={{ scale: 1.05 }}
                >
                  +1 (234) 567-8900
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300"
                whileHover={{
                  borderColor: "hsl(var(--primary)/30)",
                  backgroundColor: "hsl(var(--card)/80)",
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <Mail className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Email Us
                </h3>
                <p className="text-muted-foreground">
                  Get detailed project information
                </p>
                <motion.a
                  href="mailto:hello@sitewave.com"
                  className="inline-block mt-3 text-primary font-medium hover:underline"
                  whileHover={{ scale: 1.05 }}
                >
                  hello@sitewave.com
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Meeting */}
            <motion.div
              className="group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300"
                whileHover={{
                  borderColor: "hsl(var(--primary)/30)",
                  backgroundColor: "hsl(var(--card)/80)",
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <Calendar className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Book Meeting
                </h3>
                <p className="text-muted-foreground">
                  Schedule a free consultation
                </p>
                <motion.a
                  href="/contact"
                  className="inline-block mt-3 text-primary font-medium hover:underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Choose a time
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom message */}
          <motion.div
            className="mt-16 pt-8 border-t border-border/30"
            variants={itemVariants}
          >
            <motion.p
              className="text-lg text-muted-foreground"
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-semibold text-primary">
                Free consultation
              </span>{" "}
              •
              <span className="font-semibold text-accent ml-2">
                No commitment required
              </span>{" "}
              •
              <span className="font-semibold text-primary ml-2">
                Quick response time
              </span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
