import { useState, useEffect } from "react";
import { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import { ApiResponse } from "@/lib/types/api-response.type";

/**
 * Custom hook for fetching all services
 */
export function useServices() {
  const [data, setData] = useState<ServiceWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/services");
        const result: ApiResponse<ServiceWithRelations[]> =
          await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch services");
          setData([]);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { data, isLoading, error };
}

/**
 * Custom hook for fetching a single service by slug
 */
export function useService(slug: string) {
  const [data, setData] = useState<ServiceWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if slug is empty, undefined, or invalid
    if (!slug || slug.trim() === "" || slug === "undefined" || slug === "null") {
      if (process.env.NODE_ENV === "development") {
        console.log("useService: Skipping fetch - invalid slug:", slug);
      }
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    async function fetchService() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Ensure we're always hitting the specific service endpoint
        const url = `/api/services/${encodeURIComponent(slug.trim())}`;
        if (process.env.NODE_ENV === "development") {
          console.log("useService: Fetching from URL:", url);
        }
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<ServiceWithRelations | null> =
          await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch service");
          setData(null);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  return { data, isLoading, error };
}
