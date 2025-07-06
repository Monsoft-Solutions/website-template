"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import type { ContactSubmissionChartData } from "@/app/api/admin/contact-submissions/analytics/route";

interface ContactSubmissionTrendsChartProps {
  data: ContactSubmissionChartData[];
  title?: string;
  period?: string;
  delay?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

export function ContactSubmissionTrendsChart({
  data,
  title = "Submission Trends",
  period = "month",
  delay = 0,
}: ContactSubmissionTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {title} ({period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-80 text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No trend data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      if (period === "today") {
        // Format hour data (e.g., "2024-01-15 14:00" -> "2 PM")
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });
      } else if (period === "week" || period === "month") {
        // Format daily data (e.g., "2024-01-15" -> "Jan 15")
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (period === "quarter") {
        // Format weekly data (e.g., "2024-W03" -> "Week 3")
        if (dateStr.includes("W")) {
          const week = dateStr.split("W")[1];
          return `W${week}`;
        }
        return dateStr;
      } else if (period === "year") {
        // Format monthly data (e.g., "2024-01" -> "Jan 2024")
        const [year, month] = dateStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-4 shadow-md">
          <p className="font-medium mb-2">{formatDate(label || "")}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(
    ...data.map((d) =>
      Math.max(d.submissions, d.newSubmissions, d.respondedSubmissions)
    )
  );

  const yAxisDomain = maxValue > 0 ? [0, Math.ceil(maxValue * 1.1)] : [0, 10];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title} ({period})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track submission volume and status changes over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-xs"
                />
                <YAxis domain={yAxisDomain} className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Total Submissions"
                />
                <Line
                  type="monotone"
                  dataKey="newSubmissions"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  name="New Submissions"
                />
                <Line
                  type="monotone"
                  dataKey="respondedSubmissions"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Responded"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
