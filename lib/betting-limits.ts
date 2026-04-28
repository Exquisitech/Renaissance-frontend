export type UserTier = "Bronze" | "Silver" | "Gold";

export interface LimitStat {
  label: string;
  used: number;
  max: number;
  unit: "XLM" | "bets";
}

export interface BettingLimitsProfile {
  tier: UserTier;
  tierProgress: number;
  tierSubtitle: string;
  dailyResetIn: string;
  limits: LimitStat[];
}

export const bettingLimitsProfile: BettingLimitsProfile = {
  tier: "Silver",
  tierProgress: 72,
  tierSubtitle: "Consistent play unlocks higher staking thresholds and faster reviews.",
  dailyResetIn: "6h 42m",
  limits: [
    {
      label: "Daily max bet volume",
      used: 320,
      max: 500,
      unit: "XLM",
    },
    {
      label: "Daily max loss",
      used: 110,
      max: 200,
      unit: "XLM",
    },
    {
      label: "Active bets",
      used: 7,
      max: 10,
      unit: "bets",
    },
  ],
};

export function getLimitRatio(used: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(used / max, 1);
}

export function getRemainingLimit(used: number, max: number) {
  return Math.max(max - used, 0);
}

export function formatLimitValue(value: number, unit: "XLM" | "bets") {
  if (unit === "bets") {
    return `${value}`;
  }

  return `${value.toFixed(2)} XLM`;
}
