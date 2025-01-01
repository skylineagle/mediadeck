"use client";

import { useEffect, useRef } from "react";
import { fetchMetrics } from "@/lib/services/metrics";
import { useMetricsStore } from "@/lib/stores/metrics";

interface MetricsPollerProps {
  interval?: number; // in milliseconds
  enabled?: boolean;
}

export function MetricsPoller({
  interval = 5000,
  enabled = true,
}: MetricsPollerProps) {
  const { setMetrics, setError, setLoading } = useMetricsStore();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    async function pollMetrics() {
      try {
        setLoading(true);
        const metrics = await fetchMetrics();
        setMetrics(metrics);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch metrics",
        );
      } finally {
        setLoading(false);
        if (enabled) {
          timeoutRef.current = setTimeout(() => void pollMetrics(), interval);
        }
      }
    }

    if (enabled) {
      void pollMetrics();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [interval, enabled, setMetrics, setError, setLoading]);

  return null;
}
