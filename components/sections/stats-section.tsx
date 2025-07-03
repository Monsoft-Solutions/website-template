"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/utils/analytics";
import {
  Clock,
  Gauge,
  FileText,
  Package,
  Users,
  Star,
  Download,
  TrendingUp,
} from "lucide-react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const stats: Stat[] = [
  {
    label: "Load Time",
    value: 0.8,
    suffix: "s",
    prefix: "<",
    icon: Clock,
    description: "Average page load time",
    color: "text-blue-500",
  },
  {
    label: "Performance Score",
    value: 98,
    suffix: "/100",
    icon: Gauge,
    description: "Google Lighthouse score",
    color: "text-green-500",
  },
  {
    label: "Pre-built Pages",
    value: 8,
    suffix: "+",
    icon: FileText,
    description: "Ready-to-use pages",
    color: "text-purple-500",
  },
  {
    label: "UI Components",
    value: 25,
    suffix: "+",
    icon: Package,
    description: "Reusable components",
    color: "text-orange-500",
  },
  {
    label: "GitHub Stars",
    value: 1200,
    suffix: "+",
    icon: Star,
    description: "Community support",
    color: "text-yellow-500",
  },
  {
    label: "Downloads",
    value: 5400,
    suffix: "+",
    icon: Download,
    description: "Template downloads",
    color: "text-pink-500",
  },
  {
    label: "Active Users",
    value: 890,
    suffix: "+",
    icon: Users,
    description: "Monthly active users",
    color: "text-indigo-500",
  },
  {
    label: "Growth Rate",
    value: 15,
    suffix: "%",
    icon: TrendingUp,
    description: "Monthly growth",
    color: "text-red-500",
  },
];

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({
  endValue,
  duration = 2000,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCurrentValue(endValue * easeOut);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCurrentValue(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration]);

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return Math.round(value).toString();
  };

  return (
    <span>
      {prefix}
      {formatValue(currentValue)}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const handleStatClick = (statLabel: string) => {
    trackEvent({
      action: "stat_explore",
      category: "engagement",
      label: statLabel,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-2" />
              Performance & Growth
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Numbers That{" "}
              <span className="text-primary">Speak for Themselves</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real metrics from our production-ready template, backed by
              community adoption and performance benchmarks.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleStatClick(stat.label)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardContent className="p-6 text-center relative">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>

                    {/* Animated Value */}
                    <div className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                      <AnimatedCounter
                        endValue={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        duration={2000 + index * 200}
                      />
                    </div>

                    {/* Label */}
                    <div className="text-sm font-medium mb-1">{stat.label}</div>

                    {/* Description */}
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gauge className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Core Web Vitals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Excellent scores across all Google Core Web Vitals metrics
                </p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-green-600">1.2s</div>
                    <div className="text-muted-foreground">LCP</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">8ms</div>
                    <div className="text-muted-foreground">FID</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">0.1</div>
                    <div className="text-muted-foreground">CLS</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">SEO Ready</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect SEO scores with automatic optimization features
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-blue-600">100/100</div>
                    <div className="text-muted-foreground">SEO Score</div>
                  </div>
                  <div>
                    <div className="font-bold text-blue-600">A+</div>
                    <div className="text-muted-foreground">Accessibility</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bundle Size</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimized bundle with code splitting and tree shaking
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-purple-600">45kb</div>
                    <div className="text-muted-foreground">Initial JS</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">12kb</div>
                    <div className="text-muted-foreground">CSS</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Message */}
          <div className="text-center">
            <p className="text-muted-foreground">
              These metrics are from real production deployments. Your results
              may vary based on content and hosting configuration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
