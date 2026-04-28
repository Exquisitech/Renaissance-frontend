"use client";

import { useState } from "react";
import { ExternalLink, Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DisputeEvidence, SettledBet } from "@/lib/api/disputes";

interface CreateDisputeModalProps {
  bet: SettledBet;
  open: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    reason: string;
    requestedOutcome: string;
    evidence: DisputeEvidence;
  }) => Promise<void> | void;
}

export function CreateDisputeModal({
  bet,
  open,
  submitting = false,
  onClose,
  onSubmit,
}: CreateDisputeModalProps) {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [requestedOutcome, setRequestedOutcome] = useState("");
  const [links, setLinks] = useState("");
  const [screenshots, setScreenshots] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border bg-background shadow-2xl">
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">File dispute</h2>
            <p className="text-sm text-muted-foreground">
              Review for `{bet.matchLabel}` on `{bet.market}`.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          className="space-y-4 px-6 py-5"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit({
              title,
              reason,
              requestedOutcome,
              evidence: {
                screenshots: screenshots
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
                links: links
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              },
            });
          }}
        >
          <div className="rounded-xl border bg-muted/30 p-4 text-sm">
            <p className="font-medium">{bet.matchLabel}</p>
            <p className="text-muted-foreground">{bet.settledResult}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispute-title">Dispute title</Label>
            <Input
              id="dispute-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Incorrect final result applied"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispute-reason">Reason</Label>
            <textarea
              id="dispute-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="Explain why this settlement looks wrong."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispute-outcome">Requested outcome</Label>
            <textarea
              id="dispute-outcome"
              value={requestedOutcome}
              onChange={(event) => setRequestedOutcome(event.target.value)}
              className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="Describe what should be corrected."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dispute-screenshots" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                Evidence screenshots
              </Label>
              <Input
                id="dispute-screenshots"
                value={screenshots}
                onChange={(event) => setScreenshots(event.target.value)}
                placeholder="scoreboard.png, official-feed.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Add screenshot names or references, comma separated.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dispute-links" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                Evidence links
              </Label>
              <Input
                id="dispute-links"
                value={links}
                onChange={(event) => setLinks(event.target.value)}
                placeholder="https://official-report.example"
              />
              <p className="text-xs text-muted-foreground">
                Add article, feed, or scoreboard URLs, comma separated.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit dispute"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
