"use client";

import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WithdrawalStatusBadge } from "@/components/withdrawal/WithdrawalStatusBadge";
import type { WithdrawalRequest, WithdrawalStatus } from "@/lib/api/withdrawal";

interface WithdrawalQueueTableProps {
  title: string;
  description: string;
  requests: WithdrawalRequest[];
  isAdmin?: boolean;
  reviewingId?: string | null;
  onReview?: (id: string, status: Exclude<WithdrawalStatus, "pending">) => void;
}

export function WithdrawalQueueTable({
  title,
  description,
  requests,
  isAdmin = false,
  reviewingId,
  onReview,
}: WithdrawalQueueTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {requests.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          No withdrawal requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-6 py-3">Request</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Wallet</th>
                <th className="px-6 py-3">Notes</th>
                {isAdmin ? <th className="px-6 py-3 text-right">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((request) => (
                <tr key={request.id} className="align-top">
                  <td className="px-6 py-4">
                    <p className="font-medium">{request.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                    {request.requiresAdminApproval ? (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                        <ShieldAlert className="h-3 w-3" />
                        Large withdrawal
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 font-medium">{request.amount.toFixed(2)} XLM</td>
                  <td className="px-6 py-4">
                    <WithdrawalStatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {request.walletAddress}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <p>{request.note || "No note provided."}</p>
                    {request.reviewNote ? (
                      <p className="mt-2 text-xs">Review: {request.reviewNote}</p>
                    ) : null}
                  </td>
                  {isAdmin ? (
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={request.status !== "pending" || reviewingId === request.id}
                          onClick={() => onReview?.(request.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={request.status !== "pending" || reviewingId === request.id}
                          onClick={() => onReview?.(request.id, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={
                            (request.status !== "approved" &&
                              request.status !== "pending") ||
                            reviewingId === request.id
                          }
                          onClick={() => onReview?.(request.id, "processed")}
                        >
                          Process
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
