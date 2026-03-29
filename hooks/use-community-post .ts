import useSWR from "swr"

interface Post {
  id: string
  author: string
  title: string
  content: string
  category: "player" | "manager" | "lifestyle"
  upvotes: number
  comments: number
  shares: number
  timestamp: string
  rewardEarned?: number
  isPremium: boolean
}

interface PostsResponse {
  data: Post[]
  total: number
  page: number
  limit: number
  pages: number
}

export function useCommunityPosts(
  category: string = "all",
  page: number = 1,
  limit: number = 10
) {
  const { data, error, isLoading, mutate } = useSWR<PostsResponse>(
    `/api/community-posts?category=${category}&page=${page}&limit=${limit}`,
    async (url) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch posts")
      return res.json()
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    posts: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pages: data?.pages || 0,
    isLoading,
    error,
    mutate,
  }
}

export function usePostRewards(postId: string, userId: string) {
  const { data, error, isLoading } = useSWR(
    postId && userId
      ? `/api/community-posts/rewards?postId=${postId}&userId=${userId}`
      : null,
    async (url) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch rewards")
      return res.json()
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  )

  return {
    rewards: data,
    isLoading,
    error,
  }
}