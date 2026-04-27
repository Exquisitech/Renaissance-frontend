"use client";

import { cn } from "@/lib/utils";

export interface FeeItem {
  label: string;
  recipient: string;
  /** Basis points (100 = 1 %) */
  bps: number;
}

export interface FeeBreakdownProps {
  /** Sale price in the listing currency */
  salePrice: number;
  currency?: string;
  fees: FeeItem[];
  /** When true, prices in the filter already include fees */
  feesIncluded?: boolean;
  className?: string;
}

function bpsToPercent(bps: number) {
  return (bps / 100).toFixed(2);
}

function feeAmount(price: number, bps: number) {
  return (price * bps) / 10_000;
}

export function FeeBreakdown({
  salePrice,
  currency = "XLM",
  fees,
  feesIncluded = false,
  className,
}: FeeBreakdownProps) {
  const totalFeeBps = fees.reduce((acc, f) => acc + f.bps, 0);
  const totalFeeAmount = feeAmount(salePrice, totalFeeBps);
  const netAmount = salePrice - totalFeeAmount;

  return (
    <div
      data-testid="fee-breakdown"
      className={cn("rounded-xl border bg-card p-4 text-sm", className)}
    >
      <h3 className="mb-3 font-semibold text-foreground">Fee Breakdown</h3>

      {/* Individual fee rows */}
      <ul className="space-y-2">
        {fees.map((fee) => {
          const amount = feeAmount(salePrice, fee.bps);
          return (
            <li
              key={fee.label}
              className="flex items-center justify-between text-muted-foreground"
            >
              <span className="flex flex-col">
                <span>{fee.label}</span>
                <span className="text-[10px] text-muted-foreground/60">
                  {fee.recipient} · {bpsToPercent(fee.bps)}%
                </span>
              </span>
              <span className="font-medium text-foreground">
                {amount.toFixed(4)} {currency}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="my-3 border-t" />

      {/* Total fees */}
      <div className="flex justify-between text-muted-foreground">
        <span>Total fees ({bpsToPercent(totalFeeBps)}%)</span>
        <span className="font-medium text-foreground">
          {totalFeeAmount.toFixed(4)} {currency}
        </span>
      </div>

      {/* Net seller payout */}
      <div className="mt-2 flex justify-between font-semibold">
        <span>Net to seller</span>
        <span data-testid="net-amount">
          {netAmount.toFixed(4)} {currency}
        </span>
      </div>

      {feesIncluded && (
        <p className="mt-3 rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">
          Prices shown already include all fees.
        </p>
      )}
    </div>
  );
}
