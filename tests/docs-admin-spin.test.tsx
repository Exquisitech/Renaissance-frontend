import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DatabaseHealthCard } from "@/components/admin/DatabaseHealthCard"
import { EndpointCard } from "@/components/docs/EndpointCard"
import { SpinSessionPanel } from "@/components/spin/SpinSessionPanel"
import type { ApiEndpointDoc } from "@/lib/api/docs"
import type { SpinSession } from "@/lib/api/spin"

const {
  fetchDatabaseHealthMock,
  fetchCurrentSpinSessionMock,
  fetchSpinSessionMock,
  startSpinSessionMock,
  updateSpinSessionMock,
  cleanupSpinSessionMock,
  showApiErrorToastMock,
} = vi.hoisted(() => ({
  fetchDatabaseHealthMock: vi.fn(),
  fetchCurrentSpinSessionMock: vi.fn(),
  fetchSpinSessionMock: vi.fn(),
  startSpinSessionMock: vi.fn(),
  updateSpinSessionMock: vi.fn(),
  cleanupSpinSessionMock: vi.fn(),
  showApiErrorToastMock: vi.fn(),
}))

vi.mock("@/lib/api/health/database", () => ({
  fetchDatabaseHealth: fetchDatabaseHealthMock,
}))

vi.mock("@/lib/api/spin", () => ({
  createSpinIdempotencyKey: () => "spin-test-key",
  cleanupSpinSession: cleanupSpinSessionMock,
  fetchCurrentSpinSession: fetchCurrentSpinSessionMock,
  fetchSpinSession: fetchSpinSessionMock,
  getSpinCountdown: (session: SpinSession | null) => {
    if (!session || session.status !== "active") return 0
    return 90
  },
  startSpinSession: startSpinSessionMock,
  updateSpinSession: updateSpinSessionMock,
}))

vi.mock("@/hooks/use-toast", () => ({
  showApiErrorToast: showApiErrorToastMock,
  useToast: () => ({ toast: vi.fn() }),
}))

class WebSocketMock {
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  close = vi.fn()
}

vi.stubGlobal("WebSocket", WebSocketMock)

describe("API docs, admin, and spin surfaces", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, data: { ok: true } }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "x-correlation-id": "abc-123",
          },
        })
      )
    )
  })

  it("renders database pool warning state", async () => {
    fetchDatabaseHealthMock.mockResolvedValue({
      activeConnections: 68,
      idleConnections: 12,
      waitQueueSize: 5,
      slowQueryCount: 3,
      lastQueryAt: new Date().toISOString(),
      lastQueryTimeMs: 144,
      maxConnections: 80,
      utilizationPct: 85,
      status: "warning",
    })

    render(<DatabaseHealthCard />)

    await waitFor(() => {
      expect(screen.getByText("Pool utilization is elevated")).toBeInTheDocument()
    })

    expect(screen.getByText("85.0%")).toBeInTheDocument()
    expect(screen.getByText("68")).toBeInTheDocument()
  })

  it("starts a new spin session from the panel", async () => {
    fetchCurrentSpinSessionMock.mockResolvedValue(null)
    startSpinSessionMock.mockResolvedValue({
      sessionId: "spin_1",
      status: "active",
      stakeAmount: 25,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      updatedAt: new Date().toISOString(),
      idempotencyKey: "spin-test-key",
    })

    const onSessionChange = vi.fn()
    render(
      <SpinSessionPanel stakeAmount={25} session={null} onSessionChange={onSessionChange} />
    )

    await waitFor(() => {
      expect(screen.getByText("No active session")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: /start new session/i }))

    await waitFor(() => {
      expect(startSpinSessionMock).toHaveBeenCalledWith(25, "spin-test-key")
      expect(onSessionChange).toHaveBeenCalled()
    })
  })

  it("runs try-it-out and shows correlation id", async () => {
    const endpoint: ApiEndpointDoc = {
      id: "health",
      method: "GET",
      path: "/health/database",
      summary: "Read database health",
      description: "Returns the active pool snapshot.",
      tags: ["Health"],
      responses: [
        {
          status: 200,
          description: "Success",
          example: { success: true },
        },
      ],
    }

    render(<EndpointCard endpoint={endpoint} authToken="token-123" />)

    fireEvent.click(screen.getByRole("button", { name: /send request/i }))

    await waitFor(() => {
      expect(screen.getByText(/Correlation ID: abc-123/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Status: 200/i)).toBeInTheDocument()
    expect(screen.getByText(/"ok": true/i)).toBeInTheDocument()
  })
})