"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp, Loader2, MessageSquareOff, ArrowBigUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "@/lib/utils"
import type { Comment } from "@/lib/api/comments"
import { fetchTopComments } from "@/lib/api/comments"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

interface TopCommentsProps {
  matchId: string
  limit?: number
  authToken?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────────────

export function TopComments({ matchId, limit = 5, authToken, className }: TopCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchTopComments(matchId, limit, authToken)
      .then((res) => {
        if (!cancelled) setComments(res.comments)
      })
      .catch((err) => {
        if (!cancelled) showApiErrorToast(err, "Failed to load top comments")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [matchId, limit, authToken])

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="size-4 text-primary" />
          Top Comments
          <Badge variant="outline" className="text-xs">
            {comments.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading && (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading...
          </div>
        )}

        {!isLoading && comments.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
            <MessageSquareOff className="size-6 opacity-50" />
            <p className="text-sm">No top comments yet</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{comment.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{comment.content}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                <ArrowBigUp className="size-4" />
                {comment.score}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
