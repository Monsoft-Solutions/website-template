"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Sparkles, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TypeAnimation } from "react-type-animation";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

// Animation properties directly used in animate
const glowAnimation = {
  scale: [1, 1.2, 1],
  opacity: [0.3, 0.5, 0.3],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export function ServicesHeroSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />

      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={glowAnimation}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={glowAnimation}
      />

      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-muted bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground">
              <Compass className="w-4 h-4 text-primary" />
              <span>Explore Our Solutions</span>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 bg-clip-text"
          >
            <span className="block mb-2">Transformative</span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              <TypeAnimation
                sequence={[
                  "Digital Services",
                  2000,
                  "Web Solutions",
                  2000,
                  "User Experiences",
                  2000,
                ]}
                wrapper="span"
                repeat={Infinity}
                speed={50}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto"
          >
            From concept to execution, we deliver tailored digital solutions
            that drive growth, enhance user experiences, and position your
            business for success in the digital landscape.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
          >
            <Button size="lg" className="group rounded-full">
              <Link href="#services" className="flex items-center">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              <Link href="/contact" className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                Get Free Consultation
              </Link>
            </Button>
          </motion.div>

          {/* Stats chips */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap justify-center gap-4 text-muted-foreground text-sm"
          >
            <motion.div
              className="bg-background/80 backdrop-blur-sm border border-muted rounded-full px-4 py-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium text-foreground">200+</span> Happy
              Clients
            </motion.div>
            <motion.div
              className="bg-background/80 backdrop-blur-sm border border-muted rounded-full px-4 py-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium text-foreground">500+</span> Projects
              Delivered
            </motion.div>
            <motion.div
              className="bg-background/80 backdrop-blur-sm border border-muted rounded-full px-4 py-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium text-foreground">10+</span> Years
              Experience
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
