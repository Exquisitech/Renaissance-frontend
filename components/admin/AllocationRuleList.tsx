"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, GripVertical, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AllocationRule, AllocationPreview, CreateAllocationRuleInput } from "@/lib/api/admin/treasury";
import {
  fetchAllocationRules,
  deleteAllocationRule,
  updateAllocationRule,
  reorderAllocationRules,
  previewAllocation,
  createAllocationRule,
} from "@/lib/api/admin/treasury";
import { AllocationRuleForm } from "./AllocationRuleForm";

interface AllocationRuleListProps {
  className?: string;
}

export function AllocationRuleList({ className }: AllocationRuleListProps) {
  const [rules, setRules] = useState<AllocationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [preview, setPreview] = useState<AllocationPreview[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const totalPct = rules
    .filter((r) => r.enabled)
    .reduce((s, r) => s + r.allocationPct, 0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllocationRules();
      setRules(data.sort((a, b) => a.priority - b.priority));
    } catch {
      toast.error("Failed to load allocation rules.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    try {
      await deleteAllocationRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rule deleted.");
    } catch {
      toast.error("Failed to delete rule.");
    }
  };

  const handleSave = async (
    values: CreateAllocationRuleInput,
    id?: string
  ) => {
    try {
      if (id) {
        const updated = await updateAllocationRule(id, values);
        setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
        toast.success("Rule updated.");
      } else {
        const created = await createAllocationRule(values);
        setRules((prev) =>
          [...prev, created].sort((a, b) => a.priority - b.priority)
        );
        toast.success("Rule created.");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save rule.");
    }
  };

  // Drag-and-drop reorder (mouse events only — keyboard via priority field)
  const onDragStart = (i: number) => setDragIndex(i);
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    setRules((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      setDragIndex(i);
      return next;
    });
  };
  const onDrop = async () => {
    setDragIndex(null);
    try {
      await reorderAllocationRules(rules.map((r) => r.id));
    } catch {
      toast.error("Failed to save order.");
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const data = await previewAllocation(100_000);
      setPreview(data);
    } catch {
      toast.error("Failed to generate preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div data-testid="allocation-rule-list" className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Treasury Allocation Rules</h2>
          <p className="text-sm text-muted-foreground">
            Active total:{" "}
            <span className={cn("font-medium", totalPct > 100 && "text-destructive")}>
              {totalPct.toFixed(2)}%
            </span>
            {totalPct > 100 && " — exceeds 100%"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            disabled={previewLoading}
            className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Eye className="h-3.5 w-3.5" />
            {previewLoading ? "Loading…" : "Preview"}
          </button>
          <button
            onClick={() => setEditingId("new")}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            + New rule
          </button>
        </div>
      </div>

      {/* New-rule form */}
      {editingId === "new" && (
        <AllocationRuleForm
          onSubmit={(v) => handleSave(v)}
          onCancel={() => setEditingId(null)}
        />
      )}

      {/* Rules list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl border bg-muted animate-pulse" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <p className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No rules yet. Create your first rule above.
        </p>
      ) : (
        <ul className="space-y-3">
          {rules.map((rule, i) => (
            <li key={rule.id}>
              {editingId === rule.id ? (
                <AllocationRuleForm
                  initialValues={rule}
                  onSubmit={(v) => handleSave(v, rule.id)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  data-testid="allocation-rule-item"
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={onDrop}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-shadow",
                    dragIndex === i && "shadow-lg ring-2 ring-primary"
                  )}
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground cursor-grab" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rule.name}</span>
                      {!rule.enabled && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          Disabled
                        </span>
                      )}
                    </div>
                    {rule.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {rule.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Priority {rule.priority} ·{" "}
                      <span className="font-medium text-foreground">
                        {rule.allocationPct}%
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => setEditingId(rule.id)}
                      aria-label={`Edit ${rule.name}`}
                      className="rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      aria-label={`Delete ${rule.name}`}
                      className="rounded p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Preview panel */}
      {preview && (
        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-3 font-semibold">Allocation Preview (100,000 XLM pool)</h3>
          {preview.length === 0 ? (
            <p className="text-sm text-muted-foreground">No allocations to preview.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2">Rule</th>
                  <th className="pb-2">Recipients</th>
                  <th className="pb-2 text-right">Amount (XLM)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {preview.map((p) => (
                  <tr key={p.ruleId}>
                    <td className="py-1.5">{p.ruleName}</td>
                    <td className="py-1.5">{p.estimatedRecipients}</td>
                    <td className="py-1.5 text-right font-medium">
                      {p.estimatedAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
