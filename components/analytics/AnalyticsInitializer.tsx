"use client";

import { useEffect } from "react";
import { initializeAnalytics, isAnalyticsEnabled } from "@/lib/utils/analytics";

export function AnalyticsInitializer() {
  useEffect(() => {
    if (isAnalyticsEnabled()) {
      // Initialize analytics with a small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        initializeAnalytics();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
