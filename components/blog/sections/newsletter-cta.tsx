"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Mail,
  Users,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface NewsletterCTAProps {
  subscriberCount?: number;
  className?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const benefits = [
  {
    icon: TrendingUp,
    title: "Weekly Insights",
    description: "Get the latest trends delivered to your inbox",
  },
  {
    icon: Zap,
    title: "Exclusive Content",
    description: "Access premium articles and resources first",
  },
  {
    icon: Users,
    title: "Expert Network",
    description: "Connect with industry professionals and thought leaders",
  },
];

export function NewsletterCTA({
  subscriberCount = 50000,
  className = "",
}: NewsletterCTAProps) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className={`py-20 ${className}`} ref={ref}>
      <div className="container">
        <motion.div
          className="mx-auto max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-30" />

            {/* Floating Elements */}
            <div className="absolute top-8 right-8">
              <motion.div variants={pulseVariants} animate="animate">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-8 left-8">
              <motion.div
                variants={pulseVariants}
                animate="animate"
                transition={{ delay: 1 }}
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
              </motion.div>
            </div>

            <CardContent className="relative z-10 p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <motion.div variants={itemVariants}>
                  <Badge variant="outline" className="mb-6 px-4 py-2">
                    <Mail className="w-3 h-3 mr-2" />
                    Newsletter
                  </Badge>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    Your Success Story{" "}
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                      Starts Here
                    </span>
                  </h2>

                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    Join {subscriberCount.toLocaleString()}+ professionals
                    getting weekly insights delivered straight to their inbox.
                    No spam, just pure value.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-4 mb-8">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                          <benefit.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm mb-1">
                            {benefit.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {benefit.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="group" asChild>
                      <Link href="/contact">
                        Subscribe Now
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/blog">Browse Articles</Link>
                    </Button>
                  </div>
                </motion.div>

                {/* Stats & Social Proof */}
                <motion.div className="space-y-8" variants={itemVariants}>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {subscriberCount.toLocaleString()}+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Subscribers
                      </div>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50">
                      <div className="text-3xl font-bold text-primary mb-2">
                        4.9★
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average Rating
                      </div>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50">
                      <div className="text-3xl font-bold text-primary mb-2">
                        95%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Open Rate
                      </div>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50">
                      <div className="text-3xl font-bold text-primary mb-2">
                        Weekly
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Fresh Content
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full bg-yellow-400"
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm italic mb-3">
                      &quot;The insights I get from this newsletter have
                      directly contributed to my career growth. It&apos;s the
                      first email I read every week.&quot;
                    </blockquote>
                    <div className="text-sm font-medium">
                      Sarah Chen, Senior Developer
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>No Spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Unsubscribe Anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>100% Free</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
