export type ActivityType = "bet_placed" | "bet_won" | "stake" | "nft_purchase" | "achievement"

export interface UserProfile {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
    bio?: string
    isPrivate: boolean
    isFollowing: boolean
    isBlocked: boolean
    followerCount: number
    followingCount: number
    totalEarned: number
    badgeCount: number
    joinedAt: string
}

export interface ActivityItem {
    id: string
    userId: string
    username: string
    avatarUrl?: string
    type: ActivityType
    description: string
    metadata?: {
        amount?: number
        currency?: string
        matchName?: string
        nftName?: string
        badgeName?: string
    }
    createdAt: string
}

const MOCK_USERS: UserProfile[] = [
    {
        id: "u001", username: "OracleKing", displayName: "Oracle King", bio: "Football data nerd. 78% prediction accuracy 🔥",
        isPrivate: false, isFollowing: true, isBlocked: false,
        followerCount: 312, followingCount: 89, totalEarned: 1240, badgeCount: 9, joinedAt: "2025-01-10T00:00:00Z"
    },
    {
        id: "u002", username: "BallWatcher", displayName: "Ball Watcher", bio: "Watching every pass.",
        isPrivate: false, isFollowing: false, isBlocked: false,
        followerCount: 201, followingCount: 145, totalEarned: 980, badgeCount: 7, joinedAt: "2025-02-01T00:00:00Z"
    },
    {
        id: "u003", username: "GoalGuru", displayName: "Goal Guru", bio: "If there's a goal, I saw it first.",
        isPrivate: true, isFollowing: false, isBlocked: false,
        followerCount: 88, followingCount: 33, totalEarned: 620, badgeCount: 4, joinedAt: "2025-03-15T00:00:00Z"
    },
]

const MOCK_FEED: ActivityItem[] = [
    { id: "a1", userId: "u001", username: "OracleKing", type: "bet_won", description: "won a bet on Arsenal vs Chelsea", metadata: { amount: 45, currency: "STRK", matchName: "Arsenal vs Chelsea" }, createdAt: "2025-05-08T14:32:00Z" },
    { id: "a2", userId: "u002", username: "BallWatcher", type: "bet_placed", description: "placed a bet on Barcelona vs Real Madrid", metadata: { amount: 10, currency: "STRK", matchName: "Barcelona vs Real Madrid" }, createdAt: "2025-05-08T13:10:00Z" },
    { id: "a3", userId: "u001", username: "OracleKing", type: "achievement", description: "unlocked the Oracle badge", metadata: { badgeName: "Oracle" }, createdAt: "2025-05-08T12:00:00Z" },
    { id: "a4", userId: "u003", username: "GoalGuru", type: "stake", description: "staked 50 STRK on Bayern Munich", metadata: { amount: 50, currency: "STRK" }, createdAt: "2025-05-08T11:45:00Z" },
    { id: "a5", userId: "u002", username: "BallWatcher", type: "nft_purchase", description: "purchased Messi Legendary card NFT", metadata: { nftName: "Messi Legendary Card" }, createdAt: "2025-05-08T10:20:00Z" },
    { id: "a6", userId: "u001", username: "OracleKing", type: "stake", description: "staked 100 STRK on Manchester City", metadata: { amount: 100, currency: "STRK" }, createdAt: "2025-05-08T09:00:00Z" },
]

export const socialAPI = {
    getFeed: async (): Promise<ActivityItem[]> => {
        await new Promise((r) => setTimeout(r, 500))
        return MOCK_FEED
    },

    getProfile: async (userId: string): Promise<UserProfile | undefined> => {
        await new Promise((r) => setTimeout(r, 400))
        return MOCK_USERS.find((u) => u.id === userId)
    },

    getSuggestedUsers: async (): Promise<UserProfile[]> => {
        await new Promise((r) => setTimeout(r, 400))
        return MOCK_USERS
    },

    follow: async (userId: string): Promise<void> => {
        await new Promise((r) => setTimeout(r, 600))
    },

    unfollow: async (userId: string): Promise<void> => {
        await new Promise((r) => setTimeout(r, 600))
    },

    block: async (userId: string): Promise<void> => {
        await new Promise((r) => setTimeout(r, 600))
    },

    unblock: async (userId: string): Promise<void> => {
        await new Promise((r) => setTimeout(r, 600))
    },
}
