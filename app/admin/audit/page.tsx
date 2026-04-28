"use client";

import { useState, useCallback } from "react";
import { Download, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchPanel } from "@/components/audit/SearchPanel";
import { LogTable } from "@/components/audit/LogTable";
import { searchAuditLogs, exportAuditLogs, type AuditLog, type AuditSearchParams } from "@/lib/api/audit";

// Placeholder data for development
const PLACEHOLDER_LOGS: AuditLog[] = [
  { id: "1", timestamp: new Date(Date.now() - 3_600_000).toISOString(), user: "0xAdmin1", action: "UPDATE", entityType: "MARKET", entityId: "mkt-001", before: { status: "open" }, after: { status: "closed" }, ipAddress: "192.168.1.1", archived: false },
  { id: "2", timestamp: new Date(Date.now() - 7_200_000).toISOString(), user: "0xAdmin2", action: "DELETE", entityType: "USER", entityId: "usr-042", before: { role: "user" }, after: {}, ipAddress: "10.0.0.5", archived: false },
  { id: "3", timestamp: new Date(Date.now() - 86_400_000).toISOString(), user: "0xAdmin1", action: "EXPORT", entityType: "TREASURY", entityId: "treasury-1", ipAddress: "192.168.1.1", archived: true },
];

export default function AuditSearchPage() {
  const [logs, setLogs] = useState<AuditLog[]>(PLACEHOLDER_LOGS);
  const [total, setTotal] = useState(PLACEHOLDER_LOGS.length);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastParams, setLastParams] = useState<AuditSearchParams>({});

  const handleSearch = useCallback(async (params: AuditSearchParams) => {
    setLoading(true);
    setLastParams(params);
    setPage(1);
    try {
      const result = await searchAuditLogs({ ...params, page: 1, pageSize: 20 });
      setLogs(result.logs);
      setTotal(result.total);
    } catch {
      // Fallback to placeholder data in development
      setLogs(PLACEHOLDER_LOGS);
      setTotal(PLACEHOLDER_LOGS.length);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback(async (newPage: number) => {
    setLoading(true);
    setPage(newPage);
    try {
      const result = await searchAuditLogs({ ...lastParams, page: newPage, pageSize: 20 });
      setLogs(result.logs);
    } catch {
      setLogs(PLACEHOLDER_LOGS);
    } finally {
      setLoading(false);
    }
  }, [lastParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log Search</h1>
          <p className="text-sm text-gray-400">Search and export system audit trails.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportAuditLogs(logs, "csv")} className="border-white/10 text-gray-300 gap-1.5">
            <FileText className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportAuditLogs(logs, "json")} className="border-white/10 text-gray-300 gap-1.5">
            <FileJson className="h-3.5 w-3.5" /> JSON
          </Button>
          <Download className="h-4 w-4 text-gray-500 self-center" />
        </div>
      </div>

      <SearchPanel onSearch={handleSearch} loading={loading} />

      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">Searching...</div>
      ) : (
        <LogTable logs={logs} total={total} page={page} pageSize={20} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
