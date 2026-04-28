import { apiRequest } from "@/lib/api/client"

// ── Types ──────────────────────────────────────────────────────────────────────

export type ReferralStatus = "pending" | "active" | "converted" | "expired"

export type ReferralBonusType = "signup" | "first_stake" | "milestone"

export interface ReferralCode {
  code: string
  userId: string
  createdAt: string
  expiresAt?: string
  isActive: boolean
  usageLimit?: number
  currentUsage: number
}

export interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  activeReferrals: number
  convertedReferrals: number
  totalBonusesEarned: number
  conversionRate: number
  funnel: {
    clicks: number
    signups: number
    activations: number
    conversions: number
  }
}

export interface ReferralActivity {
  id: string
  referrerId: string
  referredUserId: string
  referredUserName: string
  code: string
  status: ReferralStatus
  bonusEarned: number
  bonusType?: ReferralBonusType
  createdAt: string
  updatedAt?: string
}

export interface ReferralHistoryResponse {
  activities: ReferralActivity[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface GenerateCodeInput {
  userId: string
  customCode?: string
  usageLimit?: number
  expiresAt?: string
  authToken?: string
}

// ── API helpers ────────────────────────────────────────────────────────────────

export async function fetchReferralCode(
  userId: string,
  authToken?: string
): Promise<ReferralCode | null> {
  const data = await apiRequest<{ code: ReferralCode | null }>("/api/referral/code", {
    authToken,
    query: { userId },
  })
  return data.code
}

export async function generateReferralCode(input: GenerateCodeInput): Promise<ReferralCode> {
  const { userId, customCode, usageLimit, expiresAt, authToken } = input
  return apiRequest<ReferralCode>("/api/referral/code", {
    method: "POST",
    authToken,
    body: JSON.stringify({ userId, customCode, usageLimit, expiresAt }),
  })
}

export async function revokeReferralCode(
  userId: string,
  authToken?: string
): Promise<void> {
  await apiRequest("/api/referral/code", {
    method: "DELETE",
    authToken,
    query: { userId },
    parseAs: "response",
  })
}

export async function fetchReferralStats(
  userId: string,
  authToken?: string
): Promise<ReferralStats> {
  const data = await apiRequest<{ stats: ReferralStats }>("/api/referral/stats", {
    authToken,
    query: { userId },
  })
  return data.stats
}

export async function fetchReferralHistory(
  userId: string,
  opts: { limit?: number; cursor?: string } = {},
  authToken?: string
): Promise<ReferralHistoryResponse> {
  return apiRequest<ReferralHistoryResponse>("/api/referral/history", {
    authToken,
    query: {
      userId,
      limit: opts.limit ?? 20,
      cursor: opts.cursor,
    },
  })
}

// ── Share helpers ──────────────────────────────────────────────────────────────

export function getReferralShareUrl(code: string) {
  if (typeof window === "undefined") return `https://renaissance.app/?ref=${code}`
  return `${window.location.origin}/signup?ref=${encodeURIComponent(code)}`
}

export function buildTwitterShareUrl(code: string, message?: string) {
  const url = getReferralShareUrl(code)
  const text = message ?? `Join me on Renaissance! Use my referral code: ${code}`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

export function buildTelegramShareUrl(code: string, message?: string) {
  const url = getReferralShareUrl(code)
  const text = message ?? `Join me on Renaissance! Use my referral code: ${code}`
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}

export function buildEmailShareUrl(code: string, subject?: string, body?: string) {
  const url = getReferralShareUrl(code)
  const defaultSubject = "Join me on Renaissance"
  const defaultBody = `Hey!\n\nI thought you'd love Renaissance. Sign up using my referral code: ${code}\n\n${url}`
  return `mailto:?subject=${encodeURIComponent(subject ?? defaultSubject)}&body=${encodeURIComponent(body ?? defaultBody)}`
}
