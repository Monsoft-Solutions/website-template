"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Home,
  Search,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface ServiceErrorProps {
  error: string;
  onRetry: () => void;
}

export function ServiceError({ error, onRetry }: ServiceErrorProps) {
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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-destructive/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-muted/20 rounded-full blur-2xl"
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
        <motion.div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          animate={{
            scale: [0.8, 1.3, 0.8],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error icon with enhanced animation */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="relative inline-block"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-full flex items-center justify-center mx-auto shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <AlertCircle className="w-12 h-12 text-destructive" />
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-destructive/20 rounded-full blur-xl opacity-0"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Error message */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Something Went</span>
            <span className="block bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
              Wrong
            </span>
          </h1>

          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              We encountered an error while loading the service details.
            </p>
            {error && (
              <motion.div
                className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, delay: 1 }}
              >
                <p className="text-sm text-destructive font-mono">{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onRetry}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg group"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              Try Again
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="backdrop-blur-sm hover:bg-primary/10 border-primary/20 hover:border-primary/50 group"
              asChild
            >
              <Link href="/services">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Services
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional options */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground group"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Home
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground group"
              asChild
            >
              <Link href="/services">
                <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Browse Services
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground group"
              asChild
            >
              <Link href="/contact">
                <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Contact Support
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Help text */}
        <motion.div variants={itemVariants} className="mt-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/30 text-muted-foreground text-sm"
            whileHover={{
              scale: 1.05,
              backgroundColor: "hsl(var(--muted)/0.7)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <AlertCircle className="w-4 h-4" />
            </motion.div>
            <span>
              If the problem persists, please contact our support team
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
