import { apiRequest } from "@/lib/api/client"

// ── Types ──────────────────────────────────────────────────────────────────────

export type CommentVoteType = "up" | "down"

export type CommentStatus = "visible" | "hidden" | "toxic"

export interface CommentUser {
  id: string
  name: string
  avatar?: string
  isModerator?: boolean
}

export interface Comment {
  id: string
  matchId: string
  user: CommentUser
  content: string
  upvotes: number
  downvotes: number
  score: number
  status: CommentStatus
  createdAt: string
  updatedAt?: string
  userVote?: CommentVoteType | null
  toxicityScore?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  before?: string
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface PostCommentInput {
  matchId: string
  content: string
  authToken?: string
}

export interface VoteCommentInput {
  commentId: string
  vote: CommentVoteType
  authToken?: string
}

export interface ModerateCommentInput {
  commentId: string
  action: "hide" | "show" | "delete" | "warn"
  reason?: string
  authToken?: string
}

// ── API helpers ────────────────────────────────────────────────────────────────

export async function fetchComments(
  matchId: string,
  params: PaginationParams = {},
  authToken?: string
): Promise<CommentsResponse> {
  return apiRequest<CommentsResponse>(`/api/matches/${matchId}/comments`, {
    authToken,
    query: {
      page: params.page,
      limit: params.limit ?? 20,
      before: params.before,
    },
  })
}

export async function fetchTopComments(
  matchId: string,
  limit = 5,
  authToken?: string
): Promise<CommentsResponse> {
  return apiRequest<CommentsResponse>(`/api/matches/${matchId}/comments/top`, {
    authToken,
    query: { limit },
  })
}

export async function postComment(input: PostCommentInput): Promise<Comment> {
  const { matchId, content, authToken } = input
  return apiRequest<Comment>(`/api/matches/${matchId}/comments`, {
    method: "POST",
    authToken,
    body: JSON.stringify({ content }),
  })
}

export async function voteComment(input: VoteCommentInput): Promise<Comment> {
  const { commentId, vote, authToken } = input
  return apiRequest<Comment>(`/api/comments/${commentId}/vote`, {
    method: "POST",
    authToken,
    body: JSON.stringify({ vote }),
  })
}

export async function deleteComment(
  commentId: string,
  authToken?: string
): Promise<void> {
  await apiRequest(`/api/comments/${commentId}`, {
    method: "DELETE",
    authToken,
    parseAs: "response",
  })
}

export async function moderateComment(input: ModerateCommentInput): Promise<Comment> {
  const { commentId, action, reason, authToken } = input
  return apiRequest<Comment>(`/api/comments/${commentId}/moderate`, {
    method: "POST",
    authToken,
    body: JSON.stringify({ action, reason }),
  })
}
