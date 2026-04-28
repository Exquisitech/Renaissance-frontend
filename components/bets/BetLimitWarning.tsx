import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatLimitValue,
  getLimitRatio,
  getRemainingLimit,
  type LimitStat,
} from "@/lib/betting-limits";

interface BetLimitWarningProps {
  limit: LimitStat;
  nextStake?: number;
  className?: string;
}

export function BetLimitWarning({
  limit,
  nextStake = 0,
  className,
}: BetLimitWarningProps) {
  const ratio = getLimitRatio(limit.used, limit.max);
  const remaining = getRemainingLimit(limit.used, limit.max);
  const wouldExceed = limit.unit === "XLM" && nextStake > remaining;
  const isNear = ratio >= 0.8 || wouldExceed;

  const Icon = isNear ? AlertTriangle : CheckCircle2;

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isNear
          ? "border-amber-500/30 bg-amber-500/10"
          : "border-emerald-500/30 bg-emerald-500/10",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            isNear ? "text-amber-600" : "text-emerald-600",
          )}
        />
        <div className="min-w-0 space-y-2">
          <div>
            <p className="text-sm font-medium text-foreground">{limit.label}</p>
            <p className="text-xs text-muted-foreground">
              Used {formatLimitValue(limit.used, limit.unit)} of{" "}
              {formatLimitValue(limit.max, limit.unit)}. Remaining{" "}
              {formatLimitValue(remaining, limit.unit)}.
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-background/80">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isNear ? "bg-amber-500" : "bg-emerald-500",
              )}
              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {wouldExceed
              ? "This stake would push you past your daily betting threshold."
              : isNear
                ? "You are approaching your limit for today."
                : "You still have room before hitting this limit."}
          </p>
        </div>
      </div>
    </div>
  );
}
