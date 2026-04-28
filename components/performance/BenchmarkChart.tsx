"use client";

import type { BenchmarkMetric } from "@/lib/api/performance";
import { SCENARIO_LABELS } from "@/lib/api/performance";

interface BenchmarkChartProps {
  current: BenchmarkMetric[];
  previous?: BenchmarkMetric[];
}

interface MetricBarProps {
  label: string;
  value: number;
  max: number;
  prev?: number;
  unit: string;
  higherIsBetter?: boolean;
}

function MetricBar({ label, value, max, prev, unit, higherIsBetter = false }: MetricBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const regression = prev !== undefined
    ? higherIsBetter ? value < prev * 0.95 : value > prev * 1.1
    : false;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span className={`font-semibold ${regression ? "text-red-400" : "text-white"}`}>
          {value.toLocaleString()} {unit}
          {prev !== undefined && (
            <span className="ml-1 text-gray-500">
              (prev: {prev.toLocaleString()})
            </span>
          )}
          {regression && <span className="ml-1 text-red-400">⚠ regression</span>}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${regression ? "bg-red-500" : higherIsBetter ? "bg-emerald-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function BenchmarkChart({ current, previous }: BenchmarkChartProps) {
  const maxResponseTime = Math.max(...current.map((m) => m.responseTimeMs), 1000);
  const maxThroughput = Math.max(...current.map((m) => m.throughputRps), 100);

  return (
    <div className="space-y-6">
      {current.map((metric) => {
        const prev = previous?.find((p) => p.scenario === metric.scenario);
        const label = SCENARIO_LABELS[metric.scenario] ?? metric.scenario;

        return (
          <div key={metric.scenario} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">{label}</h3>

            <MetricBar label="Response Time (avg)" value={metric.responseTimeMs} max={maxResponseTime} prev={prev?.responseTimeMs} unit="ms" />
            <MetricBar label="Throughput" value={metric.throughputRps} max={maxThroughput} prev={prev?.throughputRps} unit="req/s" higherIsBetter />
            <MetricBar label="Error Rate" value={metric.errorRatePct} max={10} prev={prev?.errorRatePct} unit="%" />

            <div className="flex gap-4 pt-1 text-xs text-gray-500">
              <span>p95: <span className="text-white">{metric.p95Ms}ms</span></span>
              <span>p99: <span className="text-white">{metric.p99Ms}ms</span></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
