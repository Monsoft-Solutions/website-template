"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials, testimonialStats } from "@/lib/data/testimonials";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  autoRotate?: boolean;
  rotationInterval?: number;
  maxTestimonials?: number;
  className?: string;
  backgroundVariant?: "light" | "white" | "blue";
}

export function Testimonials({
  title = "What Our Clients Say",
  subtitle = "Real reviews from real Cape Coral families",
  showStats = true,
  autoRotate = true,
  rotationInterval = 8000,
  maxTestimonials,
  className = "",
  backgroundVariant = "light",
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Use limited testimonials if specified
  const displayTestimonials = maxTestimonials
    ? testimonials.slice(0, maxTestimonials)
    : testimonials;

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || !inView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, displayTestimonials.length, inView]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + displayTestimonials.length) % displayTestimonials.length
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = displayTestimonials[currentIndex];

  const backgroundClasses = {
    light: "bg-secondary-light",
    white: "bg-white",
    blue: "brand-gradient text-white",
  };

  const textColorClasses = {
    light: "text-neutral-text",
    white: "text-neutral-text",
    blue: "text-white",
  };

  const cardClasses = {
    light: "bg-white",
    white: "bg-secondary-light",
    blue: "bg-white/10 backdrop-blur-sm border border-white/20",
  };

  return (
    <section
      className={`py-24 md:py-32 ${backgroundClasses[backgroundVariant]} ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
              backgroundVariant === "blue"
                ? "text-white"
                : "text-primary-blue-dark"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
              backgroundVariant === "blue"
                ? "text-white/90"
                : textColorClasses[backgroundVariant]
            }`}
          >
            {subtitle}
          </p>
        </motion.div>

        {/* Stats Row */}
        {showStats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center">
              <div
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                  backgroundVariant === "blue"
                    ? "text-white"
                    : "text-primary-blue-dark"
                }`}
              >
                {testimonialStats.googleReviewsAverage}
              </div>
              <div
                className={`text-sm md:text-base font-medium ${
                  backgroundVariant === "blue"
                    ? "text-white/80"
                    : textColorClasses[backgroundVariant]
                }`}
              >
                Google Rating
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                  backgroundVariant === "blue"
                    ? "text-white"
                    : "text-primary-blue-dark"
                }`}
              >
                {testimonialStats.totalReviews}+
              </div>
              <div
                className={`text-sm md:text-base font-medium ${
                  backgroundVariant === "blue"
                    ? "text-white/80"
                    : textColorClasses[backgroundVariant]
                }`}
              >
                Reviews
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                  backgroundVariant === "blue"
                    ? "text-white"
                    : "text-primary-blue-dark"
                }`}
              >
                {testimonialStats.recommendationRate}%
              </div>
              <div
                className={`text-sm md:text-base font-medium ${
                  backgroundVariant === "blue"
                    ? "text-white/80"
                    : textColorClasses[backgroundVariant]
                }`}
              >
                Recommend Us
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                  backgroundVariant === "blue"
                    ? "text-white"
                    : "text-primary-blue-dark"
                }`}
              >
                {testimonialStats.averageResponseTime}
              </div>
              <div
                className={`text-sm md:text-base font-medium ${
                  backgroundVariant === "blue"
                    ? "text-white/80"
                    : textColorClasses[backgroundVariant]
                }`}
              >
                Response Time
              </div>
            </div>
          </motion.div>
        )}

        {/* Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`testimonial-card p-8 md:p-12 relative ${cardClasses[backgroundVariant]}`}
            >
              {/* Quote Icon */}
              <div
                className={`text-6xl md:text-7xl leading-none mb-6 ${
                  backgroundVariant === "blue"
                    ? "text-white/20"
                    : "text-primary-blue/20"
                }`}
              >
                &ldquo;
              </div>

              {/* Review Text */}
              <p
                className={`text-lg md:text-xl leading-relaxed mb-8 italic ${
                  backgroundVariant === "blue"
                    ? "text-white/90"
                    : "text-neutral-text"
                }`}
              >
                {currentTestimonial.reviewText}
              </p>

              {/* Star Rating */}
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < currentTestimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Client Info */}
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={currentTestimonial.clientPhoto}
                    alt={currentTestimonial.clientName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <div
                    className={`font-semibold text-lg ${
                      backgroundVariant === "blue"
                        ? "text-white"
                        : "text-primary-blue-dark"
                    }`}
                  >
                    {currentTestimonial.clientName}
                  </div>
                  <div
                    className={`text-sm ${
                      backgroundVariant === "blue"
                        ? "text-white/70"
                        : "text-neutral-light"
                    }`}
                  >
                    {currentTestimonial.propertyType} •{" "}
                    {currentTestimonial.propertyLocation}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-12 gap-2">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? backgroundVariant === "blue"
                    ? "bg-white"
                    : "bg-primary-blue"
                  : backgroundVariant === "blue"
                    ? "bg-white/30"
                    : "bg-neutral-border"
              }`}
              onClick={() => goToTestimonial(index)}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            className={
              backgroundVariant === "blue"
                ? "bg-white text-primary-blue hover:bg-white/90"
                : "btn-primary"
            }
            size="lg"
          >
            Read All Reviews
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
