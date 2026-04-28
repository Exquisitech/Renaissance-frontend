"use client"

import React from "react"
import { Users, UserCheck, Trophy, TrendingUp, MousePointerClick, UserPlus, Zap, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReferralStats } from "@/lib/api/referral"

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReferralStatsProps {
  stats: ReferralStats | null
  isLoading?: boolean
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-3",
        highlight && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
    </div>
  )
}

function FunnelStep({
  label,
  value,
  max,
  icon: Icon,
  colorClass,
}: {
  label: string
  value: number
  max: number
  icon: React.ElementType
  colorClass: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", colorClass)}>
        <Icon className="size-4 text-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="tabular-nums text-muted-foreground">
            {value.toLocaleString()} ({pct}%)
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", colorClass.replace("bg-", "bg-"))}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ReferralStats({ stats, isLoading = false }: ReferralStatsProps) {
  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" />
            Referral Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxFunnel = Math.max(stats.funnel.clicks, 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Cards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" />
            Referral Stats
            <Badge variant="outline" className="text-xs">
              {stats.conversionRate.toFixed(1)}% conversion
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total" value={stats.totalReferrals} icon={Users} />
            <StatCard label="Pending" value={stats.pendingReferrals} icon={UserPlus} />
            <StatCard label="Active" value={stats.activeReferrals} icon={UserCheck} />
            <StatCard label="Converted" value={stats.convertedReferrals} icon={Zap} />
            <StatCard label="Bonuses" value={stats.totalBonusesEarned.toFixed(2)} icon={Trophy} highlight />
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRight className="size-4 text-primary" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <FunnelStep
              label="Link Clicks"
              value={stats.funnel.clicks}
              max={maxFunnel}
              icon={MousePointerClick}
              colorClass="bg-blue-500"
            />
            <FunnelStep
              label="Signups"
              value={stats.funnel.signups}
              max={maxFunnel}
              icon={UserPlus}
              colorClass="bg-emerald-500"
            />
            <FunnelStep
              label="Activations"
              value={stats.funnel.activations}
              max={maxFunnel}
              icon={Zap}
              colorClass="bg-amber-500"
            />
            <FunnelStep
              label="Conversions"
              value={stats.funnel.conversions}
              max={maxFunnel}
              icon={Trophy}
              colorClass="bg-purple-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
