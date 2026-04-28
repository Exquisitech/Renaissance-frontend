import { NextResponse } from "next/server"

function buildSnapshot() {
  const cycle = Math.floor(Date.now() / 30_000)
  const maxConnections = 80
  const activeConnections = 42 + (cycle % 28)
  const waitQueueSize = cycle % 5 === 0 ? 7 : cycle % 3 === 0 ? 3 : 1
  const idleConnections = Math.max(0, maxConnections - activeConnections)
  const utilizationPct = Number(((activeConnections / maxConnections) * 100).toFixed(1))
  const slowQueryCount = cycle % 4
  const lastQueryTimeMs = 85 + (cycle % 9) * 17
  const lastQueryAt = new Date(Date.now() - (cycle % 8) * 12_000).toISOString()
  const status = utilizationPct > 90 ? "critical" : utilizationPct >= 80 ? "warning" : "healthy"

  return {
    activeConnections,
    idleConnections,
    waitQueueSize,
    slowQueryCount,
    lastQueryAt,
    lastQueryTimeMs,
    maxConnections,
    utilizationPct,
    status,
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: buildSnapshot(),
    },
    {
      headers: {
        "x-correlation-id": crypto.randomUUID(),
      },
    }
  )
}