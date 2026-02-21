"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Home, TrendingUp, CoinsIcon, Award, Target } from "lucide-react"

type LeaderboardEntry = {
  rank: number
  username: string
  value: number
  change: number
}

export default function LeaderboardPage() {
  const [highestEarners, setHighestEarners] = useState<LeaderboardEntry[]>([])
  const [highestStakers, setHighestStakers] = useState<LeaderboardEntry[]>([])
  const [bestPredictors, setBestPredictors] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/leaderboard")
      const data = await response.json()
      setHighestEarners(data.highestEarners || [])
      setHighestStakers(data.highestStakers || [])
      setBestPredictors(data.bestPredictors || [])
    } catch (error) {
      console.error("Failed to fetch leaderboards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const LeaderboardTable = ({ entries, label }: { entries: LeaderboardEntry[], label: string }) => (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <Card key={entry.rank} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                  {entry.rank}
                </div>
                <div>
                  <p className="font-semibold">{entry.username}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">
                  {label === "Accuracy" ? `${entry.value}%` : `${entry.value} XLM`}
                </p>
                <Badge variant={entry.change >= 0 ? "outline" : "secondary"} className="mt-1">
                  {entry.change >= 0 ? "+" : ""}{entry.change}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-6">
        <aside className="hidden md:block">
          <nav className="grid items-start gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/live-scores">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Live Scores
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="w-full justify-start gap-2 bg-muted">
                <Award className="h-4 w-4" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/spin-to-win">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CoinsIcon className="h-4 w-4" />
                Spin to Win
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Leaderboards</h1>
              <p className="text-muted-foreground">Top performers on Renaissance</p>
            </div>

            <Separator />

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading leaderboards...</p>
              </div>
            ) : (
              <Tabs defaultValue="earners" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="earners" className="gap-2">
                    <CoinsIcon className="h-4 w-4" />
                    Highest Earners
                  </TabsTrigger>
                  <TabsTrigger value="stakers" className="gap-2">
                    <Target className="h-4 w-4" />
                    Highest Stakers
                  </TabsTrigger>
                  <TabsTrigger value="predictors" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Best Predictors
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="earners" className="mt-6">
                  <LeaderboardTable entries={highestEarners} label="Total Earnings" />
                </TabsContent>

                <TabsContent value="stakers" className="mt-6">
                  <LeaderboardTable entries={highestStakers} label="Total Staked" />
                </TabsContent>

                <TabsContent value="predictors" className="mt-6">
                  <LeaderboardTable entries={bestPredictors} label="Accuracy" />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}