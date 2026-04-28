import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CreateDisputeModal } from "@/components/disputes/CreateDisputeModal";
import { DisputeList } from "@/components/disputes/DisputeList";
import type { SettledBet, DisputeRecord } from "@/lib/api/disputes";

const bet: SettledBet = {
  id: "bet-2001",
  matchLabel: "Arsenal vs Chelsea",
  market: "Arsenal to win",
  stakeAmount: 25,
  payoutAmount: 0,
  settledResult: "Marked as loss after a 2-2 draw",
  settledAt: "2026-04-27T18:15:00.000Z",
  eligibleForDispute: true,
};

const disputes: DisputeRecord[] = [
  {
    id: "disp-1001",
    userId: "default-user",
    betId: "bet-2001",
    title: "Final score was corrected late",
    reason: "Feed correction happened after settlement.",
    requestedOutcome: "Recalculate the result.",
    status: "investigating",
    createdAt: "2026-04-27T19:05:00.000Z",
    updatedAt: "2026-04-28T08:15:00.000Z",
    adminNote: "Checking official result feed.",
    evidence: {
      screenshots: ["official-score.png"],
      links: ["https://example.com/report"],
    },
  },
];

describe("Dispute components", () => {
  it("submits a dispute with evidence fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <CreateDisputeModal
        bet={bet}
        open
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText("Dispute title"), "Settlement was wrong");
    await user.type(screen.getByLabelText("Reason"), "Official result changed");
    await user.type(
      screen.getByLabelText("Requested outcome"),
      "Void or recalculate the bet",
    );
    await user.type(
      screen.getByLabelText("Evidence screenshots"),
      "score.png, report.jpg",
    );
    await user.type(
      screen.getByLabelText("Evidence links"),
      "https://example.com/report",
    );
    await user.click(screen.getByRole("button", { name: "Submit dispute" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Settlement was wrong",
        evidence: {
          screenshots: ["score.png", "report.jpg"],
          links: ["https://example.com/report"],
        },
      }),
    );
  });

  it("renders dispute history and transport label", () => {
    render(<DisputeList disputes={disputes} transport="broadcast" />);

    expect(screen.getByText("Dispute History")).toBeInTheDocument();
    expect(screen.getByText("Live updates via broadcast")).toBeInTheDocument();
    expect(screen.getByText("Checking official result feed.")).toBeInTheDocument();
  });
});
