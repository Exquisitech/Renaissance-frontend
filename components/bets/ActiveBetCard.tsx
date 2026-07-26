"use client";

import { useState } from "react";
import { Ban, Calendar, TrendingUp } from "lucide-react";

import { BetStatusBadge } from "@/components/bets/BetStatusBadge";
import { CancelBetModal } from "@/components/bets/CancelBetModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ActiveBet, CancelBetResult } from "@/lib/api/bets";
import { cancelBet } from "@/lib/api/bets";
import { useToast } from "@/hooks/use-toast";

interface ActiveBetCardProps {
  bet: ActiveBet;
  onCancelled?: (result: CancelBetResult) => void;
}

export function ActiveBetCard({ bet, onCancelled }: ActiveBetCardProps) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCancel(reason: string) {
    setSubmitting(true);
    try {
      const result = await cancelBet(bet.id, reason);
      toast({
        title: "Bet cancelled",
        description: `Refund of ${result.refundAmount.toFixed(2)} XLM — ${result.refundTimeline}.`,
      });
      setModalOpen(false);
      onCancelled?.(result);
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to cancel this bet right now.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{bet.matchLabel}</CardTitle>
              <CardDescription>
                {bet.market} · {bet.selection} @ {bet.odds.toFixed(2)}
              </CardDescription>
            </div>
            <BetStatusBadge status={bet.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Stake</p>
              <p className="text-lg font-bold tabular-nums">
                {bet.stakeAmount.toFixed(2)} XLM
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential payout</p>
              <p className="text-lg font-bold tabular-nums">
                {bet.potentialPayout.toFixed(2)} XLM
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Kickoff
              </span>
              <span className="font-medium">
                {new Date(bet.kickoffAt).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                If cancelled
              </span>
              <span className="font-medium tabular-nums">
                {bet.refundAmount.toFixed(2)} XLM refund
              </span>
            </div>
          </div>

          {bet.cancellable ? (
            <>
              <Separator />
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setModalOpen(true)}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel Bet
              </Button>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              This bet is no longer eligible for cancellation.
            </p>
          )}
        </CardContent>
      </Card>

      <CancelBetModal
        bet={bet}
        open={modalOpen}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCancel}
      />
    </>
  );
}
