import { Header } from "@/components/header"
import { DashboardNav } from "@/components/dashboard-nav"
import { KYCSteps, VerificationStatus, AdminReviewQueue } from "@/components/verification"
import { fetchKycStatus, fetchUserDocuments } from "@/lib/api/verification"

// ── Server Data Fetching ───────────────────────────────────────────────────────

async function getVerificationData(userId: string, authToken?: string) {
  try {
    const [status, documents] = await Promise.all([
      fetchKycStatus(userId, authToken),
      fetchUserDocuments(userId, authToken),
    ])
    return { status, documents }
  } catch {
    return { status: null, documents: [] }
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "KYC Verification | Renaissance",
  description: "Complete your identity verification to unlock full platform features",
}

export default async function VerificationPage() {
  // In production, get these from your auth session/cookie
  const userId = "demo-user"
  const authToken = undefined
  const isAdmin = false // In production, check user role from session

  const { status, documents } = await getVerificationData(userId, authToken)

  return (
    <div className="flex min-h-screen flex-col">
      <Header showAuthButtons={false} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <DashboardNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {isAdmin ? "KYC Review Center" : "Identity Verification"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAdmin
                  ? "Review and approve user verification submissions."
                  : "Complete verification to unlock higher withdrawal limits and full platform access."}
              </p>
            </div>

            {isAdmin ? (
              /* Admin View */
              <div className="min-h-[600px]">
                <AdminReviewQueue authToken={authToken} />
              </div>
            ) : (
              /* User View */
              <>
                <VerificationStatus status={status} />
                <KYCSteps
                  userId={userId}
                  status={status}
                  documents={documents}
                  authToken={authToken}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
