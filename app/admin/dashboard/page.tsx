import Link from "next/link"
import { ArrowRightLeft, Gavel } from "lucide-react"
import { DatabaseHealthCard } from "@/components/admin/DatabaseHealthCard"
import { AllocationRuleList } from "@/components/admin/AllocationRuleList"
import { MarketplaceFeeSettings } from "@/components/admin/MarketplaceFeeSettings"
import { DashboardNav } from "@/components/dashboard-nav"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showAuthButtons={false} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block">
          <DashboardNav />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Operational telemetry, treasury controls, and API tooling for the Renaissance platform.</p>
              </div>
              <Button asChild>
                <Link href="/api-docs">Open API docs</Link>
              </Button>
            </div>

            <DatabaseHealthCard />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <AllocationRuleList />
              <div className="space-y-6">
                <MarketplaceFeeSettings />
                <Card className="border-secondary/20 bg-card/70">
                  <CardHeader>
                    <CardTitle>Withdrawal queue</CardTitle>
                    <CardDescription>
                      Review pending payout requests, large withdrawals, and final settlement steps.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/withdrawals">
                        <ArrowRightLeft className="h-4 w-4" />
                        Open withdrawal review
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-secondary/20 bg-card/70">
                  <CardHeader>
                    <CardTitle>Dispute moderation</CardTitle>
                    <CardDescription>
                      Review match-result disputes, evidence uploads, and resolution notes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/disputes">
                        <Gavel className="h-4 w-4" />
                        Open dispute queue
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-secondary/20 bg-card/70">
                  <CardHeader>
                    <CardTitle>Correlation-aware errors</CardTitle>
                    <CardDescription>
                      Admin workflows now show correlation IDs inside destructive toasts to simplify support and traceability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    When an API call fails, the toast includes the request ID and a report action so support can trace the failing call quickly.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}