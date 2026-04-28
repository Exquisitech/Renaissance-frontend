export type SupportedCurrency = "XLM" | "USDC";

export interface ExchangeRatePoint {
  timestamp: string;
  xlmToUsdc: number;
}

export interface ExchangeRatesSnapshot {
  baseCurrency: "XLM";
  rates: Record<SupportedCurrency, number>;
  lastUpdated: string;
  history: ExchangeRatePoint[];
}

const mockHistory: ExchangeRatePoint[] = [
  { timestamp: "2026-04-28T03:00:00.000Z", xlmToUsdc: 0.121 },
  { timestamp: "2026-04-28T06:00:00.000Z", xlmToUsdc: 0.124 },
  { timestamp: "2026-04-28T09:00:00.000Z", xlmToUsdc: 0.127 },
  { timestamp: "2026-04-28T12:00:00.000Z", xlmToUsdc: 0.129 },
  { timestamp: "2026-04-28T15:00:00.000Z", xlmToUsdc: 0.128 },
  { timestamp: "2026-04-28T18:00:00.000Z", xlmToUsdc: 0.131 },
];

export async function fetchExchangeRates(): Promise<ExchangeRatesSnapshot> {
  return {
    baseCurrency: "XLM",
    rates: {
      XLM: 1,
      USDC: mockHistory[mockHistory.length - 1]?.xlmToUsdc ?? 0.131,
    },
    lastUpdated: "2026-04-28T18:00:00.000Z",
    history: mockHistory,
  };
}

export function convertFromXlm(amount: number, currency: SupportedCurrency, rate: number) {
  if (currency === "XLM") {
    return amount;
  }

  return amount * rate;
}

export function formatDisplayAmount(amount: number, currency: SupportedCurrency) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: currency === "USDC" ? "currency" : "decimal",
    currency: currency === "USDC" ? "USD" : undefined,
    minimumFractionDigits: currency === "USDC" ? 2 : 2,
    maximumFractionDigits: currency === "USDC" ? 2 : 2,
  });

  if (currency === "USDC") {
    return formatter.format(amount);
  }

  return `${formatter.format(amount)} XLM`;
}

export function formatRateLabel(rate: number) {
  return `1 XLM = ${rate.toFixed(4)} USDC`;
}

export function formatLastUpdated(lastUpdated: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(lastUpdated));
}
