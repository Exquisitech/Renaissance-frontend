import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WalletBalance } from "@/components/wallet/WalletBalance";
import type { ExchangeRatesSnapshot } from "@/lib/api/exchange-rates";

const rates: ExchangeRatesSnapshot = {
  baseCurrency: "XLM",
  rates: {
    XLM: 1,
    USDC: 0.131,
  },
  lastUpdated: "2026-04-28T18:00:00.000Z",
  history: [
    { timestamp: "2026-04-28T03:00:00.000Z", xlmToUsdc: 0.121 },
    { timestamp: "2026-04-28T06:00:00.000Z", xlmToUsdc: 0.124 },
    { timestamp: "2026-04-28T09:00:00.000Z", xlmToUsdc: 0.127 },
  ],
};

describe("Wallet components", () => {
  it("renders converted balances and exchange metadata", () => {
    render(
      <WalletBalance
        balanceXlm={100}
        displayCurrency="USDC"
        onCurrencyChange={vi.fn()}
        rates={rates}
      />,
    );

    expect(screen.getByText("$13.10")).toBeInTheDocument();
    expect(screen.getByText("Also worth 100.00 XLM")).toBeInTheDocument();
    expect(screen.getByText("1 XLM = 0.1310 USDC")).toBeInTheDocument();
    expect(screen.getByText("24h rate history")).toBeInTheDocument();
  });

  it("changes the selected display currency", async () => {
    const user = userEvent.setup();
    const onCurrencyChange = vi.fn();

    render(
      <WalletBalance
        balanceXlm={100}
        displayCurrency="XLM"
        onCurrencyChange={onCurrencyChange}
        rates={rates}
      />,
    );

    await user.click(screen.getByRole("button", { name: "XLM" }));
    await user.click(screen.getByRole("button", { name: "USDC" }));

    expect(onCurrencyChange).toHaveBeenCalledWith("USDC");
  });
});
