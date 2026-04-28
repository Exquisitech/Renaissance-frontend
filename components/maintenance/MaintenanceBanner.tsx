"use client"

import React, { useEffect, useState } from "react"
import { AlertTriangle, Clock, Wrench, Wifi, WifiOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getTimeRemaining, formatDuration } from "@/lib/api/maintenance"
import type { MaintenanceStatusResponse } from "@/lib/api/maintenance"

// ── Types ──────────────────────────────────────────────────────────────────────

interface MaintenanceBannerProps {
  status: MaintenanceStatusResponse | null
  isConnected: boolean
  onDismiss?: () => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export function MaintenanceBanner({ status, isConnected, onDismiss }: MaintenanceBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  if (dismissed || !status) return null

  const { isInMaintenance, currentWindow, nextWindow } = status

  // Show active maintenance banner
  if (isInMaintenance && currentWindow) {
    const remaining = getTimeRemaining(currentWindow.scheduledEnd)
    const severity = currentWindow.severity

    return (
      <div
        className={cn(
          "relative flex items-center gap-3 border-b px-4 py-3 text-sm",
          severity === "critical"
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : severity === "warning"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            : "border-primary/30 bg-primary/5 text-primary"
        )}
        role="alert"
      >
        <Wrench className="size-4 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="font-semibold">Maintenance in progress</span>
          <span className="text-muted-foreground">
            {currentWindow.title}
            {currentWindow.affectedServices.length > 0 && (
              <span> — Affected: {currentWindow.affectedServices.join(", ")}</span>
            )}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "w-fit gap-1 text-xs",
              severity === "critical" && "border-destructive text-destructive",
              severity === "warning" && "border-amber-500 text-amber-600 dark:text-amber-400"
            )}
          >
            <Clock className="size-3" />
            {remaining.expired ? "Overdue" : `${formatDuration(remaining.days, remaining.hours, remaining.minutes, remaining.seconds)} remaining`}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="size-3 text-emerald-500" />
          ) : (
            <WifiOff className="size-3 text-muted-foreground" />
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDismissed(true)
                onDismiss()
              }}
              aria-label="Dismiss"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Show upcoming maintenance banner (within 24 hours)
  if (nextWindow) {
    const timeToStart = getTimeRemaining(nextWindow.scheduledStart)
    const within24h = timeToStart.total > 0 && timeToStart.total < 24 * 60 * 60 * 1000

    if (!within24h) return null

    return (
      <div
        className="relative flex items-center gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
        role="alert"
      >
        <AlertTriangle className="size-4 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="font-semibold">Scheduled maintenance</span>
          <span className="text-muted-foreground">{nextWindow.title}</span>
          <Badge variant="outline" className="w-fit gap-1 border-amber-500 text-xs text-amber-600 dark:text-amber-400">
            <Clock className="size-3" />
            Starts in {formatDuration(timeToStart.days, timeToStart.hours, timeToStart.minutes, timeToStart.seconds)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="size-3 text-emerald-500" />
          ) : (
            <WifiOff className="size-3 text-muted-foreground" />
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDismissed(true)
                onDismiss()
              }}
              aria-label="Dismiss"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
