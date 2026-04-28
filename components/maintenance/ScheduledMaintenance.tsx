"use client"

import React, { useEffect, useState } from "react"
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Loader2, ChevronDown, Wrench } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { getTimeRemaining, formatDuration } from "@/lib/api/maintenance"
import type { MaintenanceWindow, MaintenanceSeverity, MaintenanceStatus } from "@/lib/api/maintenance"
import { fetchScheduledMaintenance, fetchMaintenanceHistory } from "@/lib/api/maintenance"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

interface ScheduledMaintenanceProps {
  authToken?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function severityBadge(severity: MaintenanceSeverity) {
  switch (severity) {
    case "critical":
      return <Badge variant="destructive">Critical</Badge>
    case "warning":
      return <Badge variant="secondary">Warning</Badge>
    case "info":
      return <Badge variant="outline">Info</Badge>
  }
}

function statusIcon(status: MaintenanceStatus) {
  switch (status) {
    case "active":
      return <Wrench className="size-4 text-primary" />
    case "scheduled":
      return <Clock className="size-4 text-amber-500" />
    case "completed":
      return <CheckCircle className="size-4 text-emerald-500" />
    case "cancelled":
      return <XCircle className="size-4 text-muted-foreground" />
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ScheduledMaintenance({ authToken }: ScheduledMaintenanceProps) {
  const [scheduled, setScheduled] = useState<MaintenanceWindow[]>([])
  const [history, setHistory] = useState<MaintenanceWindow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [historyHasMore, setHistoryHasMore] = useState(false)
  const [historyCursor, setHistoryCursor] = useState<string | undefined>()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchScheduledMaintenance({ limit: 10 }, authToken),
      fetchMaintenanceHistory({ limit: 5 }, authToken),
    ])
      .then(([scheduledRes, historyRes]) => {
        if (cancelled) return
        setScheduled(scheduledRes.windows)
        setHistory(historyRes.windows)
        setHistoryHasMore(historyRes.hasMore)
        setHistoryCursor(historyRes.nextCursor)
      })
      .catch((err) => {
        if (!cancelled) showApiErrorToast(err, "Failed to load maintenance schedule")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [authToken])

  const loadMoreHistory = async () => {
    if (!historyCursor || isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const res = await fetchMaintenanceHistory({ limit: 5, cursor: historyCursor }, authToken)
      setHistory((prev) => [...prev, ...res.windows])
      setHistoryHasMore(res.hasMore)
      setHistoryCursor(res.nextCursor)
    } catch (error) {
      showApiErrorToast(error, "Failed to load more history")
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="size-4 text-primary" />
          Maintenance Schedule
          <Badge variant="outline" className="text-xs">
            {scheduled.length} upcoming
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3 pr-2">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading schedule...
              </div>
            )}

            {/* Upcoming */}
            {!isLoading && scheduled.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
                <CheckCircle className="size-8 text-emerald-500" />
                <p className="text-sm">No upcoming maintenance scheduled.</p>
              </div>
            )}

            {scheduled.map((window) => (
              <MaintenanceWindowCard key={window.id} window={window} isUpcoming />
            ))}

            {/* History toggle */}
            {history.length > 0 && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowHistory((v) => !v)}
                >
                  {showHistory ? "Hide" : "Show"} Past Maintenance
                </Button>
              </div>
            )}

            {showHistory && (
              <>
                <div className="border-t pt-3">
                  <span className="text-xs font-medium text-muted-foreground">Past Maintenance</span>
                </div>
                {history.map((window) => (
                  <MaintenanceWindowCard key={window.id} window={window} />
                ))}
                {historyHasMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadMoreHistory}
                      disabled={isLoadingMore}
                      className="text-xs"
                    >
                      {isLoadingMore ? (
                        <Loader2 className="mr-1 size-3 animate-spin" />
                      ) : (
                        <ChevronDown className="mr-1 size-3" />
                      )}
                      Load more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ── Window Card ────────────────────────────────────────────────────────────────

function MaintenanceWindowCard({
  window: maintWindow,
  isUpcoming = false,
}: {
  window: MaintenanceWindow
  isUpcoming?: boolean
}) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!isUpcoming) return
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isUpcoming])

  const start = new Date(maintWindow.scheduledStart)
  const end = new Date(maintWindow.scheduledEnd)
  const timeToStart = getTimeRemaining(maintWindow.scheduledStart)
  const isActive = maintWindow.status === "active"

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3",
        isActive && "border-primary/30 bg-primary/5",
        maintWindow.severity === "critical" && !isActive && "border-destructive/20"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {statusIcon(maintWindow.status)}
          <span className="text-sm font-semibold">{maintWindow.title}</span>
        </div>
        {severityBadge(maintWindow.severity)}
      </div>

      {maintWindow.description && (
        <p className="text-xs text-muted-foreground">{maintWindow.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{start.toLocaleDateString()}</span>
        <span>
          {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} —{" "}
          {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span className="tabular-nums">
          ({Math.round((end.getTime() - start.getTime()) / 60000)} min)
        </span>
      </div>

      {maintWindow.affectedServices.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {maintWindow.affectedServices.map((svc) => (
            <Badge key={svc} variant="outline" className="text-[10px]">
              {svc}
            </Badge>
          ))}
        </div>
      )}

      {isUpcoming && !timeToStart.expired && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-3" />
          Starts in {formatDuration(timeToStart.days, timeToStart.hours, timeToStart.minutes, timeToStart.seconds)}
        </div>
      )}
    </div>
  )
}
