"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar,
  Users,
  Trophy,
  Rocket,
  Globe,
  Star,
  ArrowRight,
  Building,
  Zap,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// Simplified floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/60 rounded-full"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Simplified timeline item component
const TimelineItem = ({
  year,
  title,
  description,
  achievements,
  icon: Icon,
  side,
  index,
  color,
}: {
  year: string;
  title: string;
  description: string;
  achievements: string[];
  icon: React.ComponentType<{ className?: string }>;
  side: "left" | "right";
  index: number;
  color: string;
}) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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
      {/* Timeline connector line for each item */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border/40 lg:block hidden" />

      {/* Timeline node */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary border-4 border-background rounded-full shadow-lg z-10 lg:block hidden"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
      />

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
            {/* Subtle glow effect */}
            <div
              className={`absolute -inset-1 ${color} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-500`}
            />

            {/* Main card with proper padding */}
            <div className="relative p-8 bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl">
              {/* Year badge */}
              <Badge
                className={`${color} text-white px-4 py-2 text-sm font-semibold mb-6 inline-block`}
              >
                {year}
              </Badge>

              {/* Icon */}
              <div
                className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 shadow-md`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>

              {/* Achievements */}
              <div className="space-y-3">
                {achievements.map((achievement, achievementIndex) => (
                  <motion.div
                    key={achievementIndex}
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2 + achievementIndex * 0.1 + 0.6,
                    }}
                  >
                    <Circle className="w-2 h-2 text-primary fill-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export function AboutTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Subtle parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const timelineData = [
    {
      year: "2014",
      title: "The Genesis",
      description:
        "Founded with a vision to revolutionize digital experiences. Started in a small garage with three passionate developers and one shared dream.",
      achievements: [
        "Company incorporated with 3 founding members",
        "First client project delivered successfully",
        "Established core company values and mission",
        "Built our first development team",
      ],
      icon: Building,
      side: "left" as const,
      color: "bg-blue-500",
    },
    {
      year: "2016",
      title: "Growing Roots",
      description:
        "Expanded our team and capabilities, establishing ourselves as a reliable partner for businesses seeking digital transformation.",
      achievements: [
        "Grew team to 8 talented professionals",
        "Launched 25+ successful projects",
        "Introduced agile development practices",
        "Opened our first dedicated office space",
      ],
      icon: Users,
      side: "right" as const,
      color: "bg-green-500",
    },
    {
      year: "2018",
      title: "Innovation Accelerated",
      description:
        "Embraced cutting-edge technologies and methodologies, positioning ourselves at the forefront of digital innovation.",
      achievements: [
        "Adopted cloud-first development approach",
        "Launched AI-powered solutions",
        "Achieved 99.9% project success rate",
        "Won first industry recognition award",
      ],
      icon: Rocket,
      side: "left" as const,
      color: "bg-orange-500",
    },
    {
      year: "2020",
      title: "Global Expansion",
      description:
        "Adapted to the changing world and expanded our reach globally, helping businesses navigate digital transformation challenges.",
      achievements: [
        "Established remote-first work culture",
        "Expanded to serve 15+ countries",
        "Achieved 100+ project milestone",
        "Built strategic partnerships worldwide",
      ],
      icon: Globe,
      side: "right" as const,
      color: "bg-purple-500",
    },
    {
      year: "2022",
      title: "Excellence Recognition",
      description:
        "Our commitment to quality and innovation was recognized by industry leaders, cementing our position as a trusted partner.",
      achievements: [
        "Won 5 major industry awards",
        "Achieved enterprise-level certifications",
        "Reached 200+ satisfied clients",
        "Launched innovation lab initiative",
      ],
      icon: Trophy,
      side: "left" as const,
      color: "bg-yellow-500",
    },
    {
      year: "2024",
      title: "Future Ready",
      description:
        "Leading the charge in next-generation technologies while maintaining our core values of quality, innovation, and client success.",
      achievements: [
        "Pioneered quantum-ready solutions",
        "Achieved carbon-neutral operations",
        "500+ projects delivered successfully",
        "Established global innovation hubs",
      ],
      icon: Star,
      side: "right" as const,
      color: "bg-pink-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-br from-background to-muted/30"
      id="our-story"
    >
      {/* Simplified background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />
        <FloatingParticles />
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Our Journey Through Time
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">A Decade of</span>
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Digital Excellence
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to industry leadership, our timeline tells
            the story of innovation, growth, and unwavering commitment to our
            clients&apos; success.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main timeline line - more visible */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/60 via-primary to-primary/60 shadow-sm" />

          {/* Timeline Items */}
          <div className="space-y-0">
            {timelineData.map((item, index) => (
              <TimelineItem key={item.year} {...item} index={index} />
            ))}
          </div>
        </div>

        {/* Future Vision - simplified */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="relative inline-block">
            <div className="relative p-12 bg-card border-2 border-border rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Zap className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-4">
                What&apos;s Next?
              </h3>

              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Our journey continues as we push the boundaries of what&apos;s
                possible in digital innovation. Join us as we shape the future
                of technology.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 py-3 shadow-lg"
                asChild
              >
                <Link href="/contact" className="group">
                  Start Your Journey With Us
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
