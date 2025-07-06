"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  Quote,
  Star,
  MessageCircle,
  User,
  Building,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  avatar?: string;
}

interface ServiceTestimonialSectionProps {
  testimonials: Testimonial[];
}

export function ServiceTestimonialSection({
  testimonials,
}: ServiceTestimonialSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const quoteScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);

  // Handle empty testimonials array
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  // Navigation functions
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const authorVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
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
      className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating quote elements */}
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Decorative quote marks */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 h-16 text-primary/20"
          variants={floatingVariants}
          animate="animate"
        >
          <Quote className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-12 h-12 text-accent/20 rotate-180"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        >
          <Quote className="w-full h-full" />
        </motion.div>

        {/* Heart floating animation */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-8 h-8 text-primary/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Heart className="w-full h-full" />
        </motion.div>
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageCircle className="w-4 h-4" />
            </motion.div>
            Client Feedback
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">What Our</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="relative p-8 md:p-12 bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl overflow-hidden"
            variants={quoteVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            transition={{ duration: 0.3 }}
            key={currentIndex} // Add key for smooth transitions
          >
            {/* Background gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Navigation Controls */}
            {testimonials.length > 1 && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="w-8 h-8 p-0"
                  disabled={testimonials.length <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="w-8 h-8 p-0"
                  disabled={testimonials.length <= 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Large quote mark */}
            <motion.div
              className="absolute -top-4 -left-4 w-20 h-20 text-primary/20"
              style={{ scale: quoteScale }}
            >
              <Quote className="w-full h-full" />
            </motion.div>

            {/* Stars decoration */}
            <motion.div
              className="flex items-center justify-center gap-1 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                  }
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </motion.div>

            {/* Quote text */}
            <motion.blockquote
              className="relative z-10 text-xl md:text-2xl lg:text-3xl font-medium text-foreground text-center leading-relaxed mb-8"
              variants={quoteVariants}
              initial="hidden"
              animate="visible"
              key={`quote-${currentIndex}`}
            >
              &ldquo;{currentTestimonial.quote}&rdquo;
            </motion.blockquote>

            {/* Author information */}
            <motion.div
              className="flex items-center justify-center gap-4"
              variants={authorVariants}
              initial="hidden"
              animate="visible"
              key={`author-${currentIndex}`}
            >
              {/* Avatar */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary/20"
                  whileHover={{ borderColor: "hsl(var(--primary))" }}
                >
                  {currentTestimonial.avatar ? (
                    <Image
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.author}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary/60" />
                    </div>
                  )}
                </motion.div>

                {/* Floating sparkles around avatar */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 text-primary/60"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Sparkles className="w-full h-full" />
                </motion.div>
              </motion.div>

              {/* Author details */}
              <div className="text-center">
                <motion.h4
                  className="text-lg font-semibold text-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  {currentTestimonial.author}
                </motion.h4>
                <motion.div
                  className="flex items-center gap-2 text-muted-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  <Building className="w-4 h-4" />
                  <span className="text-sm">{currentTestimonial.company}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute bottom-4 right-4 w-3 h-3 bg-primary/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
            <motion.div
              className="absolute top-8 right-8 w-2 h-2 bg-accent/50 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5,
              }}
            />

            {/* Bottom accent line */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : { width: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.div>

          {/* Testimonial indicators */}
          {testimonials.length > 1 && (
            <motion.div
              className="flex justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary scale-125"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Bottom message */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            Join hundreds of satisfied clients who have transformed their
            business with our innovative solutions and dedicated support.
          </motion.p>

          {/* Testimonial count */}
          {testimonials.length > 1 && (
            <motion.p
              className="text-sm text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              Showing {currentIndex + 1} of {testimonials.length} testimonials
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
