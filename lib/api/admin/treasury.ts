// ── Types ──────────────────────────────────────────────────────────────────────

export interface AllocationCondition {
  /** Inclusive lower bound of the user rank range */
  rankMin?: number;
  /** Inclusive upper bound of the user rank range */
  rankMax?: number;
  /** Minimum number of bets placed */
  minBetCount?: number;
  /** Minimum realised profit in XLM */
  minProfit?: number;
}

export interface AllocationRule {
  id: string;
  name: string;
  description?: string;
  condition: AllocationCondition;
  /** Percentage of treasury to allocate (0–100). Sum of all active rules ≤ 100. */
  allocationPct: number;
  /** Lower priority number = evaluated first */
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AllocationPreview {
  ruleId: string;
  ruleName: string;
  estimatedRecipients: number;
  estimatedAmount: number;
}

export type CreateAllocationRuleInput = Omit<
  AllocationRule,
  "id" | "createdAt" | "updatedAt"
>;

// ── API helpers ────────────────────────────────────────────────────────────────

const BASE = "/api/admin/treasury";

export async function fetchAllocationRules(): Promise<AllocationRule[]> {
  const res = await fetch(`${BASE}/rules`);
  if (!res.ok) throw new Error("Failed to fetch allocation rules");
  const data = await res.json();
  return data.rules ?? [];
}

export async function createAllocationRule(
  input: CreateAllocationRuleInput
): Promise<AllocationRule> {
  const res = await fetch(`${BASE}/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create allocation rule");
  const data = await res.json();
  return data.rule;
}

export async function updateAllocationRule(
  id: string,
  input: Partial<CreateAllocationRuleInput>
): Promise<AllocationRule> {
  const res = await fetch(`${BASE}/rules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update allocation rule");
  const data = await res.json();
  return data.rule;
}

export async function deleteAllocationRule(id: string): Promise<void> {
  const res = await fetch(`${BASE}/rules/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete allocation rule");
}

export async function reorderAllocationRules(
  orderedIds: string[]
): Promise<void> {
  const res = await fetch(`${BASE}/rules/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) throw new Error("Failed to reorder allocation rules");
}

export async function previewAllocation(
  treasuryBalance: number
): Promise<AllocationPreview[]> {
  const res = await fetch(
    `${BASE}/rules/preview?balance=${treasuryBalance}`
  );
  if (!res.ok) throw new Error("Failed to preview allocation");
  const data = await res.json();
  return data.preview ?? [];
}
