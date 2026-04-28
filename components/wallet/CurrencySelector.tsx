"use client";

import { Select } from "@/components/ui/select";
import type { SupportedCurrency } from "@/lib/api/exchange-rates";

interface CurrencySelectorProps {
  value: SupportedCurrency;
  onValueChange: (value: SupportedCurrency) => void;
}

const currencyOptions = [
  { value: "XLM", label: "XLM" },
  { value: "USDC", label: "USDC" },
] as const;

export function CurrencySelector({
  value,
  onValueChange,
}: CurrencySelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Display currency</p>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue as SupportedCurrency)}
        options={[...currencyOptions]}
        placeholder="Choose a currency"
      />
    </div>
  );
}
