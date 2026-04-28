"use client"

import React from "react"
import { Shield, Wallet, ArrowUpRight, Lock, Unlock, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { KycLevel, KycStatus } from "@/lib/api/verification"
import { WITHDRAWAL_LIMITS } from "@/lib/api/verification"

// ── Types ──────────────────────────────────────────────────────────────────────

interface VerificationStatusProps {
  status: KycStatus | null
  isLoading?: boolean
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function levelLabel(level: KycLevel): string {
  switch (level) {
    case 0:
      return "Unverified"
    case 1:
      return "Basic"
    case 2:
      return "Verified"
    case 3:
      return "Enhanced"
  }
}

function levelColor(level: KycLevel): string {
  switch (level) {
    case 0:
      return "text-destructive"
    case 1:
      return "text-amber-500"
    case 2:
      return "text-emerald-500"
    case 3:
      return "text-primary"
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export function VerificationStatus({ status, isLoading = false }: VerificationStatusProps) {
  if (isLoading || !status) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="size-4 text-primary" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    )
  }

  const current = status.currentLevel
  const next = Math.min(current + 1, 3) as KycLevel
  const progress = (current / 3) * 100
  const limits = WITHDRAWAL_LIMITS[current]

  return (
    <div className="flex flex-col gap-4">
      {/* Main Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="size-4 text-primary" />
            Verification Status
            <Badge variant={current >= 2 ? "default" : "secondary"} className="text-xs">
              Level {current}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Level */}
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-2xl font-bold", levelColor(current))}>
                {levelLabel(current)}
              </p>
              <p className="text-sm text-muted-foreground">
                {current < 3
                  ? `Complete Level ${next} to unlock higher limits`
                  : "Maximum verification level reached"}
              </p>
            </div>
            {current >= 2 ? (
              <Unlock className="size-8 text-emerald-500" />
            ) : (
              <Lock className="size-8 text-destructive" />
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Level dots */}
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3].map((lvl) => (
              <div key={lvl} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                    current >= lvl
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {lvl}
                </div>
                <span className="text-[10px] text-muted-foreground">{levelLabel(lvl as KycLevel)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Limits Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="size-4 text-primary" />
            Withdrawal Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <LimitCard
              label="Per Transaction"
              value={limits.perTxn}
              active={limits.perTxn > 0}
            />
            <LimitCard
              label="Daily"
              value={limits.daily}
              active={limits.daily > 0}
            />
            <LimitCard
              label="Monthly"
              value={limits.monthly}
              active={limits.monthly > 0}
            />
          </div>

          {current < 3 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
              <TrendingUp className="size-4 shrink-0" />
              Upgrade to Level {next} to increase your limits to{" "}
              <strong>{WITHDRAWAL_LIMITS[next].daily.toLocaleString()}</strong> daily /{" "}
              <strong>{WITHDRAWAL_LIMITS[next].monthly.toLocaleString()}</strong> monthly.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LimitCard({
  label,
  value,
  active,
}: {
  label: string
  value: number
  active: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-3",
        active ? "border-emerald-500/30 bg-emerald-500/5" : "opacity-60"
      )}
    >
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowUpRight className="size-3" />
        {label}
      </div>
      <span className={cn("text-xl font-bold tabular-nums", active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
        {value > 0 ? `$${value.toLocaleString()}` : "Locked"}
      </span>
    </div>
  )
}
