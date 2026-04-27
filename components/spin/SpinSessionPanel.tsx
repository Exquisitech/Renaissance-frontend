"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Clock3, LoaderCircle, RefreshCcw, ShieldCheck, TimerReset, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showApiErrorToast } from "@/hooks/use-toast"
import {
  cleanupSpinSession,
  createSpinIdempotencyKey,
  fetchCurrentSpinSession,
  fetchSpinSession,
  getSpinCountdown,
  startSpinSession,
  updateSpinSession,
  type SpinSession,
} from "@/lib/api/spin"
import { cn } from "@/lib/utils"

interface SpinSessionPanelProps {
  session: SpinSession | null
  stakeAmount: number
  onSessionChange: (session: SpinSession | null) => void
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

export function SpinSessionPanel({
  session,
  stakeAmount,
  onSessionChange,
}: SpinSessionPanelProps) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(getSpinCountdown(session))
  const expiringSessionRef = useRef<string | null>(null)

  const refreshSession = useCallback(async () => {
    try {
      if (session?.sessionId) {
        const nextSession = await fetchSpinSession(session.sessionId)
        onSessionChange(nextSession)
        return
      }

      const currentSession = await fetchCurrentSpinSession()
      onSessionChange(currentSession)
    } catch (error) {
      showApiErrorToast(error, "Unable to refresh spin session")
    } finally {
      setLoading(false)
    }
  }, [onSessionChange, session?.sessionId])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  useEffect(() => {
    setCountdown(getSpinCountdown(session))
  }, [session])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdown(getSpinCountdown(session))
    }, 1_000)

    return () => window.clearInterval(timerId)
  }, [session])

  useEffect(() => {
    const pollId = window.setInterval(() => {
      void refreshSession()
    }, 30_000)

    return () => window.clearInterval(pollId)
  }, [refreshSession])

  useEffect(() => {
    if (!session?.sessionId || typeof window === "undefined") {
      return
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/spin-sessions`)

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { sessionId?: string; session?: SpinSession }
        if (payload.sessionId === session.sessionId && payload.session) {
          onSessionChange(payload.session)
        }
      } catch {
        // Ignore malformed messages and continue polling.
      }
    }

    socket.onerror = () => {
      socket.close()
    }

    return () => {
      socket.close()
    }
  }, [onSessionChange, session?.sessionId])

  useEffect(() => {
    if (!session || session.status !== "active" || countdown > 0) {
      expiringSessionRef.current = null
      return
    }

    if (expiringSessionRef.current === session.sessionId) {
      return
    }

    expiringSessionRef.current = session.sessionId
    void updateSpinSession(session.sessionId, { status: "expired" })
      .then((expiredSession) => onSessionChange(expiredSession))
      .catch((error) => showApiErrorToast(error, "Unable to expire spin session"))
  }, [countdown, onSessionChange, session])

  const sessionState = useMemo(() => {
    if (!session) {
      return {
        label: "No session",
        badgeClassName: "border-border/60 bg-muted/40 text-foreground",
      }
    }

    if (session.status === "active") {
      return {
        label: "Active",
        badgeClassName: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
      }
    }

    if (session.status === "completed") {
      return {
        label: "Completed",
        badgeClassName: "border-sky-500/40 bg-sky-500/10 text-sky-100",
      }
    }

    return {
      label: "Expired",
      badgeClassName: "border-amber-500/40 bg-amber-500/10 text-amber-100",
    }
  }, [session])

  const handleStartSession = async () => {
    setSubmitting(true)
    try {
      const nextSession = await startSpinSession(stakeAmount, createSpinIdempotencyKey())
      onSessionChange(nextSession)
    } catch (error) {
      showApiErrorToast(error, "Unable to start spin session")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCleanup = async () => {
    if (!session) {
      return
    }

    setSubmitting(true)
    try {
      await cleanupSpinSession(session.sessionId)
      onSessionChange(null)
    } catch (error) {
      showApiErrorToast(error, "Unable to clean up spin session")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-secondary/20 bg-card/70 shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Spin Session</CardTitle>
            <CardDescription>Start, monitor, and clean up your active spin session.</CardDescription>
          </div>
          <Badge variant="outline" className={sessionState.badgeClassName}>
            {sessionState.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex min-h-28 items-center justify-center">
            <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {!loading && !session ? (
          <Alert>
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertTitle>No active session</AlertTitle>
            <AlertDescription>
              Create a session before submitting a spin. Duplicate submissions are blocked until the current lifecycle finishes.
            </AlertDescription>
          </Alert>
        ) : null}

        {session ? (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Session ID</p>
                <p className="mt-2 font-mono text-sm">{session.sessionId}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stake</p>
                <p className="mt-2 text-xl font-semibold">{session.stakeAmount} XLM</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    Session timeout
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Auto-expiration keeps abandoned sessions from blocking new spins.</p>
                </div>
                <p className={cn("text-2xl font-semibold", countdown <= 30 && session.status === "active" && "text-amber-300")}>
                  {session.status === "active" ? formatCountdown(countdown) : "--:--"}
                </p>
              </div>
            </div>

            {session.status === "expired" ? (
              <Alert variant="destructive">
                <TimerReset className="h-4 w-4" />
                <AlertTitle>Session expired</AlertTitle>
                <AlertDescription>
                  Start a new session to spin again. The previous session can no longer submit a prize request.
                </AlertDescription>
              </Alert>
            ) : null}

            {session.status === "completed" ? (
              <Alert>
                <RefreshCcw className="h-4 w-4 text-primary" />
                <AlertTitle>Session completed</AlertTitle>
                <AlertDescription>
                  {session.prize ? `Last recorded prize: ${session.prize}.` : "This session has finished."} Start a new one whenever you are ready.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleStartSession}
            disabled={submitting || session?.status === "active"}
            className="bg-red-600 hover:bg-red-700"
          >
            {submitting ? "Working..." : session?.status === "active" ? "Session Active" : "Start New Session"}
          </Button>
          <Button variant="outline" onClick={() => void refreshSession()} disabled={submitting}>
            Refresh Status
          </Button>
          <Button variant="ghost" onClick={handleCleanup} disabled={submitting || !session}>
            <Trash2 className="h-4 w-4" />
            Cleanup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}