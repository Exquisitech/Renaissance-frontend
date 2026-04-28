"use client";

import { useEffect, useState } from "react";
import { Eye, Lock, MessageSquare, Users, History, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { fetchPrivacySettings, updatePrivacySettings, type PrivacySettings } from "@/lib/api/settings";

const DEFAULT: PrivacySettings = {
  profileVisibility: "public",
  showBettingHistory: true,
  showHoldings: false,
  activityFeedVisibility: "everyone",
  allowMessages: "followers",
  allowFollows: "everyone",
};

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ icon, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-gray-400">{icon}</div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${checked ? "bg-blue-600" : "bg-white/20"}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function SelectRow({ label, description, value, options, onChange }: {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40 bg-transparent border-white/10 text-white text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

export function PrivacySettingsPanel() {
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPrivacySettings().then(setSettings).catch(() => {});
  }, []);

  const set = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrivacySettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-1">
      <h2 className="text-base font-semibold text-white mb-4">Privacy Settings</h2>

      <SelectRow
        label="Profile Visibility"
        description="Control who can view your profile."
        value={settings.profileVisibility}
        options={[{ value: "public", label: "Public" }, { value: "private", label: "Private" }]}
        onChange={(v) => set("profileVisibility", v as PrivacySettings["profileVisibility"])}
      />
      <Separator className="bg-white/5" />

      <ToggleRow
        icon={<History className="h-4 w-4" />}
        label="Show Betting History"
        description="Let others see your past predictions and bets."
        checked={settings.showBettingHistory}
        onChange={(v) => set("showBettingHistory", v)}
      />
      <Separator className="bg-white/5" />

      <ToggleRow
        icon={<TrendingUp className="h-4 w-4" />}
        label="Show Holdings"
        description="Display your token holdings on your profile."
        checked={settings.showHoldings}
        onChange={(v) => set("showHoldings", v)}
      />
      <Separator className="bg-white/5" />

      <SelectRow
        label="Activity Feed"
        description="Who can see your activity in their feed."
        value={settings.activityFeedVisibility}
        options={[{ value: "everyone", label: "Everyone" }, { value: "followers", label: "Followers" }, { value: "nobody", label: "Nobody" }]}
        onChange={(v) => set("activityFeedVisibility", v as PrivacySettings["activityFeedVisibility"])}
      />
      <Separator className="bg-white/5" />

      <SelectRow
        label="Messages"
        description="Who can send you direct messages."
        value={settings.allowMessages}
        options={[{ value: "everyone", label: "Everyone" }, { value: "followers", label: "Followers" }, { value: "nobody", label: "Nobody" }]}
        onChange={(v) => set("allowMessages", v as PrivacySettings["allowMessages"])}
      />
      <Separator className="bg-white/5" />

      <SelectRow
        label="Follow Requests"
        description="Who can follow your profile."
        value={settings.allowFollows}
        options={[{ value: "everyone", label: "Everyone" }, { value: "nobody", label: "Nobody (Private)" }]}
        onChange={(v) => set("allowFollows", v as PrivacySettings["allowFollows"])}
      />

      <div className="pt-4 flex items-center justify-between">
        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-400 flex items-center gap-2">
          {settings.profileVisibility === "public" ? <Eye className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          Profile preview: <span className="text-white font-medium capitalize">{settings.profileVisibility}</span>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saved ? "Saved ✓" : saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
