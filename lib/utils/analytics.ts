import { sendGAEvent } from "@next/third-parties/google";
import { clientEnv } from "../env-client";

// Performance API interfaces
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Analytics event categories as constants
export const ANALYTICS_CATEGORIES = {
  NAVIGATION: "navigation",
  BLOG: "blog",
  FORMS: "forms",
  SOCIAL: "social",
  ENGAGEMENT: "engagement",
  CONVERSION: "conversion",
  DOWNLOADS: "downloads",
  OUTBOUND: "outbound",
  PERFORMANCE: "performance",
  ERRORS: "errors",
} as const;

// Types for analytics events
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    category?: string;
    quantity?: number;
    price?: number;
  }>;
}

export interface CustomEvent {
  event_name: string;
  [key: string]: string | number | boolean;
}

/**
 * Basic event tracking with error handling
 */
export const trackEvent = (eventData: GAEvent): void => {
  try {
    if (
      typeof window === "undefined" ||
      !clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
    ) {
      return;
    }

    sendGAEvent("event", eventData.action, {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value,
    });
  } catch (error) {
    console.warn("Failed to track event:", error);
  }
};

// Common website events
export const analytics = {
  // Navigation events
  trackPageView: (page_title: string, page_location?: string): void => {
    trackEvent({
      action: "page_view",
      category: ANALYTICS_CATEGORIES.NAVIGATION,
      label: page_title,
    });

    if (page_location) {
      try {
        sendGAEvent("event", "page_view", {
          page_title,
          page_location,
        });
      } catch (error) {
        console.warn("Failed to track page view:", error);
      }
    }
  },

  // Blog events
  trackBlogPost: {
    view: (postTitle: string, category?: string): void => {
      trackEvent({
        action: "blog_post_view",
        category: ANALYTICS_CATEGORIES.BLOG,
        label: postTitle,
      });

      // Custom event for more detailed tracking
      try {
        sendGAEvent("event", "blog_post_read", {
          post_title: postTitle,
          post_category: category || "uncategorized",
        });
      } catch (error) {
        console.warn("Failed to track blog post view:", error);
      }
    },

    share: (postTitle: string, platform: string): void => {
      trackEvent({
        action: "blog_post_share",
        category: ANALYTICS_CATEGORIES.SOCIAL,
        label: `${platform}: ${postTitle}`,
      });
    },

    complete: (postTitle: string, readingTime: number): void => {
      trackEvent({
        action: "blog_post_complete",
        category: ANALYTICS_CATEGORIES.ENGAGEMENT,
        label: postTitle,
        value: readingTime,
      });
    },
  },

  // Contact form events
  trackContact: {
    formStart: (): void => {
      trackEvent({
        action: "contact_form_start",
        category: ANALYTICS_CATEGORIES.FORMS,
      });
    },

    formSubmit: (): void => {
      trackEvent({
        action: "contact_form_submit",
        category: ANALYTICS_CATEGORIES.FORMS,
      });
    },

    formComplete: (): void => {
      trackEvent({
        action: "contact_form_complete",
        category: ANALYTICS_CATEGORIES.CONVERSION,
      });
    },
  },

  // Search events
  trackSearch: (searchTerm: string, resultsCount: number): void => {
    try {
      sendGAEvent("event", "search", {
        search_term: searchTerm,
        results_count: resultsCount,
      });
    } catch (error) {
      console.warn("Failed to track search:", error);
    }
  },

  // Download events
  trackDownload: (fileName: string, fileType: string): void => {
    trackEvent({
      action: "file_download",
      category: ANALYTICS_CATEGORIES.DOWNLOADS,
      label: `${fileType}: ${fileName}`,
    });
  },

  // External link clicks
  trackExternalLink: (url: string, linkText?: string): void => {
    trackEvent({
      action: "external_link_click",
      category: ANALYTICS_CATEGORIES.OUTBOUND,
      label: linkText || url,
    });
  },

  // Email subscription
  trackEmailSignup: (source: string): void => {
    trackEvent({
      action: "email_signup",
      category: ANALYTICS_CATEGORIES.CONVERSION,
      label: source,
    });
  },

  // Performance tracking
  trackPerformance: (
    metricName: string,
    value: number,
    unit: string = "ms"
  ): void => {
    trackEvent({
      action: "performance_metric",
      category: ANALYTICS_CATEGORIES.PERFORMANCE,
      label: `${metricName} (${unit})`,
      value: Math.round(value),
    });
  },

  // Error tracking
  trackError: (
    errorType: string,
    errorMessage: string,
    errorLocation?: string
  ): void => {
    trackEvent({
      action: "error",
      category: ANALYTICS_CATEGORIES.ERRORS,
      label: `${errorType}: ${errorMessage}`,
    });

    try {
      sendGAEvent("event", "exception", {
        description: errorMessage,
        fatal: false,
        error_location: errorLocation,
      });
    } catch (error) {
      console.warn("Failed to track error:", error);
    }
  },
};

// Conversion tracking
export const trackConversion = (conversionData: ConversionEvent) => {
  if (
    typeof window === "undefined" ||
    !clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  ) {
    return;
  }

  sendGAEvent("event", "conversion", conversionData);
};

// Enhanced e-commerce tracking (if applicable)
export const trackPurchase = (transactionData: {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) => {
  trackConversion({
    event_name: "purchase",
    ...transactionData,
  });
};

// Custom event with flexible parameters
export const trackCustomEvent = (eventData: CustomEvent) => {
  if (
    typeof window === "undefined" ||
    !clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  ) {
    return;
  }

  sendGAEvent("event", eventData.event_name, eventData);
};

// Performance monitoring utilities
export const performanceMonitoring = {
  // Core Web Vitals tracking
  trackWebVitals: () => {
    if (typeof window === "undefined") return;

    // Track LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          analytics.trackPerformance("LCP", entry.startTime);
        }
      }
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // Track FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === "first-input") {
          const firstInputEntry = entry as PerformanceEventTiming;
          const fid = firstInputEntry.processingStart - entry.startTime;
          analytics.trackPerformance("FID", fid);
        }
      }
    }).observe({ entryTypes: ["first-input"] });

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      analytics.trackPerformance("CLS", clsValue * 1000); // Convert to ms equivalent
    }).observe({ entryTypes: ["layout-shift"] });
  },

  // Page load timing
  trackPageLoadTime: () => {
    if (typeof window === "undefined") return;

    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      analytics.trackPerformance(
        "DOM_Content_Loaded",
        navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart
      );
      analytics.trackPerformance(
        "Load_Complete",
        navigation.loadEventEnd - navigation.loadEventStart
      );
      analytics.trackPerformance(
        "Total_Load_Time",
        navigation.loadEventEnd - navigation.fetchStart
      );
    });
  },

  // Resource loading performance
  trackResourceTiming: () => {
    if (typeof window === "undefined") return;

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > 1000) {
          // Only track resources that take longer than 1s
          analytics.trackPerformance(
            `Resource_Load_${entry.name.split("/").pop()}`,
            entry.duration
          );
        }
      }
    }).observe({ entryTypes: ["resource"] });
  },
};

// Initialize performance monitoring (call this in _app.tsx or layout.tsx)
export const initializeAnalytics = () => {
  if (typeof window === "undefined") return;

  // Initialize performance monitoring
  performanceMonitoring.trackWebVitals();
  performanceMonitoring.trackPageLoadTime();
  performanceMonitoring.trackResourceTiming();

  // Track initial page view
  analytics.trackPageView(document.title, window.location.href);
};

// Utility to check if analytics is enabled
export const isAnalyticsEnabled = () => {
  return (
    typeof window !== "undefined" && !!clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  );
};
