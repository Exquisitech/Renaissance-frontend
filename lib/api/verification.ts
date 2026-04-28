import { apiRequest } from "@/lib/api/client"

// ── Types ──────────────────────────────────────────────────────────────────────

export type KycLevel = 0 | 1 | 2 | 3

export type VerificationStatus = "unverified" | "pending" | "approved" | "rejected" | "expired"

export type DocumentType = "id_front" | "id_back" | "passport" | "proof_of_address" | "selfie"

export type ReviewAction = "approve" | "reject" | "request_info"

export interface KycStatus {
  userId: string
  currentLevel: KycLevel
  targetLevel: KycLevel
  overallStatus: VerificationStatus
  levels: {
    level: KycLevel
    status: VerificationStatus
    completedAt?: string
    expiresAt?: string
  }[]
  withdrawalLimit: number
  dailyWithdrawalLimit: number
  monthlyWithdrawalLimit: number
}

export interface KycDocument {
  id: string
  userId: string
  type: DocumentType
  filename: string
  encrypted: boolean
  status: VerificationStatus
  uploadedAt: string
  reviewedAt?: string
  reviewNotes?: string
  rejectionReason?: string
}

export interface KycSubmission {
  id: string
  userId: string
  userName: string
  submittedAt: string
  targetLevel: KycLevel
  documents: KycDocument[]
  status: VerificationStatus
  reviewNotes?: string
}

export interface ReviewQueueResponse {
  submissions: KycSubmission[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface UploadDocumentInput {
  userId: string
  type: DocumentType
  file: File
  encrypt?: boolean
  authToken?: string
}

export interface ReviewSubmissionInput {
  submissionId: string
  action: ReviewAction
  notes?: string
  authToken?: string
}

// ── Encryption helpers ─────────────────────────────────────────────────────────

export async function generateEncryptionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key)
  const bytes = new Uint8Array(raw)
  return btoa(String.fromCharCode(...bytes))
}

export async function encryptFile(file: File, key: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = await file.arrayBuffer()
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  )
  return { encrypted, iv }
}

// ── API helpers ────────────────────────────────────────────────────────────────

export async function fetchKycStatus(
  userId: string,
  authToken?: string
): Promise<KycStatus> {
  return apiRequest<KycStatus>("/api/verification/status", {
    authToken,
    query: { userId },
  })
}

export async function fetchUserDocuments(
  userId: string,
  authToken?: string
): Promise<KycDocument[]> {
  const data = await apiRequest<{ documents: KycDocument[] }>("/api/verification/documents", {
    authToken,
    query: { userId },
  })
  return data.documents
}

export async function uploadDocument(input: UploadDocumentInput): Promise<KycDocument> {
  const { userId, type, file, encrypt = true, authToken } = input

  const formData = new FormData()
  formData.append("userId", userId)
  formData.append("type", type)
  formData.append("filename", file.name)

  if (encrypt && typeof crypto !== "undefined" && crypto.subtle) {
    const key = await generateEncryptionKey()
    const { encrypted, iv } = await encryptFile(file, key)
    const keyBase64 = await exportKey(key)
    const ivBase64 = btoa(String.fromCharCode(...iv))

    formData.append("file", new Blob([encrypted]), file.name)
    formData.append("encryptionKey", keyBase64)
    formData.append("iv", ivBase64)
    formData.append("encrypted", "true")
  } else {
    formData.append("file", file)
    formData.append("encrypted", "false")
  }

  return apiRequest<KycDocument>("/api/verification/documents", {
    method: "POST",
    authToken,
    body: formData,
  })
}

export async function deleteDocument(
  documentId: string,
  authToken?: string
): Promise<void> {
  await apiRequest(`/api/verification/documents/${documentId}`, {
    method: "DELETE",
    authToken,
    parseAs: "response",
  })
}

export async function submitForReview(
  userId: string,
  targetLevel: KycLevel,
  authToken?: string
): Promise<void> {
  await apiRequest("/api/verification/submit", {
    method: "POST",
    authToken,
    body: JSON.stringify({ userId, targetLevel }),
  })
}

// ── Admin API helpers ──────────────────────────────────────────────────────────

export async function fetchReviewQueue(
  opts: { status?: VerificationStatus; limit?: number; cursor?: string } = {},
  authToken?: string
): Promise<ReviewQueueResponse> {
  return apiRequest<ReviewQueueResponse>("/api/verification/review-queue", {
    authToken,
    query: {
      status: opts.status,
      limit: opts.limit ?? 20,
      cursor: opts.cursor,
    },
  })
}

export async function reviewSubmission(input: ReviewSubmissionInput): Promise<KycSubmission> {
  const { submissionId, action, notes, authToken } = input
  return apiRequest<KycSubmission>(`/api/verification/review/${submissionId}`, {
    method: "POST",
    authToken,
    body: JSON.stringify({ action, notes }),
  })
}

// ── Withdrawal limits by level ─────────────────────────────────────────────────

export const WITHDRAWAL_LIMITS: Record<KycLevel, { daily: number; monthly: number; perTxn: number }> = {
  0: { daily: 0, monthly: 0, perTxn: 0 },
  1: { daily: 500, monthly: 5000, perTxn: 500 },
  2: { daily: 5000, monthly: 50000, perTxn: 5000 },
  3: { daily: 50000, monthly: 500000, perTxn: 50000 },
}
