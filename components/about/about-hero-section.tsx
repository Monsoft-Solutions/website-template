"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Sparkles,
  Heart,
  Zap,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

// Particle Component
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

// Interactive background grid
const InteractiveGrid = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25"
        style={{
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, white, transparent)`,
        }}
        animate={{
          backgroundPosition: `${mousePosition.x * 0.1}px ${
            mousePosition.y * 0.1
          }px`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
    </div>
  );
};

export function AboutHeroSection() {
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
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 2,
      duration: 15 + (i % 5) * 2, // Consistent pattern instead of random
      x: (window.innerWidth / 20) * i + (i % 3) * 100, // Distributed pattern
      y: window.innerHeight + (i % 4) * 25,
      oscillation: 30 + (i % 3) * 20, // Consistent oscillation pattern
    }));

    setParticles(newParticles);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Spring animations for smooth effects
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

  // Stagger animation variants
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
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      scale: [1, 1.05, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10"
        animate={{
          background: [
            "linear-gradient(45deg, hsl(var(--background)), hsl(var(--accent)/0.1))",
            "linear-gradient(135deg, hsl(var(--background)), hsl(var(--primary)/0.05))",
            "linear-gradient(225deg, hsl(var(--background)), hsl(var(--accent)/0.1))",
            "linear-gradient(315deg, hsl(var(--background)), hsl(var(--primary)/0.05))",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Interactive Grid */}
      <InteractiveGrid />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient &&
          particles.map((particle) => (
            <FloatingParticle
              key={particle.id}
              delay={particle.delay}
              duration={particle.duration}
              x={particle.x}
              y={particle.y}
              oscillation={particle.oscillation}
            />
          ))}
      </div>

      {/* Animated Background Orbs */}
      <motion.div className="absolute inset-0" style={{ y: springY1 }}>
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-lg"
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
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-secondary/15 rounded-full blur-2xl"
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

      {/* Geometric Shapes with Enhanced Animations */}
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

      <div className="container relative z-10" ref={ref}>
        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Floating Badge */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div variants={floatingVariants} animate="animate">
              <Badge
                variant="outline"
                className="px-6 py-2 text-sm border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                </motion.div>
                Since 2014 • Crafting Digital Excellence
              </Badge>
            </motion.div>
          </motion.div>

          {/* Main Headline with Type Animation */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              <motion.span
                className="block text-foreground"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                We Create
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <TypeAnimation
                  sequence={[
                    "Digital Magic",
                    3000,
                    "Web Excellence",
                    3000,
                    "User Experiences",
                    3000,
                    "Brand Stories",
                    3000,
                  ]}
                  wrapper="span"
                  repeat={Infinity}
                  speed={50}
                />
              </motion.span>
              <motion.span
                className="block text-muted-foreground text-3xl md:text-4xl lg:text-5xl font-normal mt-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                One Pixel at a Time
              </motion.span>
            </h1>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div variants={itemVariants}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Born from a vision to transform how businesses connect with their
              audiences, we&apos;ve evolved from a small startup into a{" "}
              <motion.span
                className="text-primary font-semibold"
                whileHover={{ scale: 1.1 }}
                style={{ display: "inline-block" }}
              >
                creative powerhouse
              </motion.span>{" "}
              that shapes the digital landscape.
            </p>
          </motion.div>

          {/* Interactive Stats Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
            variants={itemVariants}
          >
            {[
              {
                number: "10+",
                label: "Years Creating",
                icon: Target,
                color: "text-primary",
              },
              {
                number: "500+",
                label: "Projects Delivered",
                icon: Rocket,
                color: "text-accent",
              },
              {
                number: "200+",
                label: "Happy Clients",
                icon: Heart,
                color: "text-primary",
              },
              {
                number: "25+",
                label: "Team Members",
                icon: Users,
                color: "text-accent",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group relative"
                whileHover={{
                  scale: 1.1,
                  y: -10,
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 + index * 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId={`stat-bg-${index}`}
                />
                <div className="relative p-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${stat.color} mx-auto mb-2 group-hover:scale-125 transition-transform duration-300`}
                    />
                  </motion.div>
                  <div
                    className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Core Values Preview */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            {[
              { icon: Heart, label: "Passion-Driven", color: "text-red-500" },
              {
                icon: Zap,
                label: "Innovation First",
                color: "text-yellow-500",
              },
              {
                icon: Sparkles,
                label: "Quality Obsessed",
                color: "text-purple-500",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "hsl(var(--primary)/0.05)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2.5 + index * 0.1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.7,
                  }}
                >
                  <value.icon
                    className={`w-5 h-5 ${value.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                </motion.div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                  {value.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="group bg-primary hover:bg-primary/90 relative overflow-hidden"
                asChild
              >
                <Link href="#our-story">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  Discover Our Journey
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-sm hover:bg-primary/10 border-primary/20 hover:border-primary/50 transition-colors duration-300"
                asChild
              >
                <Link href="/contact">Start Your Project</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
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
