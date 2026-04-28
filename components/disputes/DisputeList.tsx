"use client";

import { RadioTower } from "lucide-react";

import { DisputeStatusBadge } from "@/components/disputes/DisputeStatusBadge";
import type { DisputeRecord } from "@/lib/api/disputes";

interface DisputeListProps {
  disputes: DisputeRecord[];
  transport: "websocket" | "broadcast" | "polling";
}

export function DisputeList({ disputes, transport }: DisputeListProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">Dispute History</h2>
          <p className="text-sm text-muted-foreground">
            Review every open and resolved dispute tied to settled bets.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <RadioTower className="h-3.5 w-3.5" />
          Live updates via {transport}
        </div>
      </div>

      {disputes.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          No disputes filed yet.
        </div>
      ) : (
        <div className="divide-y">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="space-y-3 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{dispute.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Bet {dispute.betId} · Updated{" "}
                    {new Date(dispute.updatedAt).toLocaleString()}
                  </p>
                </div>
                <DisputeStatusBadge status={dispute.status} />
              </div>

              <p className="text-sm text-muted-foreground">{dispute.reason}</p>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                  <p className="font-medium">Requested outcome</p>
                  <p className="mt-1 text-muted-foreground">
                    {dispute.requestedOutcome}
                  </p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                  <p className="font-medium">Evidence</p>
                  <p className="mt-1 text-muted-foreground">
                    {dispute.evidence.screenshots.length} screenshots ·{" "}
                    {dispute.evidence.links.length} links
                  </p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                  <p className="font-medium">Admin note</p>
                  <p className="mt-1 text-muted-foreground">
                    {dispute.adminNote ?? "No review note yet."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
