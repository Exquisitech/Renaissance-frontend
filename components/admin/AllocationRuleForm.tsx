"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import type { AllocationRule, CreateAllocationRuleInput } from "@/lib/api/admin/treasury";

// ── Validation ────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  allocationPct: z
    .number({ invalid_type_error: "Must be a number" })
    .min(0.01, "Must be > 0")
    .max(100, "Max 100%"),
  priority: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(1),
  enabled: z.boolean(),
  condition: z.object({
    rankMin: z.number().int().min(1).optional().or(z.literal("")),
    rankMax: z.number().int().min(1).optional().or(z.literal("")),
    minBetCount: z.number().int().min(0).optional().or(z.literal("")),
    minProfit: z.number().min(0).optional().or(z.literal("")),
  }),
});

type FormValues = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────

interface AllocationRuleFormProps {
  initialValues?: Partial<AllocationRule>;
  onSubmit: (values: CreateAllocationRuleInput) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
}

export function AllocationRuleForm({
  initialValues,
  onSubmit,
  onCancel,
  className,
}: AllocationRuleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      allocationPct: initialValues?.allocationPct ?? 0,
      priority: initialValues?.priority ?? 1,
      enabled: initialValues?.enabled ?? true,
      condition: {
        rankMin: initialValues?.condition?.rankMin ?? "",
        rankMax: initialValues?.condition?.rankMax ?? "",
        minBetCount: initialValues?.condition?.minBetCount ?? "",
        minProfit: initialValues?.condition?.minProfit ?? "",
      },
    },
  });

  const submit = async (values: FormValues) => {
    const rule: CreateAllocationRuleInput = {
      name: values.name,
      description: values.description,
      allocationPct: values.allocationPct,
      priority: values.priority,
      enabled: values.enabled,
      condition: {
        rankMin: values.condition.rankMin !== "" ? Number(values.condition.rankMin) : undefined,
        rankMax: values.condition.rankMax !== "" ? Number(values.condition.rankMax) : undefined,
        minBetCount: values.condition.minBetCount !== "" ? Number(values.condition.minBetCount) : undefined,
        minProfit: values.condition.minProfit !== "" ? Number(values.condition.minProfit) : undefined,
      },
    };
    await onSubmit(rule);
  };

  return (
    <form
      data-testid="allocation-rule-form"
      onSubmit={handleSubmit(submit)}
      className={cn("space-y-5 rounded-xl border bg-card p-6", className)}
      noValidate
    >
      <h3 className="font-semibold text-foreground">
        {initialValues?.id ? "Edit Rule" : "New Allocation Rule"}
      </h3>

      {/* Name */}
      <Field label="Rule name" error={errors.name?.message}>
        <input
          {...register("name")}
          placeholder="e.g. Top performer bonus"
          className={inputCls}
        />
      </Field>

      {/* Description */}
      <Field label="Description (optional)">
        <input {...register("description")} placeholder="…" className={inputCls} />
      </Field>

      {/* Allocation % */}
      <Field label="Allocation %" error={errors.allocationPct?.message}>
        <input
          {...register("allocationPct", { valueAsNumber: true })}
          type="number"
          step="0.01"
          min={0}
          max={100}
          className={inputCls}
        />
      </Field>

      {/* Priority */}
      <Field label="Priority (lower = higher priority)" error={errors.priority?.message}>
        <input
          {...register("priority", { valueAsNumber: true })}
          type="number"
          min={1}
          className={inputCls}
        />
      </Field>

      {/* Condition builder */}
      <fieldset className="rounded-lg border p-4 space-y-3">
        <legend className="px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Eligibility conditions
        </legend>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Rank min" error={(errors.condition?.rankMin as any)?.message}>
            <input
              {...register("condition.rankMin", { setValueAs: coerceOptionalInt })}
              type="number"
              min={1}
              placeholder="–"
              className={inputCls}
            />
          </Field>
          <Field label="Rank max" error={(errors.condition?.rankMax as any)?.message}>
            <input
              {...register("condition.rankMax", { setValueAs: coerceOptionalInt })}
              type="number"
              min={1}
              placeholder="–"
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Min bet count">
            <input
              {...register("condition.minBetCount", { setValueAs: coerceOptionalInt })}
              type="number"
              min={0}
              placeholder="–"
              className={inputCls}
            />
          </Field>
          <Field label="Min profit (XLM)">
            <input
              {...register("condition.minProfit", { setValueAs: coerceOptionalFloat })}
              type="number"
              min={0}
              step="0.01"
              placeholder="–"
              className={inputCls}
            />
          </Field>
        </div>
      </fieldset>

      {/* Enabled toggle */}
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input type="checkbox" {...register("enabled")} className="h-4 w-4 rounded" />
        Rule enabled
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving…" : "Save rule"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-5 py-2 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-0.5 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

const coerceOptionalInt = (v: unknown) =>
  v === "" || v === null || v === undefined ? "" : Number(v);

const coerceOptionalFloat = (v: unknown) =>
  v === "" || v === null || v === undefined ? "" : Number(v);
