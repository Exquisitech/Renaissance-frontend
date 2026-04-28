import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DisputeStatus } from "@/lib/api/disputes";

const styles: Record<DisputeStatus, string> = {
  open: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  investigating:
    "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  resolved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", styles[status])}>
      {status}
    </Badge>
  );
}
