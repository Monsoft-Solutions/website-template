"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Service } from "@/lib/types/service.type";

interface ServicesGridProps {
  services: Service[];
  categories: string[];
  isLoading: boolean;
  error?: string | null;
}

export function ServicesGrid({
  services,
  categories,
  isLoading,
  error,
}: ServicesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filteredServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">Error loading services: {error}</p>
      </div>
    );
  }

  return (
    <div ref={ref}>
      {/* Category Filter */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Badge
          variant={selectedCategory === null ? "default" : "secondary"}
          className="cursor-pointer px-4 py-2 text-sm transition-all"
          onClick={() => setSelectedCategory(null)}
        >
          All Services
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "secondary"}
            className="cursor-pointer px-4 py-2 text-sm transition-all"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </motion.div>

      {/* Services Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {filteredServices.map((service) => (
          <motion.div key={service.id} variants={itemVariants}>
            <Card
              className="group h-full flex flex-col overflow-hidden border-0 shadow-lg transition-all duration-300"
              style={
                {
                  background:
                    hoveredId === service.id
                      ? "linear-gradient(to bottom right, var(--card-bg, hsl(var(--background))), hsl(var(--background)))"
                      : "hsl(var(--background))",
                  "--card-bg": "hsl(var(--primary) / 0.05)",
                } as React.CSSProperties
              }
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardHeader className="relative pb-0">
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300" />

                <div className="flex items-center justify-between mb-4 relative">
                  <Badge
                    variant="outline"
                    className="group-hover:border-primary/40 transition-colors duration-300"
                  >
                    {service.category}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {service.timeline}
                  </div>
                </div>

                <CardTitle className="relative group-hover:text-primary transition-colors duration-300 text-xl">
                  {service.title}
                </CardTitle>

                <CardDescription className="text-muted-foreground mt-2 relative">
                  {service.shortDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow justify-between pt-6 relative">
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-sm text-foreground mb-2">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Starting from
                      </span>
                      <span className="font-medium">
                        {service.pricing[0]?.price || "Contact us"}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full group/btn transition-all"
                    variant={hoveredId === service.id ? "default" : "secondary"}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex items-center justify-center"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
