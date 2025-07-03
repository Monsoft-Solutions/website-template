"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle,
  Star,
  Crown,
  Zap,
  ArrowRight,
  DollarSign,
  Sparkles,
  Gift,
} from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface ServicePricingSectionProps {
  pricing: PricingTier[];
}

export function ServicePricingSection({ pricing }: ServicePricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

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
      className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background"
    >
      {/* Enhanced animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Multiple floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 80, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-56 h-56 bg-accent/5 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -60, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl"
          animate={{
            scale: [0.8, 1.4, 0.8],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Enhanced Section Header */}
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
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <DollarSign className="w-4 h-4" />
            </motion.div>
            Pricing Plans
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Choose Your</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Flexible pricing options designed to fit your budget and
            requirements. Get exactly what you need to succeed.
          </p>
        </motion.div>

        {/* Enhanced Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {pricing.map((tier, index) => {
            const isPopular = tier.popular;
            const IconComponent =
              index === 0 ? Star : index === 1 ? Crown : Zap;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`relative h-full transition-all duration-500 hover:shadow-2xl overflow-hidden ${
                    isPopular
                      ? "border-2 border-primary shadow-lg scale-105 bg-gradient-to-br from-card to-card/80"
                      : "border border-border hover:border-primary/30 bg-card/80 backdrop-blur-sm"
                  }`}
                >
                  {/* Enhanced popular badge */}
                  {isPopular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.2 + 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 shadow-lg border-0">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-3 h-3 mr-1" />
                        </motion.div>
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}

                  {/* Enhanced background glow effect */}
                  <motion.div
                    className={`absolute -inset-1 bg-gradient-to-r ${
                      isPopular
                        ? "from-primary/30 to-accent/30"
                        : "from-primary/10 to-accent/10"
                    } rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-5"
                    animate={{
                      backgroundPosition:
                        index % 2 === 0
                          ? ["0% 0%", "100% 100%"]
                          : ["100% 0%", "0% 100%"],
                    }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                      backgroundSize: "25px 25px",
                    }}
                  />

                  <CardHeader className="text-center relative z-10">
                    {/* Enhanced icon */}
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                        isPopular
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-gradient-to-br from-muted to-muted/50"
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={
                        inView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -180 }
                      }
                      transition={{
                        duration: 0.6,
                        delay: index * 0.2 + 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <IconComponent
                          className={`w-8 h-8 ${
                            isPopular ? "text-white" : "text-muted-foreground"
                          }`}
                        />
                      </motion.div>

                      {/* Icon glow effect */}
                      {isPopular && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-md opacity-0 group-hover:opacity-50"
                          animate={{
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </motion.div>

                    <CardTitle className="text-2xl font-bold mb-2">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      {tier.description}
                    </CardDescription>

                    {/* Enhanced price display */}
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        inView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                    >
                      <span
                        className={`text-4xl font-bold ${
                          isPopular ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {tier.price}
                      </span>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    {/* Enhanced features list */}
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            inView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{
                            duration: 0.4,
                            delay: index * 0.2 + featureIndex * 0.1 + 0.6,
                          }}
                        >
                          <motion.div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isPopular ? "bg-primary/20" : "bg-muted"
                            }`}
                            whileHover={{ scale: 1.2 }}
                          >
                            <CheckCircle
                              className={`w-3 h-3 ${
                                isPopular
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </motion.div>
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Enhanced CTA button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className={`w-full group transition-all duration-300 ${
                          isPopular
                            ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
                            : "border-primary/20 hover:bg-primary/10 hover:border-primary/50"
                        }`}
                        variant={isPopular ? "default" : "outline"}
                        size="lg"
                        asChild
                      >
                        <Link href="/contact">
                          Choose Plan
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          isPopular ? "bg-primary/30" : "bg-muted-foreground/30"
                        }`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2 + index * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  {/* Value indicator for popular plan */}
                  {isPopular && (
                    <motion.div
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full">
                        <Gift className="w-3 h-3 text-accent" />
                        <span className="text-xs font-medium text-accent">
                          Best Value
                        </span>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-border/30 text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium">
              All plans include free consultation
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
