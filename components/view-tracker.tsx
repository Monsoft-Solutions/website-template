"use client";

import { useEffect } from "react";
import { useRecordView } from "@/lib/hooks/use-analytics.hook";

interface ViewTrackerProps {
  contentType: "blog_post" | "service";
  contentId: string;
  enabled?: boolean;
}

/**
 * Component that automatically tracks views when mounted
 * Add this to blog post and service detail pages
 */
export function ViewTracker({
  contentType,
  contentId,
  enabled = true,
}: ViewTrackerProps) {
  const { recordView } = useRecordView();

  useEffect(() => {
    if (!enabled || !contentId) return;

    // Small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      recordView(contentType, contentId);
    }, 1000);

    return () => clearTimeout(timer);
  }, [contentType, contentId, enabled, recordView]);

  // This component doesn't render anything
  return null;
}

/**
 * Example usage in a blog post page:
 *
 * ```tsx
 * import { ViewTracker } from "@/components/view-tracker";
 *
 * export default function BlogPostPage({ post }) {
 *   return (
 *     <div>
 *       <ViewTracker contentType="blog_post" contentId={post.id} />
 *       <h1>{post.title}</h1>
 *       <div>{post.content}</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * Example usage in a service page:
 *
 * ```tsx
 * import { ViewTracker } from "@/components/view-tracker";
 *
 * export default function ServicePage({ service }) {
 *   return (
 *     <div>
 *       <ViewTracker contentType="service" contentId={service.id} />
 *       <h1>{service.title}</h1>
 *       <div>{service.description}</div>
 *     </div>
 *   );
 * }
 * ```
 */
