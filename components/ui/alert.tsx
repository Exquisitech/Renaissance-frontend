import * as React from "react";
import { cn } from "@/lib/utils";

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "destructive";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border p-4 text-sm",
        variant === "destructive"
          ? "border-destructive/40 bg-destructive/10"
          : "border-border bg-card",
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return <h5 className={cn("font-semibold", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-1 text-muted-foreground", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };