"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "@/lib/api/audit";

interface LogTableProps {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-500/20 text-emerald-400",
  UPDATE: "bg-blue-500/20 text-blue-400",
  DELETE: "bg-red-500/20 text-red-400",
  LOGIN: "bg-gray-500/20 text-gray-400",
  LOGOUT: "bg-gray-500/20 text-gray-400",
  EXPORT: "bg-yellow-500/20 text-yellow-400",
  IMPORT: "bg-purple-500/20 text-purple-400",
};

function DiffViewer({ before, after }: { before?: Record<string, unknown>; after?: Record<string, unknown> }) {
  if (!before && !after) return <p className="text-xs text-gray-500">No diff available.</p>;
  const keys = Array.from(new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]));
  return (
    <div className="overflow-x-auto text-xs font-mono space-y-1">
      {keys.map((k) => {
        const bv = JSON.stringify(before?.[k] ?? "—");
        const av = JSON.stringify(after?.[k] ?? "—");
        const changed = bv !== av;
        return (
          <div key={k} className={`flex gap-3 ${changed ? "bg-yellow-500/5 rounded px-1" : ""}`}>
            <span className="text-gray-500 w-32 shrink-0">{k}</span>
            <span className="text-red-400 line-through">{bv}</span>
            <span className="text-gray-500">→</span>
            <span className="text-emerald-400">{av}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LogTable({ logs, total, page, pageSize, onPageChange }: LogTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  if (logs.length === 0) {
    return <div className="py-16 text-center text-gray-500 text-sm">No audit logs match your search.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-xs text-left">
          <thead className="bg-white/5 text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2 w-8" />
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Entity</th>
              <th className="px-3 py-2">IP</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <>
                <tr
                  key={log.id}
                  className="hover:bg-white/5 cursor-pointer"
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                >
                  <td className="px-3 py-2 text-gray-500">
                    {expanded === log.id ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </td>
                  <td className="px-3 py-2 text-gray-300 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 font-mono text-gray-300">{log.user}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[0.65rem] font-semibold ${ACTION_COLORS[log.action] ?? ""}`}>{log.action}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-400">{log.entityType} / {log.entityId}</td>
                  <td className="px-3 py-2 text-gray-500 font-mono">{log.ipAddress}</td>
                  <td className="px-3 py-2">
                    {log.archived && (
                      <Badge variant="secondary" className="text-[0.6rem] gap-1">
                        <Archive className="h-2.5 w-2.5" /> Archived
                      </Badge>
                    )}
                  </td>
                </tr>
                {expanded === log.id && (
                  <tr key={`${log.id}-diff`} className="bg-black/30">
                    <td colSpan={7} className="px-5 py-4">
                      <p className="text-xs text-gray-400 mb-2 font-semibold">Change Diff</p>
                      <DiffViewer before={log.before} after={log.after} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{total} result{total !== 1 ? "s" : ""}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="border-white/10 h-7 px-2">Prev</Button>
            <span className="self-center">Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="border-white/10 h-7 px-2">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
