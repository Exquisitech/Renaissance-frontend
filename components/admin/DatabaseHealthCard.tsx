"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Activity, AlertTriangle, CheckCircle2, Clock3, DatabaseZap, LoaderCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDatabaseHealth, type DatabaseHealthSnapshot } from "@/lib/api/health/database"
import { normalizeApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"

function getStatusTone(utilizationPct: number) {
  if (utilizationPct > 90) {
    return {
      label: "Critical",
      badgeClassName: "border-red-500/40 bg-red-500/10 text-red-200",
      barClassName: "bg-red-500",
    }
  }

  if (utilizationPct >= 80) {
    return {
      label: "Warning",
      badgeClassName: "border-amber-500/40 bg-amber-500/10 text-amber-100",
      barClassName: "bg-amber-400",
    }
  }

  return {
    label: "Healthy",
    badgeClassName: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
    barClassName: "bg-emerald-400",
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

export function DatabaseHealthCard() {
  const [snapshot, setSnapshot] = useState<DatabaseHealthSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)

  const loadHealth = useCallback(async () => {
    try {
      const nextSnapshot = await fetchDatabaseHealth()
      setSnapshot(nextSnapshot)
      setErrorMessage(null)
    } catch (error) {
      const normalized = normalizeApiError(error, "Failed to load database health")
      setErrorMessage(
        normalized.correlationId
          ? `[ID: ${normalized.correlationId}] ${normalized.message}`
          : normalized.message
      )
    } finally {
      setLoading(false)
      hasLoadedRef.current = true
    }
  }, [])

  useEffect(() => {
    void loadHealth()
    const intervalId = window.setInterval(() => {
      void loadHealth()
    }, 30_000)

    return () => window.clearInterval(intervalId)
  }, [loadHealth])

  if (loading && !hasLoadedRef.current) {
    return (
      <Card className="border-secondary/20 bg-card/60">
        <CardContent className="flex min-h-[260px] items-center justify-center">
          <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!snapshot) {
    return (
      <Card className="border-secondary/20 bg-card/60">
        <CardHeader>
          <CardTitle>Database Health</CardTitle>
          <CardDescription>Connection pool health is currently unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to read database health</AlertTitle>
            <AlertDescription>{errorMessage ?? "No response from /health/database."}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const tone = getStatusTone(snapshot.utilizationPct)

  return (
    <Card className="border-secondary/20 bg-card/70 shadow-sm">
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DatabaseZap className="h-5 w-5 text-primary" />
            Database Health
          </CardTitle>
          <CardDescription>
            Auto-refreshes every 30 seconds to keep pool telemetry current.
          </CardDescription>
        </div>
        <Badge variant="outline" className={tone.badgeClassName}>
          {tone.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {snapshot.utilizationPct >= 80 ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Pool utilization is elevated</AlertTitle>
            <AlertDescription>
              Current utilization is {snapshot.utilizationPct.toFixed(1)}%. Review slow queries and waiting clients before saturation worsens.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <AlertTitle>Pool capacity is within target</AlertTitle>
            <AlertDescription>
              Active usage remains below the 80% alert threshold.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Connection utilization</span>
            <span className="font-semibold">{snapshot.utilizationPct.toFixed(1)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", tone.barClassName)}
              style={{ width: `${Math.min(100, snapshot.utilizationPct)}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active connections" value={String(snapshot.activeConnections)} />
          <Metric label="Idle connections" value={String(snapshot.idleConnections)} />
          <Metric label="Wait queue" value={String(snapshot.waitQueueSize)} />
          <Metric label="Slow queries" value={String(snapshot.slowQueryCount)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              Last query time
            </p>
            <p className="mt-2 text-2xl font-semibold">{snapshot.lastQueryTimeMs} ms</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Last query observed
            </p>
            <p className="mt-2 text-lg font-semibold">
              {new Date(snapshot.lastQueryAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {errorMessage ? (
          <p className="text-xs text-muted-foreground">Last refresh issue: {errorMessage}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}