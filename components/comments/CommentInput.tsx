"use client"

import React, { useCallback, useState, useRef } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────────────────────────────────────

const RATE_LIMIT_MS = 5000
const MIN_LENGTH = 1
const MAX_LENGTH = 500

// ── Types ──────────────────────────────────────────────────────────────────────

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CommentInput({
  onSubmit,
  disabled = false,
  placeholder = "Join the conversation...",
}: CommentInputProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const remainingCooldown = Math.max(0, RATE_LIMIT_MS - (Date.now() - lastSubmitTime))
  const isRateLimited = remainingCooldown > 0

  const validate = useCallback((text: string): string | null => {
    const trimmed = text.trim()
    if (trimmed.length < MIN_LENGTH) return "Comment cannot be empty"
    if (trimmed.length > MAX_LENGTH) return `Comment must be under ${MAX_LENGTH} characters`
    return null
  }, [])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      if (isSubmitting || disabled || isRateLimited) return

      const validationError = validate(content)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setIsSubmitting(true)

      try {
        await onSubmit(content.trim())
        setContent("")
        setLastSubmitTime(Date.now())
        inputRef.current?.focus()
      } catch {
        // Error toast handled by caller
      } finally {
        setIsSubmitting(false)
      }
    },
    [content, isSubmitting, disabled, isRateLimited, validate, onSubmit]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const charCount = content.length
  const isOverLimit = charCount > MAX_LENGTH

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            aria-label="Comment input"
            className={cn(
              "pr-16 transition-colors",
              isOverLimit && "border-destructive focus-visible:ring-destructive/40"
            )}
          />
          <span
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums",
              isOverLimit ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {charCount}/{MAX_LENGTH}
          </span>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={disabled || isSubmitting || isRateLimited || !content.trim() || isOverLimit}
          aria-label="Send comment"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>

      {isRateLimited && (
        <p className="text-xs text-muted-foreground">
          Please wait {Math.ceil(remainingCooldown / 1000)}s before commenting again
        </p>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
