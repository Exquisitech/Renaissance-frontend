import { ShieldCheck, Star, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserTier } from "@/lib/betting-limits";

const tierConfig: Record<
  UserTier,
  { icon: typeof ShieldCheck; className: string; description: string }
> = {
  Bronze: {
    icon: ShieldCheck,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    description: "Starter limits and standard reviews",
  },
  Silver: {
    icon: Star,
    className:
      "border-slate-400/30 bg-slate-500/10 text-slate-700 dark:text-slate-200",
    description: "Higher daily coverage and priority support",
  },
  Gold: {
    icon: Trophy,
    className:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    description: "Highest limits and premium handling",
  },
};

interface UserTierBadgeProps {
  tier: UserTier;
  className?: string;
  showDescription?: boolean;
}

export function UserTierBadge({
  tier,
  className,
  showDescription = false,
}: UserTierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn("gap-1.5 rounded-full px-3 py-1 text-xs", config.className)}
      >
        <Icon className="h-3.5 w-3.5" />
        {tier} Tier
      </Badge>
      {showDescription ? (
        <span className="text-sm text-muted-foreground">{config.description}</span>
      ) : null}
    </div>
  );
}
