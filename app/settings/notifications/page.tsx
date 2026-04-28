"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { showApiErrorToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
  sendTestNotification,
  type NotificationPreference,
  type NotificationChannel,
} from "@/lib/api/notifications";

const CHANNEL_META: Record<
  NotificationChannel,
  { label: string; icon: React.ReactNode }
> = {
  in_app: { label: "In-app", icon: <Bell className="h-3.5 w-3.5" /> },
  email: { label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  sms: { label: "SMS", icon: <Smartphone className="h-3.5 w-3.5" /> },
};

const CHANNELS: NotificationChannel[] = ["in_app", "email", "sms"];

// ── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const USER_ID = "default-user";

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingType, setTestingType] = useState<string | null>(null);

  const loadPrefs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotificationPreferences(USER_ID);
      setPrefs(data);
    } catch (error) {
      showApiErrorToast(error, "Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPrefs(); }, [loadPrefs]);

  const toggleChannel = (
    typeIndex: number,
    channel: NotificationChannel,
    value: boolean
  ) => {
    setPrefs((prev) =>
      prev.map((p, i) =>
        i === typeIndex
          ? { ...p, channels: { ...p.channels, [channel]: value } }
          : p
      )
    );
  };

  const savePrefs = async () => {
    setSaving(true);
    try {
      await updateNotificationPreferences(USER_ID, prefs);
      toast.success("Notification preferences saved.");
    } catch (error) {
      showApiErrorToast(error, "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (type: NotificationPreference["type"]) => {
    setTestingType(type);
    try {
      await sendTestNotification(USER_ID, type);
      toast.success("Test notification sent!");
    } catch (error) {
      showApiErrorToast(error, "Failed to send test notification");
    } finally {
      setTestingType(null);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Notification Preferences</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which events notify you and via which channels.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl border bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {prefs.map((pref, typeIndex) => (
            <div
              key={pref.type}
              data-testid={`pref-row-${pref.type}`}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                {/* Test notification button */}
                <button
                  onClick={() => handleTest(pref.type)}
                  disabled={testingType === pref.type}
                  aria-label={`Send test ${pref.label} notification`}
                  className="shrink-0 rounded-md border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  {testingType === pref.type ? "Sending…" : "Test"}
                </button>
              </div>

              {/* Channel toggles */}
              <div className="mt-4 flex flex-wrap gap-6">
                {CHANNELS.map((ch) => (
                  <label
                    key={ch}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    {CHANNEL_META[ch].icon}
                    <span>{CHANNEL_META[ch].label}</span>
                    <Toggle
                      checked={pref.channels[ch]}
                      onChange={(v) => toggleChannel(typeIndex, ch, v)}
                      label={`${pref.label} via ${CHANNEL_META[ch].label}`}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={savePrefs}
            disabled={saving}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save preferences"}
          </button>
        </div>
      )}
    </main>
  );
}
