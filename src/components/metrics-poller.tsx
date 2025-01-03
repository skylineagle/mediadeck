"use client";

import { useSettings } from "@/hooks/use-settings";
import { fetchMetrics } from "@/lib/services/metrics";
import { useMetricsStore } from "@/lib/stores/metrics";
import { useEffect, useRef } from "react";

interface MetricsPollerProps {
  enabled?: boolean;
}

export function MetricsPoller({ enabled = true }: MetricsPollerProps) {
  const { setMetrics, setError, setLoading } = useMetricsStore();
  const { settings } = useSettings();
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
          timeoutRef.current = setTimeout(
            () => void pollMetrics(),
            settings.refreshInterval,
          );
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
  }, [enabled, setMetrics, setError, setLoading, settings.refreshInterval]);

  return null;
}
