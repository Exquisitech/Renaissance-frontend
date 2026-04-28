import { apiRequest } from "./client";

export interface BenchmarkMetric {
  timestamp: string;
  scenario: string;
  responseTimeMs: number;
  throughputRps: number;
  errorRatePct: number;
  p95Ms: number;
  p99Ms: number;
}

export interface BenchmarkRun {
  id: string;
  runAt: string;
  label: string;
  metrics: BenchmarkMetric[];
  regression: boolean;
}

export interface BenchmarkSummary {
  current: BenchmarkRun;
  previous?: BenchmarkRun;
  regressions: string[];
}

export async function fetchBenchmarkSummary(): Promise<BenchmarkSummary> {
  return apiRequest<BenchmarkSummary>("/api/performance/benchmarks/summary");
}

export async function fetchBenchmarkHistory(limit = 20): Promise<BenchmarkRun[]> {
  return apiRequest<BenchmarkRun[]>("/api/performance/benchmarks", {
    query: { limit },
  });
}

export const SCENARIO_LABELS: Record<string, string> = {
  "1000_concurrent": "1,000 Concurrent Users",
  "500_websocket": "500 WebSocket Connections",
  "bulk_write": "Bulk DB Write (10k rows)",
  "api_burst": "API Burst (200 req/s)",
  "cold_start": "Cold Start",
};
