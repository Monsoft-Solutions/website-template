"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

interface AnalyticsStatsCardProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    period: string;
    type: "increase" | "decrease" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
  delay?: number;
}

export function AnalyticsStatsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  delay = 0,
}: AnalyticsStatsCardProps) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const formatValue = (val: number | string) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  const getChangeColor = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "text-green-600 dark:text-green-400";
      case "decrease":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getChangeIcon = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "↗";
      case "decrease":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        className={cn(
          "hover:shadow-md transition-shadow duration-200",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {inView && typeof value === "number" ? (
              <CountUp
                end={value}
                duration={1.5}
                delay={delay}
                preserveValue
                formattingFn={(value) => value.toLocaleString()}
              />
            ) : (
              formatValue(value)
            )}
          </div>

          {change && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  getChangeColor(change.type)
                )}
              >
                {getChangeIcon(change.type)} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-muted-foreground">
                from {change.period}
              </span>
            </div>
          )}

          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
