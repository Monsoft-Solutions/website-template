import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  loading?: boolean;
}

/**
 * Admin stats card component for displaying dashboard metrics
 * Shows key metrics with optional trend indicators
 */
export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  loading = false,
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend.value > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendVariant = () => {
    if (!trend) return "secondary";

    if (trend.value > 0) {
      return "default";
    } else if (trend.value < 0) {
      return "destructive";
    } else {
      return "secondary";
    }
  };

  const formatTrendValue = (value: number) => {
    const abs = Math.abs(value);
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    return `${sign}${abs}%`;
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </CardTitle>
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <Badge
              variant={getTrendVariant()}
              className="text-xs flex items-center gap-1"
            >
              {getTrendIcon()}
              {formatTrendValue(trend.value)}
            </Badge>
          )}
        </div>
        {trend && trend.label && (
          <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>
        )}
      </CardContent>
    </Card>
  );
}
