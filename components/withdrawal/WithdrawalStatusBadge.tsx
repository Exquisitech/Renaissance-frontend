import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WithdrawalStatus } from "@/lib/api/withdrawal";

const statusStyles: Record<WithdrawalStatus, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  approved: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  rejected: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  processed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function WithdrawalStatusBadge({ status }: { status: WithdrawalStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", statusStyles[status])}>
      {status}
    </Badge>
  );
}
