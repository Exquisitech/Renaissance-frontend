"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type {
  Comment,
  CommentVoteType,
  ModerateCommentInput,
} from "@/lib/api/comments"
import {
  fetchComments,
  postComment,
  voteComment,
  deleteComment,
  moderateComment,
} from "@/lib/api/comments"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

type WebSocketMessage =
  | { type: "comment"; data: Comment }
  | { type: "vote"; data: { commentId: string; upvotes: number; downvotes: number; score: number } }
  | { type: "moderation"; data: { commentId: string; status: Comment["status"] } }
  | { type: "delete"; data: { commentId: string } }

export interface UseLiveCommentsOptions {
  matchId: string
  authToken?: string
  wsUrl?: string
  pollInterval?: number
  pageSize?: number
  enablePollingFallback?: boolean
}

export interface UseLiveCommentsReturn {
  comments: Comment[]
  isLoading: boolean
  isConnected: boolean
  connectionMode: "websocket" | "polling" | "none"
  hasMore: boolean
  loadMore: () => Promise<void>
  sendComment: (content: string) => Promise<void>
  vote: (commentId: string, voteType: CommentVoteType) => Promise<void>
  removeComment: (commentId: string) => Promise<void>
  moderate: (commentId: string, action: ModerateCommentInput["action"], reason?: string) => Promise<void>
  optimisticComments: Comment[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function sortComments(a: Comment, b: Comment) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useLiveComments(options: UseLiveCommentsOptions): UseLiveCommentsReturn {
  const {
    matchId,
    authToken,
    wsUrl,
    pollInterval = 5000,
    pageSize = 20,
    enablePollingFallback = true,
  } = options

  const [comments, setComments] = useState<Comment[]>([])
  const [optimisticComments, setOptimisticComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionMode, setConnectionMode] = useState<"websocket" | "polling" | "none">("none")
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | undefined>()

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const isMountedRef = useRef(true)

  // Merge real comments with optimistic ones, deduplicating by id
  const allComments = [...optimisticComments, ...comments].reduce<Comment[]>((acc, c) => {
    if (!acc.find((x) => x.id === c.id)) acc.push(c)
    return acc
  }, [])

  // ── Polling ──────────────────────────────────────────────────────────────────

  const loadComments = useCallback(
    async (cursor?: string) => {
      try {
        const res = await fetchComments(
          matchId,
          { limit: pageSize, before: cursor },
          authToken
        )
        if (!isMountedRef.current) return

        setComments((prev) => {
          const merged = cursor ? [...prev, ...res.comments] : res.comments
          // Deduplicate and sort
          const map = new Map<string, Comment>()
          merged.forEach((c) => map.set(c.id, c))
          return Array.from(map.values()).sort(sortComments)
        })
        setHasMore(res.hasMore)
        setNextCursor(res.nextCursor)
      } catch (error) {
        showApiErrorToast(error, "Failed to load comments")
      } finally {
        if (isMountedRef.current) setIsLoading(false)
      }
    },
    [matchId, authToken, pageSize]
  )

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    pollIntervalRef.current = setInterval(() => {
      loadComments()
    }, pollInterval)
    setConnectionMode("polling")
    setIsConnected(true)
  }, [loadComments, pollInterval])

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  // ── WebSocket ────────────────────────────────────────────────────────────────

  const connectWebSocket = useCallback(() => {
    if (!wsUrl || typeof window === "undefined") return

    try {
      const url = `${wsUrl}?matchId=${encodeURIComponent(matchId)}`
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        if (!isMountedRef.current) return
        setIsConnected(true)
        setConnectionMode("websocket")
        reconnectAttemptRef.current = 0
        stopPolling()
      }

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return
        try {
          const msg = JSON.parse(event.data) as WebSocketMessage
          handleWsMessage(msg)
        } catch {
          // Ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (!isMountedRef.current) return
        setIsConnected(false)
        wsRef.current = null
        if (enablePollingFallback) {
          setConnectionMode("polling")
          startPolling()
        } else {
          setConnectionMode("none")
        }

        // Exponential reconnect
        const delay = Math.min(1000 * 2 ** reconnectAttemptRef.current, 30000)
        reconnectAttemptRef.current += 1
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) connectWebSocket()
        }, delay)
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch {
      if (enablePollingFallback) startPolling()
    }
  }, [wsUrl, matchId, enablePollingFallback, startPolling, stopPolling])

  function handleWsMessage(msg: WebSocketMessage) {
    if (msg.type === "comment") {
      setComments((prev) => {
        if (prev.find((c) => c.id === msg.data.id)) return prev
        return [msg.data, ...prev].sort(sortComments)
      })
    } else if (msg.type === "vote") {
      setComments((prev) =>
        prev.map((c) =>
          c.id === msg.data.commentId
            ? { ...c, upvotes: msg.data.upvotes, downvotes: msg.data.downvotes, score: msg.data.score }
            : c
        )
      )
    } else if (msg.type === "moderation") {
      setComments((prev) =>
        prev.map((c) => (c.id === msg.data.commentId ? { ...c, status: msg.data.status } : c))
      )
    } else if (msg.type === "delete") {
      setComments((prev) => prev.filter((c) => c.id !== msg.data.commentId))
    }
  }

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  // ── Init & Cleanup ───────────────────────────────────────────────────────────

  useEffect(() => {
    isMountedRef.current = true
    setIsLoading(true)
    loadComments()

    if (wsUrl) {
      connectWebSocket()
    } else if (enablePollingFallback) {
      startPolling()
    }

    return () => {
      isMountedRef.current = false
      disconnectWebSocket()
      stopPolling()
    }
  }, [wsUrl, matchId, loadComments, connectWebSocket, disconnectWebSocket, startPolling, stopPolling, enablePollingFallback])

  // ── Actions ──────────────────────────────────────────────────────────────────

  const sendComment = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      const tempId = `optimistic-${Date.now()}`
      const optimistic: Comment = {
        id: tempId,
        matchId,
        user: { id: "me", name: "You" },
        content: trimmed,
        upvotes: 0,
        downvotes: 0,
        score: 0,
        status: "visible",
        createdAt: new Date().toISOString(),
        userVote: null,
      }

      setOptimisticComments((prev) => [optimistic, ...prev])

      try {
        const comment = await postComment({ matchId, content: trimmed, authToken })
        if (!isMountedRef.current) return

        setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId))
        setComments((prev) => {
          if (prev.find((c) => c.id === comment.id)) return prev
          return [comment, ...prev].sort(sortComments)
        })

        // Notify via WS if connected
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "comment", data: comment }))
        }
      } catch (error) {
        setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId))
        showApiErrorToast(error, "Failed to post comment")
        throw error
      }
    },
    [matchId, authToken]
  )

  const vote = useCallback(
    async (commentId: string, voteType: CommentVoteType) => {
      // Optimistic update
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c
          const prevVote = c.userVote
          let up = c.upvotes
          let down = c.downvotes

          if (prevVote === "up") up--
          if (prevVote === "down") down--
          if (voteType === "up") up++
          if (voteType === "down") down++

          return {
            ...c,
            upvotes: up,
            downvotes: down,
            score: up - down,
            userVote: prevVote === voteType ? null : voteType,
          }
        })
      )

      try {
        await voteComment({ commentId, vote: voteType, authToken })
      } catch (error) {
        // Revert on error by reloading
        loadComments()
        showApiErrorToast(error, "Failed to vote")
      }
    },
    [authToken, loadComments]
  )

  const removeComment = useCallback(
    async (commentId: string) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      try {
        await deleteComment(commentId, authToken)
      } catch (error) {
        loadComments()
        showApiErrorToast(error, "Failed to delete comment")
      }
    },
    [authToken, loadComments]
  )

  const moderate = useCallback(
    async (commentId: string, action: ModerateCommentInput["action"], reason?: string) => {
      const prev = comments.find((c) => c.id === commentId)
      if (!prev) return

      // Optimistic
      if (action === "delete") {
        setComments((prevList) => prevList.filter((c) => c.id !== commentId))
      } else {
        setComments((prevList) =>
          prevList.map((c) =>
            c.id === commentId
              ? { ...c, status: action === "hide" ? "hidden" : action === "show" ? "visible" : c.status }
              : c
          )
        )
      }

      try {
        await moderateComment({ commentId, action, reason, authToken })
      } catch (error) {
        // Revert
        loadComments()
        showApiErrorToast(error, "Moderation failed")
      }
    },
    [authToken, comments, loadComments]
  )

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return
    setIsLoading(true)
    await loadComments(nextCursor)
  }, [nextCursor, isLoading, loadComments])

  return {
    comments: allComments,
    isLoading,
    isConnected,
    connectionMode,
    hasMore,
    loadMore,
    sendComment,
    vote,
    removeComment,
    moderate,
    optimisticComments,
  }
}
