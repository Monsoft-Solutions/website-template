"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  PlayCircle,
  ChevronRight,
  Clock,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

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

interface ServiceData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  timeline: string;
  category: string;
  featuredImage: string;
}

interface ServiceHeroSectionProps {
  service: ServiceData;
}

export function ServiceHeroSection({ service }: ServiceHeroSectionProps) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Client-side particle generation to avoid hydration mismatch
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      delay: number;
      duration: number;
      x: number;
      y: number;
      oscillation: number;
    }>
  >([]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Generate consistent particles only on client
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: i * 2,
      duration: 15 + (i % 5) * 2,
      x:
        ((typeof window !== "undefined" ? window.innerWidth : 1200) / 15) * i +
        (i % 3) * 100,
      y:
        (typeof window !== "undefined" ? window.innerHeight : 800) +
        (i % 4) * 25,
      oscillation: 30 + (i % 3) * 20,
    }));

    setParticles(newParticles);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

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
    hidden: { opacity: 0, y: 50, scale: 0.8 },
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

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Animated Particles */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <FloatingParticle key={particle.id} {...particle} />
          ))}
        </div>
      )}

      {/* Background Elements */}
      <motion.div className="absolute inset-0" style={{ y: springY1 }}>
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-48 h-48 bg-accent/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      {/* Geometric Shapes */}
      <motion.div className="absolute inset-0" style={{ y: springY2 }}>
        <motion.div
          className="absolute top-1/3 right-10 w-6 h-6 bg-gradient-to-r from-primary to-accent"
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-20 w-4 h-4 bg-accent rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />
      </motion.div>

      {/* Breadcrumb */}
      <motion.nav
        className="absolute top-8 left-0 w-full z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <li>
              <Link
                href="/services"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Services
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <li className="text-foreground font-medium">{service.title}</li>
          </ol>
        </div>
      </motion.nav>

      <div className="container relative z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Category Badge */}
            <motion.div variants={itemVariants}>
              <motion.div variants={floatingVariants} animate="animate">
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-6"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {service.category}
                </Badge>
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <motion.span
                  className="block text-foreground"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {service.title}
                </motion.span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                {service.fullDescription}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button size="lg" asChild className="group">
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="group">
                <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Service Details */}
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-6 text-muted-foreground"
            >
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                <span>{service.timeline}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <span>Dedicated Team</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Featured Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Main image */}
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={service.featuredImage}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-card border shadow-lg rounded-lg p-4"
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
                  <Star className="w-6 h-6 inline-block mr-2" />
                  5.0
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  Client Rating
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 bg-card border shadow-lg rounded-lg p-4"
                initial={{ opacity: 0, scale: 0, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.7 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <motion.div
                  className="text-lg font-bold text-primary"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  100+
                </motion.div>
                <div className="text-xs text-muted-foreground">
                  Projects Done
                </div>
              </motion.div>

              {/* Background orbs */}
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
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
