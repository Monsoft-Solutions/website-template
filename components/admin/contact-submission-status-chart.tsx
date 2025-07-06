"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Circle,
  CheckCircle,
  MessageSquareReply,
  TrendingUp,
} from "lucide-react";

interface ContactSubmissionStatusChartProps {
  data: {
    newSubmissions: number;
    readSubmissions: number;
    respondedSubmissions: number;
  };
  title?: string;
  delay?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

interface ChartLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      name: string;
      value: number;
      icon: React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
      }>;
    };
  }>;
}

const COLORS = {
  new: "#ef4444", // red-500
  read: "#f59e0b", // amber-500
  responded: "#10b981", // emerald-500
};

const STATUS_ICONS = {
  new: Circle,
  read: CheckCircle,
  responded: MessageSquareReply,
};

const STATUS_LABELS = {
  new: "New",
  read: "Read",
  responded: "Responded",
};

export function ContactSubmissionStatusChart({
  data,
  title = "Submission Status Distribution",
  delay = 0,
}: ContactSubmissionStatusChartProps) {
  const chartData = [
    {
      name: STATUS_LABELS.new,
      value: data.newSubmissions,
      color: COLORS.new,
      icon: STATUS_ICONS.new,
    },
    {
      name: STATUS_LABELS.read,
      value: data.readSubmissions,
      color: COLORS.read,
      icon: STATUS_ICONS.read,
    },
    {
      name: STATUS_LABELS.responded,
      value: data.respondedSubmissions,
      color: COLORS.responded,
      icon: STATUS_ICONS.responded,
    },
  ].filter((item) => item.value > 0); // Only show statuses with data

  const total =
    data.newSubmissions + data.readSubmissions + data.respondedSubmissions;

  if (total === 0) {
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
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No submission data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const CustomTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} submissions ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: ChartLegendProps) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index: number) => {
          const Icon = entry.payload.icon;
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4" style={{ color: entry.color }} />
              <span className="font-medium">{entry.payload.value}</span>
              <span className="text-muted-foreground">
                {entry.payload.name} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

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
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total submissions: {total}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
