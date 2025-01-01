import { create } from "zustand";
import type { MediaServerMetrics } from "../types/metrics";

interface MetricsState {
  metrics: MediaServerMetrics | null;
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  setMetrics: (metrics: MediaServerMetrics) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: null,
  lastUpdated: null,
  isLoading: false,
  error: null,
  setMetrics: (metrics) =>
    set({ metrics, lastUpdated: Date.now(), error: null }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
