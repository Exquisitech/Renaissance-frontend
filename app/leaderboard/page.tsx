"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs"
import {
  getOverallLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getFriendsLeaderboard,
} from "@/lib/api/leaderboard"

interface LeaderboardEntry {
  rank: number
  username: string
  avatar?: string
  stats: {
    label: string
    value: string | number
  }[]
  score: number
  isCurrentUser?: boolean
  reward?: string
}

export default function LeaderboardPage() {
  const [overallData, setOverallData] = useState<LeaderboardEntry[]>([])
  const [weeklyData, setWeeklyData] = useState<LeaderboardEntry[]>([])
  const [monthlyData, setMonthlyData] = useState<LeaderboardEntry[]>([])
  const [friendsData, setFriendsData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const currentUserId = "CurrentUser" // TODO: Get from auth context

  useEffect(() => {
    async function fetchLeaderboards() {
      setIsLoading(true)
      try {
        const [overall, weekly, monthly, friends] = await Promise.all([
          getOverallLeaderboard(50, currentUserId),
          getWeeklyLeaderboard(50, currentUserId),
          getMonthlyLeaderboard(50, currentUserId),
          getFriendsLeaderboard(currentUserId),
        ])
        setOverallData(overall)
        setWeeklyData(weekly)
        setMonthlyData(monthly)
        setFriendsData(friends)
      } catch (error) {
        console.error("Failed to fetch leaderboards:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboards()
  }, [currentUserId])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading leaderboards...</p>
            </div>
          </div>
        ) : (
          <LeaderboardTabs
            overallData={overallData}
            weeklyData={weeklyData}
            monthlyData={monthlyData}
            friendsData={friendsData}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  )
}