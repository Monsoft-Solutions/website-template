"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function ServicePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Breadcrumb skeleton */}
        <div className="absolute top-8 left-0 w-full z-20">
          <div className="container">
            <div className="flex items-center space-x-2 text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <Skeleton className="h-8 w-24 rounded-full" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="mb-6"
              >
                <Skeleton className="h-16 w-3/4" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                className="mb-8 space-y-2"
              >
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </motion.div>
              <div className="flex gap-4 mb-8">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-36" />
              </div>
              <div className="flex gap-6">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Skeleton className="absolute -bottom-6 -left-6 h-20 w-20 rounded-lg" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              >
                <Skeleton className="absolute -top-4 -right-4 h-16 w-32 rounded-lg" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <Skeleton className="h-8 w-32 mx-auto rounded-full" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="mb-4"
            >
              <Skeleton className="h-12 w-64 mx-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              <Skeleton className="h-6 w-96 mx-auto" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="p-8 border rounded-2xl"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              >
                <Skeleton className="h-12 w-12 mb-6 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-1 w-full rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section Skeleton */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left side */}
            <div>
              <Skeleton className="h-8 w-32 mb-6 rounded-full" />
              <Skeleton className="h-12 w-64 mb-6" />
              <Skeleton className="h-6 w-full mb-8" />

              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-1 w-full rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div>
              <div className="p-8 border rounded-3xl">
                <Skeleton className="h-8 w-32 mx-auto mb-8" />
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="p-4 border rounded-xl"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section Skeleton */}
      <section className="py-24 bg-accent/5">
        <div className="container">
          <div className="text-center mb-20">
            <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative mb-16">
                <div className="flex justify-center">
                  <div className="w-full max-w-lg">
                    <motion.div
                      className="p-8 border rounded-2xl"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-14 w-14 mb-6 rounded-xl" />
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-6" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Skeleton */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-20">
            <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="p-8 border rounded-2xl"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              >
                <div className="text-center mb-6">
                  <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-2xl" />
                  <Skeleton className="h-6 w-20 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <Skeleton className="h-8 w-24 mx-auto" />
                </div>
                <div className="space-y-3 mb-8">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Sections Skeleton */}
      <section className="py-24 bg-accent/5">
        <div className="container">
          <div className="text-center mb-20">
            <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="p-6 border rounded-xl"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </motion.div>
            ))}
          </div>

          {/* CTA Section Skeleton */}
          <div className="text-center">
            <motion.div
              className="p-12 border rounded-3xl max-w-2xl mx-auto"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Skeleton className="h-16 w-16 mx-auto mb-6 rounded-full" />
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto mb-8" />
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-40" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
