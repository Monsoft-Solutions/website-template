"use client";

import { useEffect, useState, useRef } from "react";
import { analytics } from "@/lib/utils/analytics";

interface BlogPostAnalyticsProps {
  postTitle: string;
  postCategory?: string;
  estimatedReadingTime: number; // in minutes
}

export function BlogPostAnalytics({
  postTitle,
  postCategory,
  estimatedReadingTime,
}: BlogPostAnalyticsProps) {
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [hasTrackedComplete, setHasTrackedComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const endOfArticleRef = useRef<HTMLDivElement | null>(null);

  // Track initial blog post view
  useEffect(() => {
    if (!hasTrackedView) {
      analytics.trackBlogPost.view(postTitle, postCategory);
      setHasTrackedView(true);
    }
  }, [postTitle, postCategory, hasTrackedView]);

  // Track when user reaches end of article
  useEffect(() => {
    if (typeof window === "undefined" || hasTrackedComplete) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedComplete) {
            const actualReadingTime = Math.round(
              (Date.now() - startTime) / 60000
            ); // Convert to minutes

            // Only track as "complete" if user spent reasonable time reading
            if (actualReadingTime >= Math.min(estimatedReadingTime * 0.5, 1)) {
              analytics.trackBlogPost.complete(postTitle, actualReadingTime);
              setHasTrackedComplete(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (endOfArticleRef.current) {
      observerRef.current.observe(endOfArticleRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [postTitle, estimatedReadingTime, hasTrackedComplete, startTime]);

  // Function to track social sharing (can be called from share buttons)
  const trackShare = (platform: string) => {
    analytics.trackBlogPost.share(postTitle, platform);
  };

  return (
    <>
      {/* Social sharing buttons with analytics */}
      <div className="flex gap-2 my-4">
        <button
          onClick={() => {
            trackShare("twitter");
            // Add actual Twitter sharing logic here
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                postTitle
              )}&url=${encodeURIComponent(window.location.href)}`,
              "_blank",
              "width=550,height=420"
            );
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Share on Twitter
        </button>

        <button
          onClick={() => {
            trackShare("facebook");
            // Add actual Facebook sharing logic here
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`,
              "_blank",
              "width=550,height=420"
            );
          }}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
        >
          Share on Facebook
        </button>

        <button
          onClick={() => {
            trackShare("linkedin");
            // Add actual LinkedIn sharing logic here
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                window.location.href
              )}`,
              "_blank",
              "width=550,height=420"
            );
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Share on LinkedIn
        </button>
      </div>

      {/* Invisible marker for end of article tracking */}
      <div ref={endOfArticleRef} className="h-1" aria-hidden="true" />
    </>
  );
}
