import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WithdrawalQueueTable } from "@/components/withdrawal/WithdrawalQueueTable";
import { WithdrawalRequestForm } from "@/components/withdrawal/WithdrawalRequestForm";
import type { WithdrawalRequest } from "@/lib/api/withdrawal";

const requests: WithdrawalRequest[] = [
  {
    id: "wd-1001",
    userId: "default-user",
    amount: 350,
    walletAddress: "GABCD...12345",
    createdAt: "2026-04-28T10:00:00.000Z",
    status: "pending",
    note: "Primary wallet payout",
    requiresAdminApproval: true,
    notificationPreferences: {
      email: true,
      sms: false,
    },
  },
];

describe("Withdrawal components", () => {
  it("submits a withdrawal request with notification preferences", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <WithdrawalRequestForm
        limits={{
          dailyRemaining: 400,
          weeklyRemaining: 1200,
          monthlyRemaining: 3000,
        }}
        onSubmit={onSubmit}
      />,
    );

    await user.clear(screen.getByLabelText("Amount"));
    await user.type(screen.getByLabelText("Amount"), "120");
    await user.click(screen.getByRole("button", { name: "SMS updates" }));
    await user.click(
      screen.getByRole("button", { name: "Submit withdrawal request" }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 120,
        notificationPreferences: {
          email: true,
          sms: true,
        },
      }),
    );
  });

  it("renders admin actions for pending requests", () => {
    render(
      <WithdrawalQueueTable
        title="Admin Review Queue"
        description="Queue"
        requests={requests}
        isAdmin
        onReview={vi.fn()}
      />,
    );

    expect(screen.getByText("Large withdrawal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Process" })).toBeInTheDocument();
  });
});
