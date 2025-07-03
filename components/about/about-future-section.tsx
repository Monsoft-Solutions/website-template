"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Zap,
  Brain,
  Globe,
  Leaf,
  Sparkles,
  ArrowRight,
  Eye,
  Target,
} from "lucide-react";
import Link from "next/link";

interface FutureInitiative {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  timeline: string;
  impact: string;
  color: string;
  bgColor: string;
}

const futureInitiatives: FutureInitiative[] = [
  {
    icon: Brain,
    title: "AI-Powered Development",
    description:
      "Revolutionary tools that accelerate development by 300% while maintaining human creativity at the core.",
    timeline: "2024-2025",
    impact: "Transform development workflow",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Leaf,
    title: "Carbon-Neutral Technology",
    description:
      "Leading the industry with 100% sustainable development practices and carbon-negative hosting solutions.",
    timeline: "2024-2026",
    impact: "Environmental leadership",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Globe,
    title: "Global Impact Platform",
    description:
      "Democratizing access to cutting-edge technology for underserved communities worldwide.",
    timeline: "2025-2027",
    impact: "Social transformation",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Quantum-Ready Solutions",
    description:
      "Preparing today's applications for tomorrow's quantum computing revolution.",
    timeline: "2026-2030",
    impact: "Next-gen computing",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export function AboutFutureSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,white,transparent)] dark:bg-grid-slate-700/25 opacity-30" />

        {/* Floating Shapes */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-primary/30 rounded-full animate-float" />
        <div
          className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-accent/30 rotate-45"
          style={{ animationDuration: "6s" }}
        />
        <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary/20 rounded-full animate-bounce delay-500" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              The Future We&apos;re Building
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Shaping{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Tomorrow
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We don&apos;t just adapt to the future—we create it. Our vision
              extends beyond today&apos;s challenges to anticipate and solve the
              problems of tomorrow, building technology that makes the world
              more connected, sustainable, and equitable.
            </p>
          </div>

          {/* Vision Statement */}
          <Card className="mb-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
            <CardContent className="p-8 lg:p-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our 2030 Vision</h3>
              <blockquote className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                &ldquo;By 2030, we will be the catalyst that transforms how
                humanity interacts with technology— making it more intuitive,
                sustainable, and accessible to everyone, everywhere.&rdquo;
              </blockquote>
            </CardContent>
          </Card>

          {/* Future Initiatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {futureInitiatives.map((initiative, index) => {
              const IconComponent = initiative.icon;

              return (
                <Card
                  key={initiative.title}
                  className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  {/* Background Effects */}
                  <div
                    className={`absolute inset-0 ${initiative.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                  <CardContent className="p-8 relative">
                    {/* Icon & Timeline */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`w-16 h-16 ${initiative.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                      >
                        <IconComponent
                          className={`w-8 h-8 ${initiative.color}`}
                        />
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {initiative.timeline}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {initiative.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {initiative.description}
                      </p>

                      {/* Impact Badge */}
                      <div className="pt-4 border-t border-border/50 group-hover:border-primary/20 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-accent">
                            {initiative.impact}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${initiative.color.replace(
                            "text-",
                            "bg-"
                          )}`}
                        />
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse delay-100 ${initiative.color.replace(
                            "text-",
                            "bg-"
                          )}`}
                        />
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse delay-200 ${initiative.color.replace(
                            "text-",
                            "bg-"
                          )}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Innovation Lab */}
          <Card className="mb-20 bg-gradient-to-r from-accent/10 to-primary/10 border-none">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Innovation Lab</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Our dedicated R&D facility where tomorrow&apos;s
                    breakthrough technologies are born today. From quantum
                    computing experiments to sustainable tech innovations, our
                    lab is where the impossible becomes inevitable.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-accent mb-1">
                        15+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Projects
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        50+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Patents Filed
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/innovation">
                      Explore Our Research
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-24 h-24 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold">
                        Innovation in Progress
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Where Ideas Become Reality
                      </p>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-bounce" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Future */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Build the Future?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us on this incredible journey. Whether you&apos;re a client,
              partner, or future team member, let&apos;s create tomorrow&apos;s
              solutions today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <Link href="/contact">
                  Start Your Future Project
                  <Rocket className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/careers">Join Our Innovation Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
