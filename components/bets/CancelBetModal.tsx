"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Coins, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ActiveBet } from "@/lib/api/bets";

interface CancelBetModalProps {
  bet: ActiveBet;
  open: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
}

export function CancelBetModal({
  bet,
  open,
  submitting = false,
  onClose,
  onSubmit,
}: CancelBetModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open, bet.id]);

  if (!open) {
    return null;
  }

  const canSubmit = reason.trim().length >= 3 && !submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-background shadow-2xl">
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Cancel bet</h2>
            <p className="text-sm text-muted-foreground">
              Cancel `{bet.matchLabel}` and request a refund.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close cancel bet modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          className="space-y-4 px-6 py-5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!canSubmit) return;
            await onSubmit(reason.trim());
          }}
        >
          <div className="rounded-xl border bg-muted/30 p-4 text-sm space-y-1">
            <p className="font-medium">{bet.matchLabel}</p>
            <p className="text-muted-foreground">
              {bet.market} · {bet.selection} @ {bet.odds.toFixed(2)}
            </p>
            <p className="text-muted-foreground">
              Stake {bet.stakeAmount.toFixed(2)} XLM
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <Coins className="h-4 w-4" />
                Refund amount
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {bet.refundAmount.toFixed(2)} XLM
              </p>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-300">
                <Clock className="h-4 w-4" />
                Refund timeline
              </div>
              <p className="mt-2 text-sm font-medium leading-snug">
                {bet.refundTimeline}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Cancelling removes this bet from the market. The refund is credited
              on the timeline above and the cancellation is recorded in your bet
              history.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-bet-reason">Cancellation reason</Label>
            <textarea
              id="cancel-bet-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="Why are you cancelling this bet?"
              required
              minLength={3}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              At least 3 characters. This note is stored with the cancelled bet.
            </p>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Keep bet
            </Button>
            <Button type="submit" variant="destructive" disabled={!canSubmit}>
              {submitting ? "Cancelling…" : "Confirm cancellation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
