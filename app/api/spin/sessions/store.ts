import type { SpinSession, SpinSessionStatus } from "@/lib/api/spin"

declare global {
  var __renaissanceSpinStore: Map<string, SpinSession> | undefined
}

const SPIN_SESSION_TTL_MS = 5 * 60 * 1000

const store = globalThis.__renaissanceSpinStore ?? new Map<string, SpinSession>()

if (!globalThis.__renaissanceSpinStore) {
  globalThis.__renaissanceSpinStore = store
}

function normalizeStatus(session: SpinSession): SpinSession {
  if (session.status === "active" && new Date(session.expiresAt).getTime() <= Date.now()) {
    const expired: SpinSession = {
      ...session,
      status: "expired",
      updatedAt: new Date().toISOString(),
    }
    store.set(expired.sessionId, expired)
    return expired
  }

  return session
}

export function getSession(sessionId: string) {
  const session = store.get(sessionId)
  return session ? normalizeStatus(session) : null
}

export function getCurrentSession() {
  const sessions = Array.from(store.values())
    .map(normalizeStatus)
    .sort((left, right) => {
      return new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()
    })

  return sessions[0] ?? null
}

export function createSession(stakeAmount: number, idempotencyKey: string) {
  const currentSession = getCurrentSession()

  if (currentSession?.status === "active") {
    return currentSession
  }

  const now = new Date().toISOString()
  const session: SpinSession = {
    sessionId: `spin_${crypto.randomUUID()}`,
    status: "active",
    stakeAmount,
    startedAt: now,
    expiresAt: new Date(Date.now() + SPIN_SESSION_TTL_MS).toISOString(),
    updatedAt: now,
    idempotencyKey,
  }

  store.set(session.sessionId, session)
  return session
}

export function updateSession(
  sessionId: string,
  updates: Partial<Pick<SpinSession, "status" | "prize">>
) {
  const session = getSession(sessionId)

  if (!session) {
    return null
  }

  const nextStatus = (updates.status ?? session.status) as SpinSessionStatus

  const updated: SpinSession = {
    ...session,
    ...updates,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  }

  store.set(sessionId, updated)
  return updated
}

export function deleteSession(sessionId: string) {
  store.delete(sessionId)
}