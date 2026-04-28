"use client";

import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AuditSearchParams, AuditAction, AuditEntityType } from "@/lib/api/audit";

const ACTIONS: AuditAction[] = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "EXPORT", "IMPORT"];
const ENTITY_TYPES: AuditEntityType[] = ["USER", "BET", "MARKET", "TREASURY", "SETTINGS", "BOT"];

interface SearchPanelProps {
  onSearch: (params: AuditSearchParams) => void;
  loading?: boolean;
}

export function SearchPanel({ onSearch, loading }: SearchPanelProps) {
  const [params, setParams] = useState<AuditSearchParams>({});

  const set = (key: keyof AuditSearchParams, value: string | boolean | undefined) =>
    setParams((p) => ({ ...p, [key]: value }));

  const handleReset = () => {
    setParams({});
    onSearch({});
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Filter Logs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">From</Label>
          <Input type="datetime-local" value={params.from ?? ""} onChange={(e) => set("from", e.target.value)} className="bg-transparent border-white/10 text-white text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">To</Label>
          <Input type="datetime-local" value={params.to ?? ""} onChange={(e) => set("to", e.target.value)} className="bg-transparent border-white/10 text-white text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">User</Label>
          <Input placeholder="Address or username" value={params.user ?? ""} onChange={(e) => set("user", e.target.value)} className="bg-transparent border-white/10 text-white text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Action</Label>
          <Select value={params.action ?? ""} onValueChange={(v) => set("action", v as AuditAction)}>
            <SelectTrigger className="bg-transparent border-white/10 text-white text-xs"><SelectValue placeholder="All actions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {ACTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Entity Type</Label>
          <Select value={params.entityType ?? ""} onValueChange={(v) => set("entityType", v as AuditEntityType)}>
            <SelectTrigger className="bg-transparent border-white/10 text-white text-xs"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {ENTITY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Entity ID</Label>
          <Input placeholder="e.g. mkt-001" value={params.entityId ?? ""} onChange={(e) => set("entityId", e.target.value)} className="bg-transparent border-white/10 text-white text-xs" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
          <input type="checkbox" checked={params.includeArchived ?? false} onChange={(e) => set("includeArchived", e.target.checked)} className="rounded" />
          Include archived
        </label>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={loading} className="border-white/10 text-gray-400">
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={() => onSearch(params)} disabled={loading}>
            <Search className="h-3.5 w-3.5 mr-1" /> Search
          </Button>
        </div>
      </div>
    </div>
  );
}
