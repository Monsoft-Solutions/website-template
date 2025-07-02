/**
 * Simple in-memory cache for API responses and data
 * In production, consider using Redis or other caching solutions
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTtl = 5 * 60 * 1000; // 5 minutes

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTtl);

    this.cache.set(key, {
      data: value,
      timestamp: now,
      expiresAt,
    });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanup(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Global cache instance
export const cache = new MemoryCache();

/**
 * Cached fetch wrapper
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  ttl?: number
): Promise<T> {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;

  // Try to get from cache first
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as T;

  // Cache the result
  cache.set(cacheKey, data, ttl);

  return data;
}

/**
 * Memoization utility for expensive functions
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  ttl?: number
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    const cacheKey = `memo:${fn.name}:${JSON.stringify(args)}`;

    const cached = cache.get<TReturn>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(cacheKey, result, ttl);

    return result;
  };
}

/**
 * Async memoization utility
 */
export function memoizeAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  ttl?: number
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const cacheKey = `async-memo:${fn.name}:${JSON.stringify(args)}`;

    const cached = cache.get<TReturn>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(cacheKey, result, ttl);

    return result;
  };
}

/**
 * Cache decorator for class methods
 */
export function Cached(ttl?: number) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const cacheKey = `method:${
        target?.constructor.name
      }:${propertyKey}:${JSON.stringify(args)}`;

      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache utilities for specific use cases
 */
export const cacheUtils = {
  /**
   * Cache blog posts
   */
  blogPosts: {
    list: (page = 1, limit = 10) => `blog:posts:${page}:${limit}`,
    single: (slug: string) => `blog:post:${slug}`,
    category: (category: string, page = 1) =>
      `blog:category:${category}:${page}`,
    tag: (tag: string, page = 1) => `blog:tag:${tag}:${page}`,
  },

  /**
   * Cache API responses
   */
  api: {
    contact: (id: string) => `api:contact:${id}`,
    search: (query: string) => `api:search:${query}`,
  },

  /**
   * Cache static data
   */
  static: {
    config: () => "static:config",
    metadata: (page: string) => `static:metadata:${page}`,
  },
};

/**
 * Start cache cleanup interval
 */
if (typeof window !== "undefined") {
  // Clean up expired cache entries every 5 minutes
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}
