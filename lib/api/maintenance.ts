import { apiRequest } from "@/lib/api/client"

// ── Types ──────────────────────────────────────────────────────────────────────

export type MaintenanceSeverity = "info" | "warning" | "critical"

export type MaintenanceStatus = "active" | "scheduled" | "completed" | "cancelled"

export interface MaintenanceWindow {
  id: string
  title: string
  description?: string
  severity: MaintenanceSeverity
  status: MaintenanceStatus
  scheduledStart: string
  scheduledEnd: string
  actualStart?: string
  actualEnd?: string
  affectedServices: string[]
  createdAt: string
  updatedAt?: string
}

export interface MaintenanceStatusResponse {
  isInMaintenance: boolean
  currentWindow: MaintenanceWindow | null
  upcomingWindows: MaintenanceWindow[]
  nextWindow: MaintenanceWindow | null
  allowAdminAccess: boolean
}

export interface MaintenanceHistoryResponse {
  windows: MaintenanceWindow[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

// ── API helpers ────────────────────────────────────────────────────────────────

export async function fetchMaintenanceStatus(authToken?: string): Promise<MaintenanceStatusResponse> {
  return apiRequest<MaintenanceStatusResponse>("/api/maintenance/status", {
    authToken,
  })
}

export async function fetchScheduledMaintenance(
  opts: { limit?: number; cursor?: string } = {},
  authToken?: string
): Promise<MaintenanceHistoryResponse> {
  return apiRequest<MaintenanceHistoryResponse>("/api/maintenance/schedule", {
    authToken,
    query: {
      status: "scheduled",
      limit: opts.limit ?? 10,
      cursor: opts.cursor,
    },
  })
}

export async function fetchMaintenanceHistory(
  opts: { limit?: number; cursor?: string } = {},
  authToken?: string
): Promise<MaintenanceHistoryResponse> {
  return apiRequest<MaintenanceHistoryResponse>("/api/maintenance/history", {
    authToken,
    query: {
      limit: opts.limit ?? 20,
      cursor: opts.cursor,
    },
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getTimeRemaining(targetDate: string): {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
} {
  const total = new Date(targetDate).getTime() - Date.now()
  const expired = total <= 0
  const absTotal = Math.abs(total)

  const seconds = Math.floor((absTotal / 1000) % 60)
  const minutes = Math.floor((absTotal / 1000 / 60) % 60)
  const hours = Math.floor((absTotal / (1000 * 60 * 60)) % 24)
  const days = Math.floor(absTotal / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds, expired }
}

export function formatDuration(days: number, hours: number, minutes: number, seconds: number): string {
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 || days > 0) parts.push(`${hours.toString().padStart(2, "0")}h`)
  parts.push(`${minutes.toString().padStart(2, "0")}m`)
  parts.push(`${seconds.toString().padStart(2, "0")}s`)
  return parts.join(":")
}
