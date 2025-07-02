import React from "react";

/**
 * Intersection Observer hook for lazy loading
 * @param ref Reference to the element to observe
 * @param options Intersection observer options
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Mark the start of a performance measurement
   */
  mark: (name: string): void => {
    if (typeof window !== "undefined" && "performance" in window) {
      window.performance.mark(name);
    }
  },

  /**
   * Measure performance between two marks
   */
  measure: (name: string, startMark: string, endMark?: string): void => {
    if (typeof window !== "undefined" && "performance" in window) {
      window.performance.measure(name, startMark, endMark);
    }
  },

  /**
   * Get performance entries
   */
  getEntries: (type?: string): PerformanceEntry[] => {
    if (typeof window !== "undefined" && "performance" in window) {
      return type
        ? window.performance.getEntriesByType(type)
        : window.performance.getEntries();
    }
    return [];
  },
};

/**
 * Resource prefetching utilities
 */
export const prefetch = {
  /**
   * Prefetch a resource
   */
  resource: (href: string, as?: string): void => {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    if (as) link.as = as;

    document.head.appendChild(link);
  },

  /**
   * Preload a resource with high priority
   */
  preload: (href: string, as: string): void => {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;

    document.head.appendChild(link);
  },

  /**
   * Prefetch DNS for faster connections
   */
  dns: (hostname: string): void => {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = `//${hostname}`;

    document.head.appendChild(link);
  },
};

/**
 * Debounce utility for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if an element is in viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
