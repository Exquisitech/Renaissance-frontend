import { apiRequest } from "@/lib/api/client"

export type SpinSessionStatus = "active" | "completed" | "expired"

export interface SpinSession {
  sessionId: string
  status: SpinSessionStatus
  stakeAmount: number
  startedAt: string
  expiresAt: string
  updatedAt: string
  idempotencyKey: string
  prize?: string
}

interface SpinSessionEnvelope {
  success: boolean
  data: SpinSession | null
}

export interface SpinResult {
  prize: string
  newBalance: number
  session: SpinSession
}

export function createSpinIdempotencyKey() {
  return `spin-${Date.now()}`
}

export function getSpinCountdown(session: SpinSession | null) {
  if (!session || session.status !== "active") {
    return 0
  }

  return Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000))
}

export async function fetchCurrentSpinSession(authToken?: string) {
  const response = await apiRequest<SpinSessionEnvelope>("/api/spin/sessions", {
    authToken,
    query: { current: true },
  })

  return response.data
}

export async function fetchSpinSession(sessionId: string, authToken?: string) {
  const response = await apiRequest<SpinSessionEnvelope>(`/api/spin/sessions/${sessionId}`, {
    authToken,
  })

  return response.data
}

export async function startSpinSession(
  stakeAmount: number,
  idempotencyKey: string,
  authToken?: string
) {
  const response = await apiRequest<SpinSessionEnvelope>("/api/spin/sessions", {
    method: "POST",
    authToken,
    body: JSON.stringify({ stakeAmount, idempotencyKey }),
  })

  if (!response.data) {
    throw new Error("Spin session was not created")
  }

  return response.data
}

export async function updateSpinSession(
  sessionId: string,
  updates: Partial<Pick<SpinSession, "status" | "prize">>,
  authToken?: string
) {
  const response = await apiRequest<SpinSessionEnvelope>(`/api/spin/sessions/${sessionId}`, {
    method: "PATCH",
    authToken,
    body: JSON.stringify(updates),
  })

  return response.data
}

export async function cleanupSpinSession(sessionId: string, authToken?: string) {
  await apiRequest(`/api/spin/sessions/${sessionId}`, {
    method: "DELETE",
    authToken,
    parseAs: "response",
  })
}

export async function executeSpin(
  sessionId: string,
  stakeAmount: number,
  authToken?: string
) {
  const response = await apiRequest<{
    success: boolean
    data: SpinResult
  }>("/api/spin-to-win", {
    method: "POST",
    authToken,
    body: JSON.stringify({ sessionId, stakeAmount }),
  })

  return response.data
}