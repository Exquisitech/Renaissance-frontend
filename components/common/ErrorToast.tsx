"use client"

import { useState } from "react"
import { AlertCircle, Bug, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { buildErrorReport, type NormalizedApiError } from "@/lib/api/client"

interface ErrorToastProps extends NormalizedApiError {
  title?: string
  onDismiss?: () => void
}

export function ErrorToast({
  title = "Request failed",
  message,
  correlationId,
  status,
  onDismiss,
}: ErrorToastProps) {
  const [copied, setCopied] = useState(false)

  const handleReport = async () => {
    const payload = buildErrorReport({ message, correlationId, status })

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <Card className="w-[380px] border-destructive/40 bg-background shadow-lg">
      <CardContent className="space-y-3 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-destructive/10 p-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {correlationId ? `[ID: ${correlationId}]` : "[ID: unavailable]"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleReport}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Bug className="h-3.5 w-3.5" />}
            Report Error
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReport}>
            <Copy className="h-3.5 w-3.5" />
            Copy ID
          </Button>
          {onDismiss ? (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}