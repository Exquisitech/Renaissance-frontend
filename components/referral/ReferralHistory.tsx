"use client"

import React, { useEffect, useState } from "react"
import { History, Loader2, Users, ChevronDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "@/lib/utils"
import type { ReferralActivity, ReferralStatus, ReferralBonusType } from "@/lib/api/referral"
import { fetchReferralHistory } from "@/lib/api/referral"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReferralHistoryProps {
  userId: string
  authToken?: string
  limit?: number
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function statusVariant(status: ReferralStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "converted":
      return "default"
    case "active":
      return "secondary"
    case "pending":
      return "outline"
    case "expired":
      return "destructive"
  }
}

function bonusLabel(type: ReferralBonusType | undefined): string {
  switch (type) {
    case "signup":
      return "Signup Bonus"
    case "first_stake":
      return "First Stake"
    case "milestone":
      return "Milestone"
    default:
      return "Bonus"
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ReferralHistory({ userId, authToken, limit = 20 }: ReferralHistoryProps) {
  const [activities, setActivities] = useState<ReferralActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const load = async (cursor?: string) => {
    try {
      const res = await fetchReferralHistory(userId, { limit, cursor }, authToken)
      if (!cursor) {
        setActivities(res.activities)
      } else {
        setActivities((prev) => [...prev, ...res.activities])
      }
      setHasMore(res.hasMore)
      setNextCursor(res.nextCursor)
    } catch (error) {
      showApiErrorToast(error, "Failed to load history")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    load()
  }, [userId, authToken, limit])

  const handleLoadMore = () => {
    if (!nextCursor || isLoadingMore) return
    setIsLoadingMore(true)
    load(nextCursor)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="size-4 text-primary" />
          Referral History
          <Badge variant="outline" className="text-xs">
            {activities.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 pr-2">
            {isLoading && activities.length === 0 && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading history...
              </div>
            )}

            {!isLoading && activities.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                <Users className="size-8 opacity-50" />
                <p className="text-sm">No referrals yet. Share your code to get started!</p>
              </div>
            )}

            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{activity.referredUserName}</span>
                    <Badge variant={statusVariant(activity.status)} className="h-5 text-[10px]">
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Code: {activity.code}</span>
                    <span>{formatDistanceToNow(new Date(activity.createdAt))}</span>
                  </div>
                </div>

                {activity.bonusEarned > 0 && (
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{activity.bonusEarned.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{bonusLabel(activity.bonusType)}</span>
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
