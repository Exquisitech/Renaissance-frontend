"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { BenchmarkChart } from "@/components/performance/BenchmarkChart";
import { fetchBenchmarkSummary, type BenchmarkSummary, SCENARIO_LABELS } from "@/lib/api/performance";

const MOCK_SUMMARY: BenchmarkSummary = {
  current: {
    id: "run-002",
    runAt: new Date().toISOString(),
    label: "Latest",
    regression: true,
    metrics: [
      { timestamp: "", scenario: "1000_concurrent", responseTimeMs: 142, throughputRps: 890, errorRatePct: 0.2, p95Ms: 310, p99Ms: 540 },
      { timestamp: "", scenario: "500_websocket", responseTimeMs: 88, throughputRps: 480, errorRatePct: 0.0, p95Ms: 200, p99Ms: 310 },
      { timestamp: "", scenario: "api_burst", responseTimeMs: 210, throughputRps: 195, errorRatePct: 1.5, p95Ms: 420, p99Ms: 660 },
    ],
  },
  previous: {
    id: "run-001",
    runAt: new Date(Date.now() - 86_400_000).toISOString(),
    label: "Yesterday",
    regression: false,
    metrics: [
      { timestamp: "", scenario: "1000_concurrent", responseTimeMs: 118, throughputRps: 940, errorRatePct: 0.1, p95Ms: 250, p99Ms: 390 },
      { timestamp: "", scenario: "500_websocket", responseTimeMs: 74, throughputRps: 495, errorRatePct: 0.0, p95Ms: 170, p99Ms: 280 },
      { timestamp: "", scenario: "api_burst", responseTimeMs: 185, throughputRps: 198, errorRatePct: 0.8, p95Ms: 380, p99Ms: 590 },
    ],
  },
  regressions: ["1000_concurrent — response time increased by 20%", "api_burst — error rate exceeded threshold"],
};

export default function PerformancePage() {
  const [summary, setSummary] = useState<BenchmarkSummary>(MOCK_SUMMARY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBenchmarkSummary()
      .then(setSummary)
      .catch(() => setSummary(MOCK_SUMMARY))
      .finally(() => setLoading(false));
  }, []);

  const hasRegressions = summary.regressions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Benchmarks</h1>
          <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Last run: {new Date(summary.current.runAt).toLocaleString()}
          </p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${hasRegressions ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
          {hasRegressions ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          {hasRegressions ? `${summary.regressions.length} regression${summary.regressions.length > 1 ? "s" : ""}` : "All metrics healthy"}
        </div>
      </div>

      {hasRegressions && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-1.5">
          <p className="text-sm font-semibold text-red-400">Regression Alerts</p>
          {summary.regressions.map((r, i) => (
            <p key={i} className="text-xs text-red-300">• {r}</p>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">Loading benchmarks...</div>
      ) : (
        <BenchmarkChart
          current={summary.current.metrics}
          previous={summary.previous?.metrics}
        />
      )}
    </div>
  );
}
