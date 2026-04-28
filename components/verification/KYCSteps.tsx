"use client"

import React, { useState } from "react"
import { Check, ChevronRight, Loader2, Shield, Mail, CreditCard, Home, Award } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KycLevel, KycStatus, VerificationStatus } from "@/lib/api/verification"
import { submitForReview } from "@/lib/api/verification"
import { showApiErrorToast } from "@/hooks/use-toast"
import { DocumentUploader } from "./DocumentUploader"
import type { KycDocument } from "@/lib/api/verification"

// ── Types ──────────────────────────────────────────────────────────────────────

interface KYCStepsProps {
  userId: string
  status: KycStatus | null
  documents: KycDocument[]
  authToken?: string
  onStatusChange?: (status: KycStatus) => void
  onDocumentsChange?: (docs: KycDocument[]) => void
}

interface StepDef {
  level: KycLevel
  title: string
  description: string
  icon: React.ElementType
  requirements: string[]
}

// ── Step Definitions ───────────────────────────────────────────────────────────

const STEPS: StepDef[] = [
  {
    level: 1,
    title: "Basic Verification",
    description: "Verify your email and phone number",
    icon: Mail,
    requirements: ["Confirm email address", "Verify phone number"],
  },
  {
    level: 2,
    title: "Identity Verification",
    description: "Upload government-issued ID",
    icon: CreditCard,
    requirements: ["Upload ID front side", "Upload ID back side or passport", "Upload a selfie"],
  },
  {
    level: 3,
    title: "Enhanced Verification",
    description: "Proof of address and enhanced due diligence",
    icon: Home,
    requirements: ["Upload proof of address (utility bill, bank statement)", "Complete enhanced questionnaire"],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function levelStatus(status: KycStatus | null, level: KycLevel): VerificationStatus {
  if (!status) return "unverified"
  return status.levels.find((l) => l.level === level)?.status ?? "unverified"
}

function isLevelUnlocked(status: KycStatus | null, level: KycLevel): boolean {
  if (!status) return level === 1
  if (level === 1) return true
  const prevLevel = (level - 1) as KycLevel
  const prevStatus = levelStatus(status, prevLevel)
  return prevStatus === "approved"
}

// ── Component ──────────────────────────────────────────────────────────────────

export function KYCSteps({
  userId,
  status,
  documents,
  authToken,
  onStatusChange,
  onDocumentsChange,
}: KYCStepsProps) {
  const [activeStep, setActiveStep] = useState<KycLevel>(status?.targetLevel ?? 1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentLevel = status?.currentLevel ?? 0

  const handleSubmitForReview = async () => {
    setIsSubmitting(true)
    try {
      await submitForReview(userId, activeStep, authToken)
      sonnerToast.success(`Submitted for Level ${activeStep} review`)
    } catch (error) {
      showApiErrorToast(error, "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="size-4 text-primary" />
          Verification Steps
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => {
            const st = levelStatus(status, step.level)
            const unlocked = isLevelUnlocked(status, step.level)
            const active = activeStep === step.level

            return (
              <React.Fragment key={step.level}>
                {idx > 0 && (
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0",
                      currentLevel >= step.level ? "text-primary" : "text-muted-foreground/30"
                    )}
                  />
                )}
                <button
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-lg border p-3 text-left transition-colors",
                    active && "border-primary bg-primary/5",
                    !active && unlocked && "hover:bg-accent",
                    !unlocked && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => unlocked && setActiveStep(step.level)}
                  disabled={!unlocked}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                      st === "approved"
                        ? "border-primary bg-primary text-primary-foreground"
                        : st === "pending"
                        ? "border-amber-500 text-amber-500"
                        : active
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {st === "approved" ? (
                      <Check className="size-4" />
                    ) : (
                      <step.icon className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </button>
              </React.Fragment>
            )
          })}
        </div>

        {/* Active Step Content */}
        <div className="rounded-lg border p-4">
          {STEPS.map((step) => {
            if (step.level !== activeStep) return null
            const st = levelStatus(status, step.level)
            const approved = st === "approved"
            const pending = st === "pending"

            return (
              <div key={step.level} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Badge
                    variant={approved ? "default" : pending ? "secondary" : "outline"}
                  >
                    {approved ? "Approved" : pending ? "Pending Review" : "Not Started"}
                  </Badge>
                </div>

                <ul className="flex flex-col gap-2">
                  {step.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      {req}
                    </li>
                  ))}
                </ul>

                {/* Document upload for level 2+ */}
                {step.level >= 2 && !approved && !pending && (
                  <DocumentUploader
                    userId={userId}
                    documents={documents.filter((d) =>
                      step.level === 2
                        ? d.type === "id_front" || d.type === "id_back" || d.type === "passport" || d.type === "selfie"
                        : d.type === "proof_of_address"
                    )}
                    authToken={authToken}
                    onDocumentsChange={onDocumentsChange}
                  />
                )}

                {/* Submit button */}
                {!approved && !pending && (
                  <Button
                    onClick={handleSubmitForReview}
                    disabled={isSubmitting}
                    className="self-start"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-1 size-4 animate-spin" />
                    ) : (
                      <Award className="mr-1 size-4" />
                    )}
                    Submit for Review
                  </Button>
                )}

                {pending && (
                  <p className="text-sm text-muted-foreground">
                    Your documents are under review. You will be notified once the review is complete.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
