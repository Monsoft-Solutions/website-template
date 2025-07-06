import { useState, useEffect } from "react";

// Client-side site configuration type (subset of full configuration)
export type ClientSiteConfig = {
  name: string;
  description: string;
  ogImage: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  creator: {
    name: string;
    email: string;
    twitter?: string;
    url?: string;
  };
  keywords: string[];
  language: string;
  locale: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  socialMedia: {
    twitter: {
      card: string;
      site?: string;
      creator?: string;
    };
  };
};

// Default fallback configuration for immediate use
const defaultConfig: ClientSiteConfig = {
  name: "Monsoft Solutions",
  description:
    "Monsoft Solutions is a software development company that provides software development services to businesses.",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourhandle",
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourhandle",
  },
  creator: {
    name: "Your Name",
    email: "contact@yoursite.com",
    twitter: "@yourhandle",
    url: "https://yoursite.com",
  },
  keywords: ["nextjs", "react", "template", "website", "seo", "blog"],
  language: "en",
  locale: "en_US",
  theme: {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  },
  socialMedia: {
    twitter: {
      card: "summary_large_image",
      site: "@yourhandle",
      creator: "@yourhandle",
    },
  },
};

/**
 * Hook to fetch and manage site configuration on the client side
 * Returns default configuration immediately and updates with API data when available
 */
export function useSiteConfig() {
  const [config, setConfig] = useState<ClientSiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/site-config");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch site configuration: ${response.status}`
          );
        }

        const { data } = await response.json();
        setConfig(data);
      } catch (err) {
        console.warn(
          "Failed to fetch site configuration, using defaults:",
          err
        );
        setError(err instanceof Error ? err.message : "Unknown error");
        // Keep using default config on error
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the fetch by changing a dependency
      window.location.reload();
    },
  };
}
