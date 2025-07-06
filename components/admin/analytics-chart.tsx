"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { AnalyticsDataPoint } from "@/lib/types";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrendingUp, Calendar, Eye, Users } from "lucide-react";

interface AnalyticsChartProps {
  data: AnalyticsDataPoint[];
  title: string;
  type?: "line" | "area";
  showUniqueViews?: boolean;
  delay?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

export function AnalyticsChart({
  data,
  title,
  type = "area",
  showUniqueViews = true,
  delay = 0,
}: AnalyticsChartProps) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium text-sm">
              {new Date(label || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  {entry.name === "Total Views" ? (
                    <Eye className="h-3 w-3" style={{ color: entry.color }} />
                  ) : (
                    <Users className="h-3 w-3" style={{ color: entry.color }} />
                  )}
                  <span className="text-xs" style={{ color: entry.color }}>
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium">
                  {formatNumber(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const totalUniqueViews = data.reduce(
    (sum, item) => sum + item.uniqueViews,
    0
  );
  const hasData = data.length > 0 && totalViews > 0;

  if (!hasData) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No data available</p>
              <p className="text-sm text-muted-foreground">
                Chart will appear when analytics data is available
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (type === "area") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {formatNumber(totalViews)} total
                </Badge>
                {showUniqueViews && (
                  <Badge variant="outline" className="text-xs">
                    {formatNumber(totalUniqueViews)} unique
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="viewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="uniqueViewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/30"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#viewsGradient)"
                    name="Total Views"
                  />
                  {showUniqueViews && (
                    <Area
                      type="monotone"
                      dataKey="uniqueViews"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      fill="url(#uniqueViewsGradient)"
                      name="Unique Views"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {formatNumber(totalViews)} total
              </Badge>
              {showUniqueViews && (
                <Badge variant="outline" className="text-xs">
                  {formatNumber(totalUniqueViews)} unique
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted/30"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNumber}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                  name="Total Views"
                />
                {showUniqueViews && (
                  <Line
                    type="monotone"
                    dataKey="uniqueViews"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={{
                      fill: "hsl(var(--muted-foreground))",
                      strokeWidth: 2,
                      r: 3,
                    }}
                    name="Unique Views"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
