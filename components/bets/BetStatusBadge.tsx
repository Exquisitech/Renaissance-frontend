import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BetStatus } from "@/lib/api/bets";

const styles: Record<BetStatus, string> = {
  active:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  pending:
    "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  won: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  lost: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  cancelled:
    "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
};

const labels: Record<BetStatus, string> = {
  active: "Active",
  pending: "Pending",
  won: "Won",
  lost: "Lost",
  cancelled: "Cancelled",
};

export function BetStatusBadge({ status }: { status: BetStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
