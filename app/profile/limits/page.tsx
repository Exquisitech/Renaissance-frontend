"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, ShieldAlert, TrendingUp } from "lucide-react";

import { Header } from "@/app/header";
import { UserTierBadge } from "@/components/profile/UserTierBadge";
import { BetLimitWarning } from "@/components/bets/BetLimitWarning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  bettingLimitsProfile,
  formatLimitValue,
  getLimitRatio,
  getRemainingLimit,
} from "@/lib/betting-limits";

export default function ProfileLimitsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Button asChild variant="ghost" size="sm" className="w-fit px-0">
              <Link href="/userprofile">
                <ArrowLeft className="h-4 w-4" />
                Back to profile
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Betting Limits & Tier
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your current thresholds, remaining capacity, and reset window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <UserTierBadge tier={bettingLimitsProfile.tier} />
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <Clock3 className="h-3.5 w-3.5" />
              Resets in {bettingLimitsProfile.dailyResetIn}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Overview</CardTitle>
              <CardDescription>
                Your current Silver tier gives you more room for volume, losses,
                and active positions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bettingLimitsProfile.limits.map((limit) => {
                const ratio = getLimitRatio(limit.used, limit.max);
                const remaining = getRemainingLimit(limit.used, limit.max);

                return (
                  <div
                    key={limit.label}
                    className="rounded-xl border bg-muted/30 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{limit.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatLimitValue(limit.used, limit.unit)} used of{" "}
                          {formatLimitValue(limit.max, limit.unit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {formatLimitValue(remaining, limit.unit)}
                        </p>
                        <p className="text-xs text-muted-foreground">remaining</p>
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tier Progress</CardTitle>
              <CardDescription>
                Higher tiers unlock larger staking allowances and fewer manual
                checks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Progress to Gold</p>
                    <p className="text-sm text-muted-foreground">
                      {bettingLimitsProfile.tierSubtitle}
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${bettingLimitsProfile.tierProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {bettingLimitsProfile.tierProgress}% complete
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">Responsible gaming</p>
                    <p className="text-sm text-muted-foreground">
                      Warnings appear automatically when you are close to your
                      daily limit or if a new bet would exceed it.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {bettingLimitsProfile.limits.map((limit) => (
            <BetLimitWarning key={limit.label} limit={limit} />
          ))}
        </div>
      </main>
    </div>
  );
}
