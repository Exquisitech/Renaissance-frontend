"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Wallet } from "lucide-react";
import { toast } from "sonner";

import { DashboardNav } from "@/components/dashboard-nav";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalQueueTable } from "@/components/withdrawal/WithdrawalQueueTable";
import { showApiErrorToast } from "@/hooks/use-toast";
import {
  fetchAdminWithdrawals,
  reviewWithdrawalRequest,
  type WithdrawalRequest,
  type WithdrawalStatus,
} from "@/lib/api/withdrawal";

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRequests(await fetchAdminWithdrawals());
    } catch (error) {
      showApiErrorToast(error, "Failed to load admin withdrawal queue");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
                <h1 className="text-3xl font-bold tracking-tight">
                  Withdrawal Queue
                </h1>
                <p className="text-sm text-muted-foreground">
                  Review large withdrawal requests, approve or reject them, and mark
                  completed payouts as processed.
                </p>
              </div>
              <Button asChild>
                <Link href="/withdrawals">
                  <Wallet className="h-4 w-4" />
                  User withdrawal page
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Pending review</CardTitle>
                  <CardDescription>Requests waiting for moderation</CardDescription>
                </CardHeader>
                <CardContent className="text-3xl font-semibold">
                  {requests.filter((item) => item.status === "pending").length}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Large withdrawals</CardTitle>
                  <CardDescription>Escalated to manual approval</CardDescription>
                </CardHeader>
                <CardContent className="text-3xl font-semibold">
                  {requests.filter((item) => item.requiresAdminApproval).length}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ready to process</CardTitle>
                  <CardDescription>Approved requests pending transfer</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-3xl font-semibold">
                  {requests.filter((item) => item.status === "approved").length}
                  <BadgeCheck className="h-6 w-6 text-emerald-500" />
                </CardContent>
              </Card>
            </div>

            <WithdrawalQueueTable
              title="Admin Review Queue"
              description="Approve, reject, or process requests directly from the queue."
              requests={requests}
              isAdmin
              reviewingId={reviewingId}
              onReview={async (
                id: string,
                status: Exclude<WithdrawalStatus, "pending">,
              ) => {
                setReviewingId(id);
                try {
                  await reviewWithdrawalRequest({
                    id,
                    status,
                    reviewNote:
                      status === "rejected"
                        ? "Rejected after manual review."
                        : status === "processed"
                          ? "Transfer settled and marked as processed."
                          : "Approved for payout.",
                  });
                  toast.success(`Withdrawal ${status}.`);
                  await load();
                } catch (error) {
                  showApiErrorToast(error, "Failed to update withdrawal status");
                } finally {
                  setReviewingId(null);
                }
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
