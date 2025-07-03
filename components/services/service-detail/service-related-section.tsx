"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Layers,
  ExternalLink,
  Grid3X3,
  Target,
} from "lucide-react";

interface ServiceRelatedSectionProps {
  relatedServices: string[];
}

export function ServiceRelatedSection({
  relatedServices,
}: ServiceRelatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Mock service data - in real app, this would be fetched based on slugs
  const getServiceData = (slug: string) => {
    const mockData: Record<
      string,
      {
        title: string;
        description: string;
        category: string;
        image: string;
      }
    > = {
      "web-development": {
        title: "Web Development",
        description:
          "Custom websites and web applications built with modern technologies",
        category: "Development",
        image:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      },
      "mobile-app-development": {
        title: "Mobile App Development",
        description:
          "Native and cross-platform mobile applications for iOS and Android",
        category: "Development",
        image:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      },
      "ui-ux-design": {
        title: "UI/UX Design",
        description:
          "User-centered design solutions that enhance user experience",
        category: "Design",
        image:
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
      },
      "digital-consulting": {
        title: "Digital Consulting",
        description: "Strategic guidance for digital transformation and growth",
        category: "Consulting",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      },
      "e-commerce-development": {
        title: "E-commerce Development",
        description:
          "Complete online store solutions with secure payment integration",
        category: "Development",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      },
      "seo-optimization": {
        title: "SEO Optimization",
        description: "Improve your search engine rankings and organic traffic",
        category: "Marketing",
        image:
          "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=600&h=400&fit=crop",
      },
    };

    return (
      mockData[slug] || {
        title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        description: "Professional service solutions tailored to your needs",
        category: "Service",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      }
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
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
      className="relative py-24 overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 40, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
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

        {/* Grid floating animation */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-16 h-16 text-primary/20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Grid3X3 className="w-full h-full" />
        </motion.div>
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
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
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Layers className="w-4 h-4" />
            </motion.div>
            Explore More
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Related</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover other services that complement this offering and help you
            achieve your business goals more effectively.
          </p>
        </motion.div>

        {/* Related Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {relatedServices.slice(0, 6).map((serviceSlug) => {
            const serviceData = getServiceData(serviceSlug);

            return (
              <motion.div
                key={serviceSlug}
                variants={cardVariants}
                className="group"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/services/${serviceSlug}`}>
                  <motion.div
                    className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    whileHover={{ borderColor: "hsl(var(--primary)/30)" }}
                  >
                    {/* Background gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    />

                    {/* Service image */}
                    <motion.div
                      className="relative h-48 bg-muted overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${serviceData.image})` }}
                      />

                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />

                      {/* Category badge */}
                      <motion.div
                        className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-white text-xs font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {serviceData.category}
                      </motion.div>

                      {/* External link icon */}
                      <motion.div
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.div>
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <motion.h3
                        className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        {serviceData.title}
                      </motion.h3>

                      <motion.p
                        className="text-muted-foreground mb-4 leading-relaxed"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {serviceData.description}
                      </motion.p>

                      {/* CTA Button */}
                      <motion.div
                        className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span>Learn more</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Decorative elements */}
                    <motion.div
                      className="absolute bottom-4 right-4 w-3 h-3 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute top-20 right-6 w-2 h-2 bg-accent/50 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />

                    {/* Bottom accent line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-full transition-all duration-500"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Link href="/services">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3"
              >
                <Target className="w-5 h-5 mr-2" />
                View All Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
