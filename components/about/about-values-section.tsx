"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Lightbulb,
  Shield,
  Users,
  Zap,
  Globe,
  Diamond,
  Star,
} from "lucide-react";

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  principle: string;
  color: string;
  bgColor: string;
}

const values: Value[] = [
  {
    icon: Heart,
    title: "Passion-Driven",
    description:
      "We pour our hearts into every project, treating your success as our own. Our passion for excellence is the fuel that drives innovation.",
    principle: "Love what you do, and do what you love",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We don't just follow trends—we create them. Our commitment to pushing boundaries means you get solutions that set you apart.",
    principle: "Question everything, improve constantly",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Integrity Always",
    description:
      "Trust is earned through transparent communication, honest timelines, and delivering exactly what we promise—or better.",
    principle: "Do the right thing, even when no one is watching",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Your team and ours work as one. We believe the best solutions emerge when diverse minds come together with a shared vision.",
    principle: "Together we achieve more than the sum of our parts",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Speed & Quality",
    description:
      "Fast delivery doesn't mean cutting corners. Our processes are designed to maximize both velocity and excellence.",
    principle: "Move fast without breaking things",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "Every solution we create is designed with global accessibility and local relevance in mind, making technology work for everyone.",
    principle: "Think globally, act purposefully",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

export function AboutValuesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-muted/10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Geometric Patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rotate-45 rounded-xl" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-accent/20 rotate-12 rounded-lg" />
        <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-primary/30 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-accent/30 rounded-full" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Diamond className="w-4 h-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Values That{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Define Us
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These aren&apos;t just words on a wall. They&apos;re the
              principles that guide our decisions, shape our culture, and define
              how we show up for our clients every single day.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => {
              const IconComponent = value.icon;

              return (
                <Card
                  key={value.title}
                  className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Background Effects */}
                  <div
                    className={`absolute inset-0 ${value.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                  <CardContent className="p-8 relative">
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-8 h-8 ${value.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {value.description}
                      </p>

                      {/* Principle Quote */}
                      <div className="pt-4 border-t border-border/50 group-hover:border-primary/20 transition-colors duration-300">
                        <p className="text-xs italic text-muted-foreground/80 group-hover:text-foreground/60 transition-colors duration-300">
                          &ldquo;{value.principle}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Values in Action */}
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Values in Action</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See how our values translate into real benefits for our
                  clients and meaningful impact in every project.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Client Success</h4>
                  <p className="text-sm text-muted-foreground">
                    98% client satisfaction rate
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">
                    50+ patents and innovations
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Trust</h4>
                  <p className="text-sm text-muted-foreground">
                    Zero security incidents
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Partnership</h4>
                  <p className="text-sm text-muted-foreground">
                    Long-term relationships
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="text-center mt-12 pt-8 border-t border-border/50">
                <blockquote className="text-lg italic text-muted-foreground max-w-3xl mx-auto">
                  &ldquo;Our values aren&apos;t just ideals—they&apos;re our
                  competitive advantage. When you align passion with purpose,
                  extraordinary things happen.&rdquo;
                </blockquote>
                <cite className="block mt-4 text-sm font-medium">
                  — Leadership Team
                </cite>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
