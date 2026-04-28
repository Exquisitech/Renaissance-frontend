"use client"

import React, { useEffect, useState } from "react"
import { Shield, Loader2, Users, ChevronDown, Check, X, MessageSquare, FileText } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "@/lib/utils"
import type { KycSubmission, KycDocument, ReviewAction } from "@/lib/api/verification"
import { fetchReviewQueue, reviewSubmission } from "@/lib/api/verification"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

interface AdminReviewQueueProps {
  authToken?: string
}

interface ReviewingState {
  submissionId: string
  action: ReviewAction
  notes: string
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AdminReviewQueue({ authToken }: AdminReviewQueueProps) {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [reviewing, setReviewing] = useState<ReviewingState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = async (cursor?: string) => {
    try {
      const res = await fetchReviewQueue({ status: "pending", limit: 20, cursor }, authToken)
      if (!cursor) {
        setSubmissions(res.submissions)
      } else {
        setSubmissions((prev) => [...prev, ...res.submissions])
      }
      setHasMore(res.hasMore)
      setNextCursor(res.nextCursor)
    } catch (error) {
      showApiErrorToast(error, "Failed to load review queue")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    load()
  }, [authToken])

  const handleLoadMore = () => {
    if (!nextCursor || isLoadingMore) return
    setIsLoadingMore(true)
    load(nextCursor)
  }

  const handleReview = async () => {
    if (!reviewing) return
    setIsSubmitting(true)
    try {
      await reviewSubmission({
        submissionId: reviewing.submissionId,
        action: reviewing.action,
        notes: reviewing.notes || undefined,
        authToken,
      })
      setSubmissions((prev) => prev.filter((s) => s.id !== reviewing.submissionId))
      setReviewing(null)
      sonnerToast.success(`Submission ${reviewing.action}d`)
    } catch (error) {
      showApiErrorToast(error, "Review action failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="size-4 text-primary" />
          Review Queue
          <Badge variant="outline" className="text-xs">
            {submissions.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3 pr-2">
            {isLoading && submissions.length === 0 && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading queue...
              </div>
            )}

            {!isLoading && submissions.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                <Check className="size-8 text-emerald-500" />
                <p className="text-sm">All caught up! No pending reviews.</p>
              </div>
            )}

            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{sub.userName}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Level {sub.targetLevel}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(sub.submittedAt))}
                  </span>
                </div>

                {/* Documents */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Documents</span>
                  <div className="flex flex-wrap gap-2">
                    {sub.documents.map((doc) => (
                      <DocumentBadge key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {reviewing?.submissionId === sub.id ? (
                  <div className="flex flex-col gap-2 rounded-lg bg-muted p-3">
                    <span className="text-xs font-medium">
                      {reviewing.action === "approve"
                        ? "Approve submission"
                        : reviewing.action === "reject"
                        ? "Reject submission"
                        : "Request more information"}
                    </span>
                    <Input
                      placeholder="Add notes (optional)..."
                      value={reviewing.notes}
                      onChange={(e) =>
                        setReviewing({ ...reviewing, notes: e.target.value })
                      }
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={
                          reviewing.action === "approve"
                            ? "default"
                            : reviewing.action === "reject"
                            ? "destructive"
                            : "secondary"
                        }
                        onClick={handleReview}
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="mr-1 size-3 animate-spin" />}
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReviewing(null)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
                      onClick={() =>
                        setReviewing({ submissionId: sub.id, action: "approve", notes: "" })
                      }
                    >
                      <Check className="size-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setReviewing({ submissionId: sub.id, action: "reject", notes: "" })
                      }
                    >
                      <X className="size-3.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() =>
                        setReviewing({ submissionId: sub.id, action: "request_info", notes: "" })
                      }
                    >
                      <MessageSquare className="size-3.5" />
                      Request Info
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="text-xs"
                >
                  {isLoadingMore ? (
                    <Loader2 className="mr-1 size-3 animate-spin" />
                  ) : (
                    <ChevronDown className="mr-1 size-3" />
                  )}
                  Load more
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function DocumentBadge({ doc }: { doc: KycDocument }) {
  return (
    <div className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
      <FileText className="size-3 text-muted-foreground" />
      <span className="capitalize">{doc.type.replace(/_/g, " ")}</span>
      <span
        className={cn(
          "size-1.5 rounded-full",
          doc.status === "approved"
            ? "bg-emerald-500"
            : doc.status === "rejected"
            ? "bg-destructive"
            : "bg-amber-500"
        )}
      />
    </div>
  )
}
