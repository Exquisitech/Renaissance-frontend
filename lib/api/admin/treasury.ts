import { apiRequest } from "@/lib/api/client"

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
  const data = await apiRequest<{ rules?: AllocationRule[] }>(`${BASE}/rules`)
  return data.rules ?? [];
}

export async function createAllocationRule(
  input: CreateAllocationRuleInput
): Promise<AllocationRule> {
  const data = await apiRequest<{ rule: AllocationRule }>(`${BASE}/rules`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.rule;
}

export async function updateAllocationRule(
  id: string,
  input: Partial<CreateAllocationRuleInput>
): Promise<AllocationRule> {
  const data = await apiRequest<{ rule: AllocationRule }>(`${BASE}/rules/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data.rule;
}

export async function deleteAllocationRule(id: string): Promise<void> {
  await apiRequest(`${BASE}/rules/${id}`, { method: "DELETE" });
}

export async function reorderAllocationRules(
  orderedIds: string[]
): Promise<void> {
  await apiRequest(`${BASE}/rules/reorder`, {
    method: "PUT",
    body: JSON.stringify({ orderedIds }),
  });
}

export async function previewAllocation(
  treasuryBalance: number
): Promise<AllocationPreview[]> {
  const data = await apiRequest<{ preview?: AllocationPreview[] }>(`${BASE}/rules/preview`, {
    query: { balance: treasuryBalance },
  })
  return data.preview ?? [];
}
