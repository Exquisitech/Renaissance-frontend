"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, Check, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buildErrorReport, type NormalizedApiError } from "@/lib/api/client"

interface ErrorPageProps extends NormalizedApiError {
  title?: string
  homeHref?: string
}

export function ErrorPage({
  title = "Something went wrong",
  message,
  correlationId,
  status,
  homeHref = "/dashboard",
}: ErrorPageProps) {
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
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <Card className="w-full max-w-2xl border-destructive/20 bg-card/95 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base">
              {message}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm">
            <p className="font-medium">Correlation ID</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {correlationId ?? "Unavailable"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={handleReport}>
              {copied ? <Check className="h-4 w-4" /> : <LifeBuoy className="h-4 w-4" />}
              Report Error
            </Button>
            <Button asChild>
              <Link href={homeHref}>
                <ArrowLeft className="h-4 w-4" />
                Back to safety
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}