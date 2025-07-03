"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, BookOpen, Zap } from "lucide-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { trackEvent } from "@/lib/utils/analytics";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TypeAnimation } from "react-type-animation";

// Floating Particle Component
const FloatingParticle = ({
  delay = 0,
  duration = 20,
  x = 0,
  y = 0,
  oscillation = 50,
}: {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  oscillation?: number;
}) => (
  <motion.div
    className="absolute w-2 h-2 bg-primary/30 rounded-full"
    initial={{
      opacity: 0,
      x: x,
      y: y,
      scale: 0,
    }}
    animate={{
      opacity: [0, 1, 0],
      y: y - 200,
      x: [x, x + oscillation, x - oscillation, x],
      scale: [0, 1, 0],
      rotate: 360,
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
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
};

export function HeroSection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleCTAClick = (cta: string) => {
    trackEvent({
      action: "hero_cta_click",
      category: "conversion",
      label: cta,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 min-h-screen flex items-center">
      {/* Enhanced Background Pattern with Motion */}
      <motion.div
        className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
        style={{ y }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 2}
            duration={20 + i * 3}
            x={
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200)
            }
            y={
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800)
            }
            oscillation={30 + Math.random() * 40}
          />
        ))}
      </div>

      {/* Animated Background Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container relative z-10" ref={ref}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
            {/* Enhanced Content */}
            <motion.div
              className="text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {/* Animated Badge */}
              <motion.div variants={itemVariants}>
                <motion.div variants={floatingVariants} animate="animate">
                  <Badge
                    variant="outline"
                    className="mb-6 px-6 py-2 text-sm border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap className="w-3 h-3 mr-2 text-primary" />
                    </motion.div>
                    Next.js 15 Ready
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Animated Headline with Type Animation */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Build Modern
                  </motion.span>
                  <motion.span
                    className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <TypeAnimation
                      sequence={[
                        "Websites",
                        3000,
                        "Applications",
                        3000,
                        "Experiences",
                        3000,
                        "Solutions",
                        3000,
                      ]}
                      wrapper="span"
                      repeat={Infinity}
                      speed={50}
                    />
                  </motion.span>
                  <motion.span
                    className="block text-muted-foreground text-2xl md:text-3xl lg:text-4xl font-normal mt-2"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                  >
                    in Minutes, Not Weeks
                  </motion.span>
                </h1>
              </motion.div>

              {/* Enhanced Description */}
              <motion.div variants={itemVariants}>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                  Production-ready website template with blog system, analytics,
                  SEO optimization, and database integration. Save weeks of
                  development time with{" "}
                  <motion.span
                    className="text-primary font-semibold"
                    whileHover={{ scale: 1.1 }}
                    style={{ display: "inline-block" }}
                  >
                    modern best practices
                  </motion.span>{" "}
                  built-in.
                </p>
              </motion.div>

              {/* Enhanced Key Benefits */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                variants={itemVariants}
              >
                {[
                  { label: "TypeScript Ready", color: "bg-green-500" },
                  { label: "SEO Optimized", color: "bg-blue-500" },
                  { label: "Analytics Built-in", color: "bg-purple-500" },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.label}
                    className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    <motion.div
                      className={`w-2 h-2 ${benefit.color} rounded-full`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    />
                    {benefit.label}
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="group bg-primary hover:bg-primary/90 relative overflow-hidden"
                    onClick={() => handleCTAClick("get-started")}
                    asChild
                  >
                    <Link href="/contact">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      Get Started Now
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="backdrop-blur-sm hover:bg-primary/10 border-primary/20 hover:border-primary/50 transition-colors duration-300"
                    onClick={() => handleCTAClick("view-demo")}
                    asChild
                  >
                    <Link href="/blog">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Demo
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="ghost"
                    className="hover:bg-accent/10 transition-colors duration-300"
                    onClick={() => handleCTAClick("github")}
                    asChild
                  >
                    <Link
                      href="https://github.com/Monsoft-Solutions/website-template"
                      target="_blank"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Star on GitHub
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Hero Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1, rotateY: 0 }
                  : { opacity: 0, scale: 0.8, rotateY: -15 }
              }
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card"
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <PlaceholderImage
                  src="https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Website Template Dashboard Preview"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />

                {/* Enhanced Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
              </motion.div>

              {/* Enhanced Floating Stats */}
              <motion.div
                className="absolute -top-6 -left-6 bg-card border shadow-lg rounded-lg p-4"
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <motion.div
                  className="text-2xl font-bold text-primary"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  15+
                </motion.div>
                <div className="text-sm text-muted-foreground">Components</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-8 bg-card border shadow-lg rounded-lg p-4"
                initial={{ opacity: 0, scale: 0, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <motion.div
                  className="text-2xl font-bold text-green-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  100%
                </motion.div>
                <div className="text-sm text-muted-foreground">Type Safe</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1 cursor-pointer hover:border-primary/50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-2 h-3 bg-muted-foreground/50 rounded-full mx-auto"
            animate={{
              y: [0, 12, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
