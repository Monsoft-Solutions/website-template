"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import {
  Award,
  Users,
  TrendingUp,
  Calendar,
  Trophy,
  Globe,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";

// Floating number particles
const NumberParticle = ({
  number,
  delay,
  index = 0,
}: {
  number: string;
  delay: number;
  index?: number;
}) => {
  // Deterministic positioning based on index
  const xOffset = (index % 3) * 40 - 40; // -40, 0, 40
  const yOffset = Math.floor(index / 3) * 30 - 30; // Vertical distribution

  return (
    <motion.div
      className="absolute text-primary/20 font-bold text-xs select-none pointer-events-none"
      initial={{
        opacity: 0,
        scale: 0,
        x: xOffset,
        y: yOffset,
      }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0],
        y: [yOffset, yOffset - 50],
        rotate: [0, 360],
      }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 5,
      }}
    >
      {number}
    </motion.div>
  );
};

// Interactive stat card component
const StatCard = ({
  icon: Icon,
  value,
  label,
  growth,
  color,
  delay = 0,
  particles = [],
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  growth: string;
  color: string;
  delay?: number;
  particles?: string[];
}) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 100, scale: 0.8 }
      }
      transition={{
        duration: 0.8,
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-500`}
        animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {particles.map((particle, index) => (
          <NumberParticle
            key={index}
            number={particle}
            delay={delay + index * 0.5}
            index={index}
          />
        ))}
      </div>

      {/* Card content */}
      <div className="relative p-8 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-500 group-hover:bg-card/90">
        {/* Icon with animation */}
        <motion.div
          className="flex justify-center mb-6"
          animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`p-4 rounded-full bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            <motion.div
              animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Animated counter */}
        <div className="text-center">
          <motion.div
            className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          >
            {inView && (
              <CountUp
                end={value}
                duration={2.5}
                delay={delay}
                preserveValue
                suffix={value >= 1000 ? "+" : ""}
              />
            )}
          </motion.div>

          <motion.p
            className="text-muted-foreground font-medium mb-3"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
          >
            {label}
          </motion.p>

          {/* Growth indicator */}
          <motion.div
            className="flex items-center justify-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: delay + 0.7 }}
          >
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-semibold">
              {growth}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export function AboutStatsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const stats = [
    {
      icon: Calendar,
      value: 10,
      label: "Years of Excellence",
      growth: "+100% Growth",
      color: "from-purple-500 to-purple-600",
      particles: ["2014", "2024", "10Y"],
    },
    {
      icon: Users,
      value: 500,
      label: "Projects Delivered",
      growth: "+250% This Year",
      color: "from-blue-500 to-blue-600",
      particles: ["500", "✓", "🚀"],
    },
    {
      icon: Award,
      value: 200,
      label: "Happy Clients",
      growth: "+180% Retention",
      color: "from-green-500 to-green-600",
      particles: ["200", "😊", "⭐"],
    },
    {
      icon: Globe,
      value: 25,
      label: "Countries Served",
      growth: "+15 New Markets",
      color: "from-orange-500 to-orange-600",
      particles: ["25", "🌍", "📈"],
    },
    {
      icon: Trophy,
      value: 15,
      label: "Industry Awards",
      growth: "+5 This Year",
      color: "from-yellow-500 to-yellow-600",
      particles: ["15", "🏆", "🎉"],
    },
    {
      icon: Star,
      value: 99,
      label: "Client Satisfaction",
      growth: "+2% YoY",
      color: "from-pink-500 to-pink-600",
      particles: ["99%", "⭐", "💯"],
    },
  ];

  const milestones = [
    {
      year: "2014",
      achievement: "Company Founded",
      color: "from-blue-500 to-purple-500",
    },
    {
      year: "2020",
      achievement: "100+ Projects",
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2024",
      achievement: "Global Recognition",
      color: "from-pink-500 to-orange-500",
    },
  ];

  return (
    <section
      className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background"
      ref={ref}
    >
      {/* Animated background elements */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-30" />

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
      </motion.div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            Numbers That Tell Our Story
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Measurable
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Impact & Growth
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our journey is marked by consistent growth, satisfied clients, and
            groundbreaking achievements that speak to our commitment to
            excellence.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.2} />
          ))}
        </div>

        {/* Growth timeline */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Our Growth Story
            </h3>
            <p className="text-muted-foreground">
              Key milestones in our journey
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="relative text-center group"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                }
                transition={{
                  duration: 0.6,
                  delay: 1.2 + index * 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                {/* Connection line */}
                {index < milestones.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 + index * 0.3 }}
                  />
                )}

                {/* Milestone card */}
                <motion.div
                  className={`p-6 rounded-2xl bg-gradient-to-br ${milestone.color} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  whileHover={{ rotateY: 5 }}
                >
                  <motion.div
                    className="text-2xl font-bold mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {milestone.year}
                  </motion.div>
                  <div className="text-sm opacity-90">
                    {milestone.achievement}
                  </div>

                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional metrics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-border/50"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {[
            { label: "Coffee Consumed", value: "5000", unit: "Cups" },
            { label: "Lines of Code", value: "2M", unit: "+" },
            { label: "Team Growth", value: "300", unit: "%" },
            { label: "Client Success", value: "99.8", unit: "%" },
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                {inView && (
                  <CountUp
                    end={parseFloat(metric.value)}
                    duration={2}
                    delay={2 + index * 0.1}
                    preserveValue
                    suffix={metric.unit}
                  />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
