import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ActiveBetCard } from "@/components/bets/ActiveBetCard";
import { BetStatusBadge } from "@/components/bets/BetStatusBadge";
import { CancelBetModal } from "@/components/bets/CancelBetModal";
import type { ActiveBet } from "@/lib/api/bets";

const { toastMock, cancelBetMock } = vi.hoisted(() => ({
  toastMock: vi.fn(),
  cancelBetMock: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock("@/lib/api/bets", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/bets")>(
    "@/lib/api/bets",
  );
  return {
    ...actual,
    cancelBet: cancelBetMock,
  };
});

const cancellableBet: ActiveBet = {
  id: "bet-active-1001",
  userId: "default-user",
  matchLabel: "Arsenal vs Chelsea",
  market: "Match Winner",
  selection: "Arsenal",
  stakeAmount: 25,
  odds: 1.85,
  potentialPayout: 46.25,
  refundAmount: 25,
  refundTimeline: "Within 15 minutes",
  status: "active",
  placedAt: "2026-07-20T14:30:00.000Z",
  kickoffAt: "2026-07-25T15:00:00.000Z",
  cancellable: true,
};

describe("Bet cancellation UI", () => {
  beforeEach(() => {
    toastMock.mockReset();
    cancelBetMock.mockReset();
  });

  it("renders Cancelled status on BetStatusBadge", () => {
    render(<BetStatusBadge status="cancelled" />);
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("shows refund amount and timeline in the cancel modal", () => {
    render(
      <CancelBetModal
        bet={cancellableBet}
        open
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText("25.00 XLM")).toBeInTheDocument();
    expect(screen.getByText("Within 15 minutes")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancellation reason")).toBeInTheDocument();
  });

  it("submits a cancellation reason from the modal", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <CancelBetModal
        bet={cancellableBet}
        open
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(
      screen.getByLabelText("Cancellation reason"),
      "Changed my mind",
    );
    await user.click(
      screen.getByRole("button", { name: "Confirm cancellation" }),
    );

    expect(onSubmit).toHaveBeenCalledWith("Changed my mind");
  });

  it("cancels from ActiveBetCard and shows a success toast", async () => {
    const user = userEvent.setup();
    cancelBetMock.mockResolvedValue({
      bet: { ...cancellableBet, status: "cancelled", cancellable: false },
      refundAmount: 25,
      refundTimeline: "Within 15 minutes",
    });

    render(<ActiveBetCard bet={cancellableBet} />);

    await user.click(screen.getByRole("button", { name: /cancel bet/i }));
    await user.type(
      screen.getByLabelText("Cancellation reason"),
      "No longer want this bet",
    );
    await user.click(
      screen.getByRole("button", { name: "Confirm cancellation" }),
    );

    await waitFor(() => {
      expect(cancelBetMock).toHaveBeenCalledWith(
        "bet-active-1001",
        "No longer want this bet",
      );
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Bet cancelled",
      }),
    );
  });
});
