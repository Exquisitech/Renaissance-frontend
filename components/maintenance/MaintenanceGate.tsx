"use client"

import React from "react"
import { Wrench, Clock, Shield } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTimeRemaining, formatDuration } from "@/lib/api/maintenance"
import type { MaintenanceStatusResponse } from "@/lib/api/maintenance"

// ── Types ──────────────────────────────────────────────────────────────────────

interface MaintenanceGateProps {
  status: MaintenanceStatusResponse | null
  isAdmin: boolean
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────────────

export function MaintenanceGate({ status, isAdmin, children }: MaintenanceGateProps) {
  if (!status || !status.isInMaintenance) {
    return <>{children}</>
  }

  // Admins can bypass maintenance mode
  if (isAdmin && status.allowAdminAccess) {
    return (
      <>
        <AdminBypassNotice window={status.currentWindow} />
        {children}
      </>
    )
  }

  // Regular users see maintenance page
  return <MaintenancePage window={status.currentWindow} />
}

// ── Admin Bypass Notice ────────────────────────────────────────────────────────

function AdminBypassNotice({ window }: { window: MaintenanceStatusResponse["currentWindow"] }) {
  if (!window) return null

  return (
    <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-700 dark:text-amber-400">
      <Shield className="size-3.5" />
      <span className="font-semibold">Admin Bypass:</span>
      <span>Platform is in maintenance mode. Regular users are blocked.</span>
      <Badge variant="outline" className="border-amber-500 text-[10px] text-amber-600 dark:text-amber-400">
        {window.title}
      </Badge>
    </div>
  )
}

// ── Maintenance Page ───────────────────────────────────────────────────────────

function MaintenancePage({ window: maintWindow }: { window: MaintenanceStatusResponse["currentWindow"] }) {
  const [, setTick] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const remaining = maintWindow ? getTimeRemaining(maintWindow.scheduledEnd) : null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Wrench className="size-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Under Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            We&apos;re currently performing scheduled maintenance to improve your experience.
            {maintWindow?.description && <span className="block mt-1">{maintWindow.description}</span>}
          </p>

          {maintWindow && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{maintWindow.title}</div>
              {maintWindow.affectedServices.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1">
                  {maintWindow.affectedServices.map((svc) => (
                    <Badge key={svc} variant="outline" className="text-[10px]">
                      {svc}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {remaining && (
            <div className="flex flex-col items-center gap-1 rounded-lg bg-muted p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                Estimated time remaining
              </div>
              <div className="text-2xl font-bold tabular-nums tracking-tight">
                {remaining.expired
                  ? "Finishing up..."
                  : formatDuration(remaining.days, remaining.hours, remaining.minutes, remaining.seconds)}
              </div>
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={() => typeof window !== "undefined" && window.location.reload()}>
            Check Again
          </Button>

          <p className="text-xs text-muted-foreground">
            We apologize for any inconvenience. Thank you for your patience.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
