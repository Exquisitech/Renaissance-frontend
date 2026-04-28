"use client"

import { toast as sonnerToast } from "sonner"
import { ErrorToast } from "@/components/common/ErrorToast"
import { normalizeApiError } from "@/lib/api/client"

type ToastInput = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  correlationId?: string
}

function showErrorToast(input: {
  title: string
  description?: string
  correlationId?: string
}) {
  sonnerToast.custom((toastId) => (
    <ErrorToast
      title={input.title}
      message={input.description ?? input.title}
      correlationId={input.correlationId}
      onDismiss={() => sonnerToast.dismiss(toastId)}
    />
  ))
}

export function showApiErrorToast(error: unknown, fallbackTitle = "Request failed") {
  const normalized = normalizeApiError(error, fallbackTitle)

  showErrorToast({
    title: fallbackTitle,
    description: normalized.message,
    correlationId: normalized.correlationId,
  })
}

export function useToast() {
  return {
    toast: ({ title, description, variant, correlationId }: ToastInput) => {
      const message = description ? `${title}: ${description}` : title

      if (variant === "destructive") {
        showErrorToast({ title, description, correlationId })
        return
      }

      sonnerToast.success(message)
    },
  }
}