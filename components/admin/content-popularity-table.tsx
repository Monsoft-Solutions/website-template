"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ContentViewStats } from "@/lib/types";
import { Eye, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ContentPopularityTableProps {
  title: string;
  data: ContentViewStats[];
  contentType: "blog_post" | "service";
  delay?: number;
}

export function ContentPopularityTable({
  title,
  data,
  contentType,
  delay = 0,
}: ContentPopularityTableProps) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getBadgeVariant = (contentType: "blog_post" | "service") => {
    return contentType === "blog_post" ? "default" : "secondary";
  };

  const getBadgeLabel = (contentType: "blog_post" | "service") => {
    return contentType === "blog_post" ? "Blog Post" : "Service";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (data.length === 0) {
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
          <CardContent>
            <div className="text-center py-12 space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                No {contentType === "blog_post" ? "blog posts" : "services"}{" "}
                found
              </p>
              <p className="text-sm text-muted-foreground">
                Content popularity will appear here once you have views
              </p>
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
            <Badge variant="outline" className="text-xs">
              {data.length} {data.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4" />
                      Total Views
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Unique Views</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      This Month
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.contentId} className="hover:bg-muted/50">
                    <TableCell className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            /{item.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getBadgeVariant(item.contentType)}
                        className="text-xs"
                      >
                        {getBadgeLabel(item.contentType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">
                        {formatNumber(item.totalViews)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">
                        {formatNumber(item.uniqueViews)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">
                        {formatNumber(item.viewsThisMonth)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt.toString())}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary stats */}
          {data.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="text-sm font-semibold">
                  {formatNumber(
                    data.reduce((sum, item) => sum + item.totalViews, 0)
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Unique Views</p>
                <p className="text-sm font-semibold">
                  {formatNumber(
                    data.reduce((sum, item) => sum + item.uniqueViews, 0)
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Avg. Views</p>
                <p className="text-sm font-semibold">
                  {formatNumber(
                    Math.round(
                      data.reduce((sum, item) => sum + item.totalViews, 0) /
                        data.length
                    )
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
