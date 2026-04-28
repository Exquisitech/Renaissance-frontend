"use client"

import React, { useCallback, useState } from "react"
import {
  ArrowBigUp,
  ArrowBigDown,
  Shield,
  MoreVertical,
  EyeOff,
  Eye,
  Trash2,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
  MessageSquareOff,
} from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommentInput } from "./CommentInput"
import type { Comment, CommentVoteType, CommentStatus } from "@/lib/api/comments"
import type { UseLiveCommentsReturn } from "@/hooks/use-live-comments"

// ── Types ──────────────────────────────────────────────────────────────────────

interface LiveCommentFeedProps {
  matchId: string
  hook: UseLiveCommentsReturn
  currentUserId?: string
  isModerator?: boolean
  title?: string
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ConnectionBadge({ mode, connected }: { mode: string; connected: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {connected ? (
        <Wifi className="size-3.5 text-emerald-500" />
      ) : (
        <WifiOff className="size-3.5 text-muted-foreground" />
      )}
      <span className={cn("text-xs font-medium", connected ? "text-emerald-500" : "text-muted-foreground")}>
        {connected ? (mode === "websocket" ? "Live" : "Polling") : "Offline"}
      </span>
    </div>
  )
}

function ToxicWarning({ onReveal }: { onReveal: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
      <AlertTriangle className="size-3.5 shrink-0" />
      <span className="flex-1">This comment was flagged as potentially toxic.</span>
      <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={onReveal}>
        Show anyway
      </Button>
    </div>
  )
}

function ModerationMenu({
  commentId,
  currentStatus,
  isModerator,
  isAuthor,
  onDelete,
  onModerate,
}: {
  commentId: string
  currentStatus: CommentStatus
  isModerator: boolean
  isAuthor: boolean
  onDelete: (id: string) => void
  onModerate: (id: string, action: "hide" | "show" | "delete") => void
}) {
  const [open, setOpen] = useState(false)

  const handleAction = useCallback(
    (action: "hide" | "show" | "delete") => {
      setOpen(false)
      if (action === "delete") {
        onDelete(commentId)
      } else {
        onModerate(commentId, action)
      }
    },
    [commentId, onDelete, onModerate]
  )

  if (!isModerator && !isAuthor) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon-xs"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
        aria-label="Comment actions"
      >
        <MoreVertical className="size-3.5" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border bg-popover p-1 shadow-md">
            {isModerator && currentStatus !== "hidden" && (
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                onClick={() => handleAction("hide")}
              >
                <EyeOff className="size-3.5" />
                Hide
              </button>
            )}
            {isModerator && currentStatus === "hidden" && (
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                onClick={() => handleAction("show")}
              >
                <Eye className="size-3.5" />
                Show
              </button>
            )}
            {(isModerator || isAuthor) && (
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10"
                onClick={() => handleAction("delete")}
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  currentUserId,
  isModerator,
  onVote,
  onDelete,
  onModerate,
}: {
  comment: Comment
  currentUserId?: string
  isModerator?: boolean
  onVote: (id: string, v: CommentVoteType) => void
  onDelete: (id: string) => void
  onModerate: (id: string, action: "hide" | "show" | "delete") => void
}) {
  const [revealed, setRevealed] = useState(false)
  const isAuthor = comment.user.id === currentUserId
  const isToxic = comment.status === "toxic"
  const isHidden = comment.status === "hidden"

  if (isHidden && !isModerator) return null

  const showWarning = isToxic && !revealed

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg border p-3 transition-colors",
        isHidden && "opacity-60",
        comment.id.startsWith("optimistic-") && "opacity-70"
      )}
    >
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn("text-muted-foreground", comment.userVote === "up" && "text-primary")}
          onClick={() => onVote(comment.id, "up")}
          aria-label="Upvote"
        >
          <ArrowBigUp className="size-5" />
        </Button>
        <span className="text-xs font-semibold tabular-nums">{comment.score}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn("text-muted-foreground", comment.userVote === "down" && "text-destructive")}
          onClick={() => onVote(comment.id, "down")}
          aria-label="Downvote"
        >
          <ArrowBigDown className="size-5" />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{comment.user.name}</span>
          {comment.user.isModerator && (
            <Badge variant="secondary" className="h-4 gap-0.5 px-1.5 text-[10px]">
              <Shield className="size-3" />
              Mod
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt))}
          </span>

          <div className="ml-auto flex items-center">
            <ModerationMenu
              commentId={comment.id}
              currentStatus={comment.status}
              isModerator={!!isModerator}
              isAuthor={isAuthor}
              onDelete={onDelete}
              onModerate={onModerate}
            />
          </div>
        </div>

        {showWarning ? (
          <ToxicWarning onReveal={() => setRevealed(true)} />
        ) : (
          <p className={cn("break-words text-sm", isHidden && "italic text-muted-foreground")}>
            {isHidden && <span className="mr-1 text-xs">[Hidden]</span>}
            {comment.content}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function LiveCommentFeed({
  hook,
  currentUserId,
  isModerator = false,
  title = "Live Discussion",
}: LiveCommentFeedProps) {
  const {
    comments,
    isLoading,
    isConnected,
    connectionMode,
    hasMore,
    loadMore,
    sendComment,
    vote,
    removeComment,
    moderate,
  } = hook

  const handleModerate = useCallback(
    (id: string, action: "hide" | "show" | "delete") => {
      if (action === "delete") {
        removeComment(id)
      } else {
        moderate(id, action)
      }
    },
    [removeComment, moderate]
  )

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {comments.length}
          </Badge>
        </div>
        <ConnectionBadge mode={connectionMode} connected={isConnected} />
      </div>

      {/* Comment Input */}
      <CommentInput onSubmit={sendComment} disabled={!isConnected && connectionMode === "none"} />

      {/* Comments List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 pr-2">
          {isLoading && comments.length === 0 && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading comments...
            </div>
          )}

          {!isLoading && comments.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
              <MessageSquareOff className="size-8 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to comment!</p>
            </div>
          )}

          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isModerator={isModerator}
              onVote={vote}
              onDelete={removeComment}
              onModerate={handleModerate}
            />
          ))}

          {/* Pagination */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMore}
                disabled={isLoading}
                className="text-xs"
              >
                {isLoading ? (
                  <Loader2 className="mr-1 size-3 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1 size-3" />
                )}
                Load more comments
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
