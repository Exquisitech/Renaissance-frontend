import { apiRequest } from "./client";

export type AuditAction =
  | "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "IMPORT";

export type AuditEntityType =
  | "USER" | "BET" | "MARKET" | "TREASURY" | "SETTINGS" | "BOT";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress: string;
  archived: boolean;
}

export interface AuditSearchParams {
  from?: string;
  to?: string;
  user?: string;
  action?: AuditAction | "";
  entityType?: AuditEntityType | "";
  entityId?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AuditSearchResult {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export async function searchAuditLogs(
  params: AuditSearchParams
): Promise<AuditSearchResult> {
  return apiRequest<AuditSearchResult>("/api/admin/audit/search", {
    method: "GET",
    query: {
      from: params.from,
      to: params.to,
      user: params.user,
      action: params.action || undefined,
      entityType: params.entityType || undefined,
      entityId: params.entityId,
      includeArchived: params.includeArchived,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  });
}

export function exportAuditLogs(
  logs: AuditLog[],
  format: "csv" | "json"
): void {
  if (format === "json") {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, "audit-logs.json");
    return;
  }

  const header = "id,timestamp,user,action,entityType,entityId,ipAddress,archived\n";
  const rows = logs
    .map((l) =>
      [l.id, l.timestamp, l.user, l.action, l.entityType, l.entityId, l.ipAddress, l.archived].join(",")
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  downloadBlob(blob, "audit-logs.csv");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
