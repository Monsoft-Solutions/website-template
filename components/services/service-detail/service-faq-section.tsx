"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef, useState } from "react";
import {
  HelpCircle,
  Plus,
  Minus,
  MessageSquare,
  Lightbulb,
  Search,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceFaqSectionProps {
  faq: FAQ[];
}

export function ServiceFaqSection({ faq }: ServiceFaqSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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

  const answerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
      },
    },
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Question mark floating animation */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-16 h-16 text-primary/20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 15, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <HelpCircle className="w-full h-full" />
        </motion.div>

        {/* Lightbulb floating animation */}
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-12 h-12 text-accent/20"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.7, 0.2],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Lightbulb className="w-full h-full" />
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
                rotate: [0, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageSquare className="w-4 h-4" />
            </motion.div>
            Frequently Asked
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Common</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about our services.
            Can&apos;t find what you&apos;re looking for? Feel free to contact
            us.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="space-y-4">
            {faq.map((item, index) => {
              const isOpen = openItems.has(index);

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    whileHover={{ borderColor: "hsl(var(--primary)/30)" }}
                  >
                    {/* Question */}
                    <motion.button
                      className="w-full p-6 text-left flex items-start gap-4 hover:bg-muted/30 transition-colors duration-200"
                      onClick={() => toggleItem(index)}
                      whileHover={{ backgroundColor: "hsl(var(--muted)/30)" }}
                    >
                      {/* Question number */}
                      <motion.div
                        className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-semibold"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "hsl(var(--primary)/20)",
                        }}
                      >
                        {index + 1}
                      </motion.div>

                      {/* Question text */}
                      <div className="flex-1 min-w-0">
                        <motion.h3
                          className="text-lg font-semibold text-foreground pr-4"
                          whileHover={{ color: "hsl(var(--primary))" }}
                        >
                          {item.question}
                        </motion.h3>
                      </div>

                      {/* Toggle icon */}
                      <motion.div
                        className="flex-shrink-0 p-1"
                        variants={iconVariants}
                        animate={isOpen ? "open" : "closed"}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                        >
                          {isOpen ? (
                            <Minus className="w-full h-full" />
                          ) : (
                            <Plus className="w-full h-full" />
                          )}
                        </motion.div>
                      </motion.div>
                    </motion.button>

                    {/* Answer */}
                    <motion.div
                      variants={answerVariants}
                      initial="hidden"
                      animate={isOpen ? "visible" : "hidden"}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="px-6 pb-6 pl-18"
                        initial={{ opacity: 0 }}
                        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: isOpen ? 0.2 : 0, duration: 0.3 }}
                      >
                        <motion.div
                          className="p-4 bg-muted/20 rounded-xl border-l-4 border-primary/30"
                          whileHover={{ borderColor: "hsl(var(--primary))" }}
                        >
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute bottom-4 right-6 w-1 h-1 bg-accent/50 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </motion.div>

                  {/* Side indicator */}
                  <motion.div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom call-to-action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full text-primary transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">
              Still have questions? Contact us
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
