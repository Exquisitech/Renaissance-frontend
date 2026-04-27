"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import type { FeeItem } from "@/components/nft/FeeBreakdown";

// ── Validation ────────────────────────────────────────────────────────────────

const feeRowSchema = z.object({
  label: z.string().min(1, "Label required"),
  recipient: z.string().min(1, "Recipient required"),
  bps: z
    .number({ invalid_type_error: "Must be a number" })
    .min(0, "Min 0")
    .max(5000, "Max 50%"),
});

const feeSettingsSchema = z.object({
  fees: z
    .array(feeRowSchema)
    .refine(
      (fees) => fees.reduce((s, f) => s + f.bps, 0) <= 5000,
      { message: "Total fees may not exceed 50%" }
    ),
});

type FeeSettingsForm = z.infer<typeof feeSettingsSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

interface MarketplaceFeeSettingsProps {
  initialFees?: FeeItem[];
  onSave?: (fees: FeeItem[]) => Promise<void> | void;
  className?: string;
}

const DEFAULT_FEES: FeeItem[] = [
  { label: "Platform fee", recipient: "Platform treasury", bps: 250 },
  { label: "Creator royalty", recipient: "Creator wallet", bps: 500 },
];

export function MarketplaceFeeSettings({
  initialFees = DEFAULT_FEES,
  onSave,
  className,
}: MarketplaceFeeSettingsProps) {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FeeSettingsForm>({
    resolver: zodResolver(feeSettingsSchema),
    defaultValues: { fees: initialFees },
  });

  const fees = watch("fees");
  const totalBps = fees.reduce((s, f) => s + (Number(f.bps) || 0), 0);
  const totalPct = (totalBps / 100).toFixed(2);

  const addFee = () => {
    setValue("fees", [
      ...getValues("fees"),
      { label: "", recipient: "", bps: 0 },
    ]);
  };

  const removeFee = (index: number) => {
    const current = getValues("fees");
    setValue(
      "fees",
      current.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: FeeSettingsForm) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onSave?.(data.fees);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-testid="marketplace-fee-settings"
      className={cn("rounded-xl border bg-card p-6", className)}
    >
      <h2 className="mb-1 text-lg font-semibold">Marketplace Fee Settings</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Configure platform and royalty fees applied to all NFT sales.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-3">
          {fees.map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-start"
            >
              <div>
                <input
                  {...register(`fees.${i}.label`)}
                  placeholder="Label"
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.fees?.[i]?.label && (
                  <p className="mt-0.5 text-[11px] text-destructive">
                    {errors.fees[i]!.label!.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register(`fees.${i}.recipient`)}
                  placeholder="Recipient"
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.fees?.[i]?.recipient && (
                  <p className="mt-0.5 text-[11px] text-destructive">
                    {errors.fees[i]!.recipient!.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register(`fees.${i}.bps`, { valueAsNumber: true })}
                  type="number"
                  min={0}
                  max={5000}
                  placeholder="bps"
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.fees?.[i]?.bps && (
                  <p className="mt-0.5 text-[11px] text-destructive">
                    {errors.fees[i]!.bps!.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeFee(i)}
                aria-label={`Remove fee ${i + 1}`}
                className="mt-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Total indicator */}
        <div
          className={cn(
            "mt-4 rounded px-3 py-2 text-sm font-medium",
            totalBps > 5000
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          )}
        >
          Total: {totalPct}%{totalBps > 5000 && " — exceeds 50% limit"}
        </div>

        {errors.fees?.root && (
          <p className="mt-1 text-[11px] text-destructive">
            {errors.fees.root.message}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={addFee}
            className="rounded-md border px-4 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            + Add fee
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save fees"}
          </button>

          {saveSuccess && (
            <span className="self-center text-sm text-green-500">Saved ✓</span>
          )}
        </div>
      </form>
    </div>
  );
}
