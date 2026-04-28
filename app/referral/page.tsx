import { Header } from "@/components/header"
import { DashboardNav } from "@/components/dashboard-nav"
import { ReferralCodeDisplay, ReferralStats, ReferralHistory } from "@/components/referral"
import { fetchReferralCode, fetchReferralStats } from "@/lib/api/referral"

// ── Server Data Fetching ───────────────────────────────────────────────────────

async function getReferralData(userId: string, authToken?: string) {
  try {
    const [code, stats] = await Promise.all([
      fetchReferralCode(userId, authToken),
      fetchReferralStats(userId, authToken),
    ])
    return { code, stats }
  } catch {
    return { code: null, stats: null }
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Referral Program | Renaissance",
  description: "Invite friends and earn bonuses with your referral code",
}

export default async function ReferralPage() {
  // In production, get these from your auth session/cookie
  const userId = "demo-user"
  const authToken = undefined

  const { code, stats } = await getReferralData(userId, authToken)

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
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Referral Program</h1>
              <p className="text-sm text-muted-foreground">
                Invite friends to Renaissance and earn bonuses for every signup.
              </p>
            </div>

            {/* Code Display */}
            <ReferralCodeDisplay
              userId={userId}
              initialCode={code}
              authToken={authToken}
            />

            {/* Stats */}
            <ReferralStats stats={stats} />

            {/* History */}
            <div className="min-h-[400px]">
              <ReferralHistory userId={userId} authToken={authToken} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
