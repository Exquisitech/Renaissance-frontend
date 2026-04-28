"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { WithdrawalLimits, WithdrawalNotificationPreferences } from "@/lib/api/withdrawal";

interface WithdrawalRequestFormProps {
  limits: WithdrawalLimits | null;
  submitting?: boolean;
  onSubmit: (input: {
    amount: number;
    walletAddress: string;
    note?: string;
    notificationPreferences: WithdrawalNotificationPreferences;
  }) => Promise<void> | void;
}

function Toggle({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors",
        checked ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function WithdrawalRequestForm({
  limits,
  submitting = false,
  onSubmit,
}: WithdrawalRequestFormProps) {
  const [amount, setAmount] = useState(50);
  const [walletAddress, setWalletAddress] = useState("GABCD...12345");
  const [note, setNote] = useState("");
  const [preferences, setPreferences] = useState<WithdrawalNotificationPreferences>({
    email: true,
    sms: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
        <CardDescription>
          Submit an XLM withdrawal, track its review status, and control how updates
          reach you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Daily remaining", value: limits?.dailyRemaining ?? 0 },
            { label: "Weekly remaining", value: limits?.weeklyRemaining ?? 0 },
            { label: "Monthly remaining", value: limits?.monthlyRemaining ?? 0 },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-xl font-semibold">{item.value.toFixed(2)} XLM</p>
            </div>
          ))}
        </div>

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit({
              amount,
              walletAddress,
              note,
              notificationPreferences: preferences,
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="withdrawal-amount">Amount</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              min="10"
              step="10"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-wallet">Wallet address</Label>
            <Input
              id="withdrawal-wallet"
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-note">Note</Label>
            <textarea
              id="withdrawal-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="Reason for withdrawal or internal reference"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Update notifications</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                checked={preferences.email}
                onChange={(email) => setPreferences((prev) => ({ ...prev, email }))}
                label="Email updates"
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
              <Toggle
                checked={preferences.sms}
                onChange={(sms) => setPreferences((prev) => ({ ...prev, sms }))}
                label="SMS updates"
                icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground">
            Withdrawals above 300 XLM require admin approval before processing.
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit withdrawal request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
