import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

// ── #96 — RarityBadge & NFTCard ───────────────────────────────────────────────

import { RarityBadge } from "@/components/nft/RarityBadge";
import { NFTCard } from "@/components/nft/NFTCard";

describe("RarityBadge (#96)", () => {
  it("renders the rarity label", () => {
    render(<RarityBadge rarity="Legendary" />);
    expect(screen.getByText("Legendary")).toBeDefined();
  });

  it("has aria-label describing the rarity", () => {
    render(<RarityBadge rarity="Rare" />);
    expect(screen.getByLabelText("Rarity: Rare")).toBeDefined();
  });

  it("renders all four rarity tiers", () => {
    const { rerender } = render(<RarityBadge rarity="Common" />);
    expect(screen.getByText("Common")).toBeDefined();
    rerender(<RarityBadge rarity="Rare" />);
    expect(screen.getByText("Rare")).toBeDefined();
    rerender(<RarityBadge rarity="Epic" />);
    expect(screen.getByText("Epic")).toBeDefined();
    rerender(<RarityBadge rarity="Legendary" />);
    expect(screen.getByText("Legendary")).toBeDefined();
  });
});

describe("NFTCard (#96)", () => {
  const baseProps = {
    id: "nft-1",
    name: "Golden Boot",
    rarity: "Legendary" as const,
  };

  it("renders the card name", () => {
    render(<NFTCard {...baseProps} />);
    expect(screen.getByText("Golden Boot")).toBeDefined();
  });

  it("renders rarity badge inside the card", () => {
    render(<NFTCard {...baseProps} />);
    expect(screen.getByTestId("rarity-badge")).toBeDefined();
    expect(screen.getByText("Legendary")).toBeDefined();
  });

  it("shows spin multiplier badge when spinMultiplier is provided", () => {
    render(<NFTCard {...baseProps} spinMultiplier={3} />);
    expect(screen.getByTestId("spin-multiplier")).toBeDefined();
    expect(screen.getByText("3× spin")).toBeDefined();
  });

  it("does not show spin multiplier when not provided", () => {
    render(<NFTCard {...baseProps} />);
    expect(screen.queryByTestId("spin-multiplier")).toBeNull();
  });

  it("shows price when provided", () => {
    render(<NFTCard {...baseProps} price={150} currency="XLM" />);
    expect(screen.getByText("150 XLM")).toBeDefined();
  });

  it("calls onClick when clicked", () => {
    const handler = vi.fn();
    render(<NFTCard {...baseProps} onClick={handler} />);
    fireEvent.click(screen.getByTestId("nft-card"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Enter key", () => {
    const handler = vi.fn();
    render(<NFTCard {...baseProps} onClick={handler} />);
    fireEvent.keyDown(screen.getByTestId("nft-card"), { key: "Enter" });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

// ── #99 — FeeBreakdown ────────────────────────────────────────────────────────

import { FeeBreakdown } from "@/components/nft/FeeBreakdown";

const defaultFees = [
  { label: "Platform fee", recipient: "Platform treasury", bps: 250 },
  { label: "Creator royalty", recipient: "Creator wallet", bps: 500 },
];

describe("FeeBreakdown (#99)", () => {
  it("renders fee breakdown container", () => {
    render(<FeeBreakdown salePrice={1000} fees={defaultFees} />);
    expect(screen.getByTestId("fee-breakdown")).toBeDefined();
  });

  it("shows all fee labels", () => {
    render(<FeeBreakdown salePrice={1000} fees={defaultFees} />);
    expect(screen.getByText("Platform fee")).toBeDefined();
    expect(screen.getByText("Creator royalty")).toBeDefined();
  });

  it("calculates net amount correctly (7.5% total fees on 1000)", () => {
    render(<FeeBreakdown salePrice={1000} fees={defaultFees} currency="XLM" />);
    // 250 bps (2.5%) + 500 bps (5%) = 750 bps = 7.5% of 1000 = 75
    // net = 925
    expect(screen.getByTestId("net-amount").textContent).toContain("925.0000");
  });

  it("shows feesIncluded note when feesIncluded=true", () => {
    render(<FeeBreakdown salePrice={500} fees={defaultFees} feesIncluded />);
    expect(screen.getByText(/Prices shown already include all fees/i)).toBeDefined();
  });

  it("does not show feesIncluded note by default", () => {
    render(<FeeBreakdown salePrice={500} fees={defaultFees} />);
    expect(screen.queryByText(/Prices shown already include all fees/i)).toBeNull();
  });
});

// ── #99 — MarketplaceFeeSettings ──────────────────────────────────────────────

import { MarketplaceFeeSettings } from "@/components/admin/MarketplaceFeeSettings";

describe("MarketplaceFeeSettings (#99)", () => {
  it("renders the settings panel", () => {
    render(<MarketplaceFeeSettings />);
    expect(screen.getByTestId("marketplace-fee-settings")).toBeDefined();
  });

  it("shows default fees on load", () => {
    render(<MarketplaceFeeSettings />);
    expect(screen.getByDisplayValue("Platform fee")).toBeDefined();
    expect(screen.getByDisplayValue("Creator royalty")).toBeDefined();
  });

  it("can add a new fee row", () => {
    render(<MarketplaceFeeSettings />);
    const addBtn = screen.getByRole("button", { name: /\+ add fee/i });
    const initialInputs = screen.getAllByPlaceholderText("Label").length;
    fireEvent.click(addBtn);
    expect(screen.getAllByPlaceholderText("Label").length).toBe(initialInputs + 1);
  });

  it("calls onSave with current fees when form is submitted", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<MarketplaceFeeSettings onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: /save fees/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(Array.isArray(onSave.mock.calls[0][0])).toBe(true);
    });
  });
});

// ── #94 — NotificationCenter ──────────────────────────────────────────────────

vi.mock("@/lib/api/notifications", () => ({
  fetchNotifications: vi.fn(),
  markNotificationRead: vi.fn().mockResolvedValue(undefined),
  deleteNotification: vi.fn().mockResolvedValue(undefined),
  fetchNotificationPreferences: vi.fn(),
  updateNotificationPreferences: vi.fn(),
  sendTestNotification: vi.fn(),
  DEFAULT_PREFERENCES: [
    {
      type: "player_news",
      label: "Player News",
      description: "Breaking news",
      channels: { in_app: true, email: false, sms: false },
    },
  ],
}));

import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import * as notifApi from "@/lib/api/notifications";

const mockNotifications = [
  {
    id: "n1",
    userId: "user1",
    type: "reward" as const,
    title: "You won a spin!",
    message: "Your spin reward is ready.",
    data: {},
    read: false,
    createdAt: new Date().toISOString(),
  },
];

describe("NotificationCenter (#94)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (notifApi.fetchNotifications as ReturnType<typeof vi.fn>).mockResolvedValue({
      notifications: mockNotifications,
      unreadCount: 1,
      total: 1,
    });
  });

  it("renders the notification center", async () => {
    render(<NotificationCenter userId="user1" />);
    await waitFor(() => {
      expect(screen.getByTestId("notification-center")).toBeDefined();
    });
  });

  it("shows notification items after loading", async () => {
    render(<NotificationCenter userId="user1" />);
    await waitFor(() => {
      expect(screen.getByText("You won a spin!")).toBeDefined();
    });
  });

  it("shows empty state when no notifications", async () => {
    (notifApi.fetchNotifications as ReturnType<typeof vi.fn>).mockResolvedValue({
      notifications: [],
      unreadCount: 0,
      total: 0,
    });
    render(<NotificationCenter userId="user1" />);
    await waitFor(() => {
      expect(screen.getByText("No notifications yet.")).toBeDefined();
    });
  });

  it("marks notification as read when check button is clicked", async () => {
    render(<NotificationCenter userId="user1" />);
    await waitFor(() => screen.getByText("You won a spin!"));
    fireEvent.click(screen.getByLabelText("Mark as read"));
    expect(notifApi.markNotificationRead).toHaveBeenCalledWith("n1", true);
  });

  it("deletes notification when trash button is clicked", async () => {
    render(<NotificationCenter userId="user1" />);
    await waitFor(() => screen.getByText("You won a spin!"));
    fireEvent.click(screen.getByLabelText("Delete notification"));
    expect(notifApi.deleteNotification).toHaveBeenCalledWith("n1");
  });
});

// ── #93 — AllocationRuleForm ──────────────────────────────────────────────────

import { AllocationRuleForm } from "@/components/admin/AllocationRuleForm";

describe("AllocationRuleForm (#93)", () => {
  it("renders the form", () => {
    render(<AllocationRuleForm onSubmit={vi.fn()} />);
    expect(screen.getByTestId("allocation-rule-form")).toBeDefined();
  });

  it("shows validation error when name is empty on submit", async () => {
    render(<AllocationRuleForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /save rule/i }));
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeDefined();
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<AllocationRuleForm onSubmit={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit with form values on valid submit", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AllocationRuleForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("e.g. Top performer bonus"), {
      target: { value: "Test rule" },
    });

    const numberInputs = screen.getAllByRole("spinbutton");
    // allocationPct is the first numeric field
    fireEvent.change(numberInputs[0], { target: { value: "10" } });
    // priority is the second
    fireEvent.change(numberInputs[1], { target: { value: "1" } });

    fireEvent.click(screen.getByRole("button", { name: /save rule/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0].name).toBe("Test rule");
      expect(onSubmit.mock.calls[0][0].allocationPct).toBe(10);
    });
  });
});
