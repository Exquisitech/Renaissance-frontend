"use client"

import React, { useCallback, useState } from "react"
import { Copy, Check, RefreshCw, Share2, Twitter, Send, Mail, Loader2 } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ReferralCode } from "@/lib/api/referral"
import {
  generateReferralCode,
  revokeReferralCode,
  getReferralShareUrl,
  buildTwitterShareUrl,
  buildTelegramShareUrl,
  buildEmailShareUrl,
} from "@/lib/api/referral"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReferralCodeDisplayProps {
  userId: string
  initialCode: ReferralCode | null
  authToken?: string
  onCodeChange?: (code: ReferralCode | null) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ReferralCodeDisplay({
  userId,
  initialCode,
  authToken,
  onCodeChange,
}: ReferralCodeDisplayProps) {
  const [code, setCode] = useState<ReferralCode | null>(initialCode)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [customCode, setCustomCode] = useState("")

  const shareUrl = code ? getReferralShareUrl(code.code) : ""

  const handleCopy = useCallback(async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code.code)
      setCopied(true)
      sonnerToast.success("Referral code copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      sonnerToast.error("Failed to copy code")
    }
  }, [code])

  const handleCopyUrl = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      sonnerToast.success("Referral link copied to clipboard")
    } catch {
      sonnerToast.error("Failed to copy link")
    }
  }, [shareUrl])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const newCode = await generateReferralCode({
        userId,
        customCode: customCode.trim() || undefined,
        authToken,
      })
      setCode(newCode)
      setCustomCode("")
      onCodeChange?.(newCode)
      sonnerToast.success("Referral code generated!")
    } catch (error) {
      showApiErrorToast(error, "Failed to generate code")
    } finally {
      setIsGenerating(false)
    }
  }, [userId, customCode, authToken, onCodeChange])

  const handleRevoke = useCallback(async () => {
    if (!code) return
    setIsRevoking(true)
    try {
      await revokeReferralCode(userId, authToken)
      setCode(null)
      onCodeChange?.(null)
      sonnerToast.success("Referral code revoked")
    } catch (error) {
      showApiErrorToast(error, "Failed to revoke code")
    } finally {
      setIsRevoking(false)
    }
  }, [code, userId, authToken, onCodeChange])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="size-4 text-primary" />
          Your Referral Code
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {code ? (
          <>
            {/* Code Display */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  value={code.code}
                  readOnly
                  className="pr-24 font-mono text-lg tracking-wider"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Usage info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {code.currentUsage} / {code.usageLimit ?? "∞"} uses
              </Badge>
              {code.expiresAt && (
                <span>Expires {new Date(code.expiresAt).toLocaleDateString()}</span>
              )}
              {!code.isActive && <Badge variant="destructive">Inactive</Badge>}
            </div>

            {/* Share buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(buildTwitterShareUrl(code.code), "_blank")}
              >
                <Twitter className="size-3.5" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(buildTelegramShareUrl(code.code), "_blank")}
              >
                <Send className="size-3.5" />
                Telegram
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(buildEmailShareUrl(code.code), "_blank")}
              >
                <Mail className="size-3.5" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyUrl}>
                <Copy className="size-3.5" />
                Copy Link
              </Button>
            </div>

            {/* Revoke */}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleRevoke}
              disabled={isRevoking}
            >
              {isRevoking ? <Loader2 className="mr-1 size-3 animate-spin" /> : <RefreshCw className="mr-1 size-3" />}
              Revoke & Generate New
            </Button>
          </>
        ) : (
          <>
            {/* Generate new code */}
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have a referral code yet. Generate one to start earning bonuses.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Custom code (optional)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="flex-1"
                  maxLength={20}
                />
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="mr-1 size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 size-4" />
                  )}
                  Generate
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
