"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Gavel, RadioTower } from "lucide-react";
import { toast } from "sonner";

import { DashboardNav } from "@/components/dashboard-nav";
import { DisputeStatusBadge } from "@/components/disputes/DisputeStatusBadge";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showApiErrorToast } from "@/hooks/use-toast";
import { useDisputeUpdates } from "@/hooks/use-dispute-updates";
import {
  fetchAdminDisputes,
  reviewDispute,
  type DisputeRecord,
} from "@/lib/api/disputes";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setDisputes(await fetchAdminDisputes());
    } catch (error) {
      showApiErrorToast(error, "Failed to load dispute review queue");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const transport = useDisputeUpdates(() => {
    void load();
  });

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
                <h1 className="text-3xl font-bold tracking-tight">Dispute Review</h1>
                <p className="text-sm text-muted-foreground">
                  Moderate bet-result disputes, request corrections, and publish
                  status updates in real time.
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/stake">Open stake history</Link>
                </Button>
                <Button asChild>
                  <Link href="/admin/dashboard">Back to admin</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Open cases</CardTitle>
                  <CardDescription>Awaiting first review</CardDescription>
                </CardHeader>
                <CardContent className="text-3xl font-semibold">
                  {disputes.filter((item) => item.status === "open").length}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Investigating</CardTitle>
                  <CardDescription>Currently under moderation</CardDescription>
                </CardHeader>
                <CardContent className="text-3xl font-semibold">
                  {disputes.filter((item) => item.status === "investigating").length}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Realtime transport</CardTitle>
                  <CardDescription>Dispute updates channel</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-lg font-medium capitalize">
                  <RadioTower className="h-5 w-5 text-primary" />
                  {transport}
                </CardContent>
              </Card>
            </div>

            <div className="rounded-xl border bg-card">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Admin dispute queue</h2>
                <p className="text-sm text-muted-foreground">
                  Evidence, review notes, and status controls for each dispute.
                </p>
              </div>

              <div className="divide-y">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="space-y-4 px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{dispute.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {dispute.id} · Bet {dispute.betId} · Created{" "}
                          {new Date(dispute.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <DisputeStatusBadge status={dispute.status} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                        <p className="font-medium">Reason</p>
                        <p className="mt-1 text-muted-foreground">{dispute.reason}</p>
                      </div>
                      <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                        <p className="font-medium">Requested outcome</p>
                        <p className="mt-1 text-muted-foreground">
                          {dispute.requestedOutcome}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                        <p className="font-medium">Evidence package</p>
                        <p className="mt-1 text-muted-foreground">
                          Screenshots:{" "}
                          {dispute.evidence.screenshots.join(", ") || "None"}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          Links: {dispute.evidence.links.join(", ") || "None"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        disabled={reviewingId === dispute.id}
                        onClick={async () => {
                          setReviewingId(dispute.id);
                          try {
                            await reviewDispute({
                              id: dispute.id,
                              status: "investigating",
                              adminNote:
                                "Evidence received. Moderator is validating official match data.",
                            });
                            toast.success("Dispute moved to investigating.");
                            await load();
                          } catch (error) {
                            showApiErrorToast(error, "Failed to update dispute");
                          } finally {
                            setReviewingId(null);
                          }
                        }}
                      >
                        <Gavel className="h-4 w-4" />
                        Investigate
                      </Button>
                      <Button
                        disabled={reviewingId === dispute.id}
                        onClick={async () => {
                          setReviewingId(dispute.id);
                          try {
                            await reviewDispute({
                              id: dispute.id,
                              status: "resolved",
                              adminNote:
                                "Resolved and published to the user notification stream.",
                            });
                            toast.success("Dispute resolved.");
                            await load();
                          } catch (error) {
                            showApiErrorToast(error, "Failed to resolve dispute");
                          } finally {
                            setReviewingId(null);
                          }
                        }}
                      >
                        Resolve dispute
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
