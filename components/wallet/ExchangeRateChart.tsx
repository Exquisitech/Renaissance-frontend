import {
  formatDisplayAmount,
  type ExchangeRatePoint,
  type SupportedCurrency,
} from "@/lib/api/exchange-rates";

interface ExchangeRateChartProps {
  history: ExchangeRatePoint[];
  currency: SupportedCurrency;
}

export function ExchangeRateChart({
  history,
  currency,
}: ExchangeRateChartProps) {
  const maxRate = Math.max(...history.map((point) => point.xlmToUsdc), 0.2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">24h rate history</p>
        <p className="text-xs text-muted-foreground">
          {currency === "USDC" ? "Converted against USDC" : "Base balance in XLM"}
        </p>
      </div>

      <div className="space-y-2">
        {history.map((point) => {
          const width = Math.max((point.xlmToUsdc / maxRate) * 100, 8);
          const label = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date(point.timestamp));

          return (
            <div key={point.timestamp} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span>{formatDisplayAmount(point.xlmToUsdc, "USDC")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
