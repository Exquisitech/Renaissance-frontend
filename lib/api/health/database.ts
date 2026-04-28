import { apiRequest } from "@/lib/api/client"

export type DatabaseHealthStatus = "healthy" | "warning" | "critical"

export interface DatabaseHealthSnapshot {
  activeConnections: number
  idleConnections: number
  waitQueueSize: number
  slowQueryCount: number
  lastQueryAt: string
  lastQueryTimeMs: number
  maxConnections: number
  utilizationPct: number
  status: DatabaseHealthStatus
}

export async function fetchDatabaseHealth(authToken?: string) {
  const response = await apiRequest<{
    success: boolean
    data: DatabaseHealthSnapshot
  }>("/health/database", {
    authToken,
  })

  return response.data
}