import { ArrowUpDown, Clock3, Wallet } from "lucide-react";

import { CurrencySelector } from "@/components/wallet/CurrencySelector";
import { ExchangeRateChart } from "@/components/wallet/ExchangeRateChart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  convertFromXlm,
  formatDisplayAmount,
  formatLastUpdated,
  formatRateLabel,
  type ExchangeRatesSnapshot,
  type SupportedCurrency,
} from "@/lib/api/exchange-rates";

interface WalletBalanceProps {
  balanceXlm: number;
  displayCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  rates: ExchangeRatesSnapshot | null;
}

export function WalletBalance({
  balanceXlm,
  displayCurrency,
  onCurrencyChange,
  rates,
}: WalletBalanceProps) {
  const rate = rates?.rates.USDC ?? 0;
  const convertedBalance = convertFromXlm(balanceXlm, displayCurrency, rate);
  const alternateCurrency = displayCurrency === "XLM" ? "USDC" : "XLM";
  const alternateValue = convertFromXlm(balanceXlm, alternateCurrency, rate);

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Wallet Balance
            </CardTitle>
            <CardDescription>
              Switch between XLM and USDC using the latest mocked exchange feed.
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {rates ? formatRateLabel(rate) : "Loading rates"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Available balance</p>
            <p className="mt-2 text-3xl font-semibold">
              {formatDisplayAmount(convertedBalance, displayCurrency)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Also worth {formatDisplayAmount(alternateValue, alternateCurrency)}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <CurrencySelector
              value={displayCurrency}
              onValueChange={onCurrencyChange}
            />
            <div className="mt-4 rounded-lg border bg-background/60 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Last updated
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                {rates ? formatLastUpdated(rates.lastUpdated) : "Refreshing..."}
              </p>
            </div>
          </div>
        </div>

        {rates ? <ExchangeRateChart history={rates.history} currency={displayCurrency} /> : null}
      </CardContent>
    </Card>
  );
}
