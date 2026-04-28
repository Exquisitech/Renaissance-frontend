export type BadgeRarity = "common" | "rare" | "epic" | "legendary"

export interface Badge {
    id: string
    name: string
    description: string
    imageUrl: string
    rarity: BadgeRarity
    isUnlocked: boolean
    criteria: string
    progress?: number // 0 to 100
    unlockedAt?: string
}

const MOCK_BADGES: Badge[] = [
    {
        id: "first_stake",
        name: "First Steps",
        description: "Place your first stake on a match.",
        imageUrl: "/badges/first_stake.png",
        rarity: "common",
        isUnlocked: true,
        criteria: "Place 1 stake",
        unlockedAt: "2025-04-20T10:00:00Z",
    },
    {
        id: "win_streak_3",
        name: "Winning Streak",
        description: "Win 3 stakes in a row.",
        imageUrl: "/badges/win_streak_3.png",
        rarity: "rare",
        isUnlocked: false,
        criteria: "3 consecutive wins",
        progress: 66,
    },
    {
        id: "heavy_hitter",
        name: "Heavy Hitter",
        description: "Stake a total of 1000 STRK.",
        imageUrl: "/badges/heavy_hitter.png",
        rarity: "epic",
        isUnlocked: false,
        criteria: "Total stake > 1000 STRK",
        progress: 45,
    },
    {
        id: "prediction_master",
        name: "Oracle",
        description: "Correctly predict 10 exact scores.",
        imageUrl: "/badges/prediction_master.png",
        rarity: "legendary",
        isUnlocked: false,
        criteria: "10 exact score predictions",
        progress: 10,
    },
    {
        id: "early_adopter",
        name: "Pioneer",
        description: "Join the platform during the alpha phase.",
        imageUrl: "/badges/early_adopter.png",
        rarity: "rare",
        isUnlocked: true,
        criteria: "Join before May 2025",
        unlockedAt: "2025-04-15T08:30:00Z",
    },
    {
        id: "social_butterfly",
        name: "Social Butterfly",
        description: "Follow 50 other users.",
        imageUrl: "/badges/social_butterfly.png",
        rarity: "common",
        isUnlocked: false,
        criteria: "Follow 50 users",
        progress: 80,
    },
]

export const badgeAPI = {
    getBadges: async (): Promise<Badge[]> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        return MOCK_BADGES
    },

    getBadgeById: async (id: string): Promise<Badge | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return MOCK_BADGES.find((b) => b.id === id)
    },

    getUserAchievements: async (userId: string): Promise<Badge[]> => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        return MOCK_BADGES.filter((b) => b.isUnlocked)
    },
}
