"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Home, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { WithdrawalRequestForm } from "@/components/withdrawal/WithdrawalRequestForm";
import { WithdrawalQueueTable } from "@/components/withdrawal/WithdrawalQueueTable";
import { showApiErrorToast } from "@/hooks/use-toast";
import {
  createWithdrawalRequest,
  fetchUserWithdrawals,
  fetchWithdrawalLimits,
  type WithdrawalLimits,
  type WithdrawalRequest,
} from "@/lib/api/withdrawal";

const USER_ID = "default-user";

export default function WithdrawalsPage() {
  const [limits, setLimits] = useState<WithdrawalLimits | null>(null);
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [nextLimits, nextRequests] = await Promise.all([
        fetchWithdrawalLimits(USER_ID),
        fetchUserWithdrawals(USER_ID),
      ]);
      setLimits(nextLimits);
      setRequests(nextRequests);
    } catch (error) {
      showApiErrorToast(error, "Failed to load withdrawal queue");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
            <p className="text-sm text-muted-foreground">
              Request payouts, monitor approval status, and keep your withdrawal
              notifications in sync.
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/withdrawals">
                <Wallet className="h-4 w-4" />
                Admin queue
              </Link>
            </Button>
          </div>
        </div>

        <WithdrawalRequestForm
          limits={limits}
          submitting={submitting}
          onSubmit={async (input) => {
            setSubmitting(true);
            try {
              const created = await createWithdrawalRequest({
                userId: USER_ID,
                ...input,
              });
              toast.success(
                created.requiresAdminApproval
                  ? "Withdrawal submitted and flagged for admin approval."
                  : "Withdrawal submitted successfully.",
              );
              await load();
            } catch (error) {
              showApiErrorToast(error, "Failed to submit withdrawal request");
            } finally {
              setSubmitting(false);
            }
          }}
        />

        <WithdrawalQueueTable
          title="Your Withdrawal Queue"
          description="Track pending, approved, rejected, and processed requests."
          requests={requests}
        />

        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <ArrowRightLeft className="h-4 w-4 text-sky-600" />
            Queue status guide
          </div>
          <p className="mt-2">
            `Pending` means your request is under review, `Approved` means it is
            cleared for payout, `Rejected` means action is needed, and `Processed`
            confirms the transfer has been completed.
          </p>
        </div>
      </main>
    </div>
  );
}
