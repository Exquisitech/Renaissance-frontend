"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { MaintenanceStatusResponse, MaintenanceWindow } from "@/lib/api/maintenance"
import { fetchMaintenanceStatus } from "@/lib/api/maintenance"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

export interface UseMaintenanceOptions {
  authToken?: string
  wsUrl?: string
  pollInterval?: number
  enablePollingFallback?: boolean
}

export interface UseMaintenanceReturn {
  status: MaintenanceStatusResponse | null
  isLoading: boolean
  isConnected: boolean
  connectionMode: "websocket" | "polling" | "none"
  refresh: () => Promise<void>
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useMaintenance(options: UseMaintenanceOptions): UseMaintenanceReturn {
  const { authToken, wsUrl, pollInterval = 30000, enablePollingFallback = true } = options

  const [status, setStatus] = useState<MaintenanceStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionMode, setConnectionMode] = useState<"websocket" | "polling" | "none">("none")

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const isMountedRef = useRef(true)

  // ── Polling ──────────────────────────────────────────────────────────────────

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchMaintenanceStatus(authToken)
      if (!isMountedRef.current) return
      setStatus(data)
    } catch (error) {
      if (isMountedRef.current) {
        showApiErrorToast(error, "Failed to check maintenance status")
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false)
    }
  }, [authToken])

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    pollIntervalRef.current = setInterval(() => {
      loadStatus()
    }, pollInterval)
    setConnectionMode("polling")
    setIsConnected(true)
  }, [loadStatus, pollInterval])

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  // ── WebSocket ────────────────────────────────────────────────────────────────

  const connectWebSocket = useCallback(() => {
    if (!wsUrl || typeof window === "undefined") return

    try {
      const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(authToken ?? "")}`)
      wsRef.current = ws

      ws.onopen = () => {
        if (!isMountedRef.current) return
        setIsConnected(true)
        setConnectionMode("websocket")
        reconnectAttemptRef.current = 0
        stopPolling()
      }

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === "maintenance_update" && msg.data) {
            setStatus(msg.data as MaintenanceStatusResponse)
          }
          if (msg.type === "maintenance_start" && msg.data) {
            setStatus((prev) =>
              prev
                ? {
                    ...prev,
                    isInMaintenance: true,
                    currentWindow: msg.data as MaintenanceWindow,
                  }
                : null
            )
          }
          if (msg.type === "maintenance_end") {
            setStatus((prev) =>
              prev
                ? {
                    ...prev,
                    isInMaintenance: false,
                    currentWindow: null,
                  }
                : null
            )
          }
        } catch {
          // Ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (!isMountedRef.current) return
        setIsConnected(false)
        wsRef.current = null
        if (enablePollingFallback) {
          setConnectionMode("polling")
          startPolling()
        } else {
          setConnectionMode("none")
        }

        const delay = Math.min(1000 * 2 ** reconnectAttemptRef.current, 30000)
        reconnectAttemptRef.current += 1
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) connectWebSocket()
        }, delay)
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch {
      if (enablePollingFallback) startPolling()
    }
  }, [wsUrl, authToken, enablePollingFallback, startPolling, stopPolling])

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  // ── Init & Cleanup ───────────────────────────────────────────────────────────

  useEffect(() => {
    isMountedRef.current = true
    setIsLoading(true)
    loadStatus()

    if (wsUrl) {
      connectWebSocket()
    } else if (enablePollingFallback) {
      startPolling()
    }

    return () => {
      isMountedRef.current = false
      disconnectWebSocket()
      stopPolling()
    }
  }, [wsUrl, authToken, loadStatus, connectWebSocket, disconnectWebSocket, startPolling, stopPolling, enablePollingFallback])

  return {
    status,
    isLoading,
    isConnected,
    connectionMode,
    refresh: loadStatus,
  }
}
