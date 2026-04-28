"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
    Trophy, Zap, Target, Users, TrendingUp, Star, CheckCircle2, Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

type PredictionType = "first_scorer" | "total_goals" | "exact_score"

interface MatchInfo {
    id: string
    homeTeam: string
    awayTeam: string
    competition: string
    startTime: string
    /** Pool amounts per market, will inflate as bets come in */
    pools: Record<PredictionType, number>
}

interface LeaderboardEntry {
    rank: number
    username: string
    correctPredictions: number
    totalPredictions: number
    accuracy: number
    totalEarned: number
}

interface PlayerOption {
    id: string
    name: string
    odds: number
    poolShare: number // percent of the pool backing this player
}

// ─────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────

const MATCH: MatchInfo = {
    id: "m001",
    homeTeam: "Arsenal",
    awayTeam: "Manchester City",
    competition: "Premier League",
    startTime: "2025-05-10T15:00:00Z",
    pools: { first_scorer: 4800, total_goals: 3200, exact_score: 6100 },
}

const FIRST_SCORER_OPTIONS: PlayerOption[] = [
    { id: "p1", name: "Erling Haaland", odds: 2.1, poolShare: 32 },
    { id: "p2", name: "Bukayo Saka", odds: 4.5, poolShare: 18 },
    { id: "p3", name: "Kevin De Bruyne", odds: 6.0, poolShare: 12 },
    { id: "p4", name: "Gabriel Martinelli", odds: 7.5, poolShare: 9 },
    { id: "p5", name: "Leandro Trossard", odds: 9.0, poolShare: 7 },
    { id: "p6", name: "Phil Foden", odds: 5.5, poolShare: 14 },
    { id: "p7", name: "Other", odds: 12.0, poolShare: 8 },
]

const TOTAL_GOALS_OPTIONS = [
    { label: "Under 1.5", odds: 5.0, poolShare: 8 },
    { label: "1 - 2 Goals", odds: 2.8, poolShare: 24 },
    { label: "2 - 3 Goals", odds: 2.2, poolShare: 31 },
    { label: "3 - 4 Goals", odds: 3.5, poolShare: 18 },
    { label: "Over 4.5", odds: 6.5, poolShare: 19 },
]

const LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, username: "OracleKing", correctPredictions: 47, totalPredictions: 60, accuracy: 78.3, totalEarned: 1240 },
    { rank: 2, username: "BallWatcher", correctPredictions: 39, totalPredictions: 52, accuracy: 75.0, totalEarned: 980 },
    { rank: 3, username: "MatchMaster", correctPredictions: 35, totalPredictions: 49, accuracy: 71.4, totalEarned: 810 },
    { rank: 4, username: "GoalGuru", correctPredictions: 28, totalPredictions: 40, accuracy: 70.0, totalEarned: 620 },
    { rank: 5, username: "You", correctPredictions: 14, totalPredictions: 22, accuracy: 63.6, totalEarned: 290 },
]

const MY_STATS = { correct: 14, total: 22, earned: 290, streak: 3 }

// ─────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────

function OddsBar({ label, odds, poolShare, selected, onClick }: {
    label: string; odds: number; poolShare: number; selected?: boolean; onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-3 rounded-xl border-2 transition-all duration-200 hover:border-primary/60",
                selected ? "border-primary bg-primary/10" : "border-muted bg-muted/30"
            )}
        >
            <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-sm truncate">{label}</span>
                <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs font-mono">{odds.toFixed(2)}x</Badge>
                    {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
            </div>
            <div className="h-1.5 rounded-full bg-background overflow-hidden">
                <div className="h-full rounded-full bg-primary/50 transition-all" style={{ width: `${poolShare}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{poolShare}% of pool</p>
        </button>
    )
}

function StakeInput({ onSubmit, label }: { onSubmit: (amount: number, prediction: string) => void; label: string }) {
    const [amount, setAmount] = useState(5)
    return (
        <div className="space-y-3 pt-2">
            <Label className="font-semibold">Stake Amount (STRK)</Label>
            <div className="flex gap-2">
                <Input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="w-28"
                />
                {[5, 10, 25].map(v => (
                    <Button key={v} variant="outline" size="sm" onClick={() => setAmount(v)}>{v}</Button>
                ))}
            </div>
            <Button className="w-full" onClick={() => onSubmit(amount, label)}>
                <Zap className="h-4 w-4 mr-2" /> Place Prediction — {amount} STRK
            </Button>
        </div>
    )
}

// ─────────────────────────────────────────
// Main component
// ─────────────────────────────────────────

export function PredictionMarket() {
    const { toast } = useToast()
    const [scorerPick, setScorerPick] = useState<string | null>(null)
    const [goalsPick, setGoalsPick] = useState<string | null>(null)
    const [homeScore, setHomeScore] = useState(0)
    const [awayScore, setAwayScore] = useState(0)

    const handleSubmit = (amount: number, prediction: string) => {
        if (!amount || amount <= 0) return
        toast({
            title: "Prediction placed! 🎯",
            description: `${amount} STRK staked on: "${prediction}"`,
        })
    }

    return (
        <div className="space-y-8">
            {/* Match header */}
            <Card className="overflow-hidden border-primary/20">
                <div className="bg-linear-to-r from-primary/10 via-muted to-primary/10 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="uppercase text-xs tracking-wider">{MATCH.competition}</Badge>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(MATCH.startTime).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-2xl font-extrabold">
                        <span>{MATCH.homeTeam}</span>
                        <span className="text-sm font-normal text-muted-foreground px-3 py-1 border rounded-full">vs</span>
                        <span>{MATCH.awayTeam}</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 divide-x border-t">
                    {Object.entries(MATCH.pools).map(([key, val]) => (
                        <div key={key} className="text-center py-3">
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                                {key.replace("_", " ")}
                            </div>
                            <div className="font-bold text-sm">{val.toLocaleString()} STRK pool</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Prediction tabs */}
            <Tabs defaultValue="first_scorer">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="first_scorer"><Target className="h-3.5 w-3.5 mr-1.5" />First Scorer</TabsTrigger>
                    <TabsTrigger value="total_goals"><TrendingUp className="h-3.5 w-3.5 mr-1.5" />Total Goals</TabsTrigger>
                    <TabsTrigger value="exact_score"><Trophy className="h-3.5 w-3.5 mr-1.5" />Exact Score</TabsTrigger>
                </TabsList>

                <TabsContent value="first_scorer" className="mt-6 space-y-4">
                    <p className="text-sm text-muted-foreground">Who will score the first goal of the match?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {FIRST_SCORER_OPTIONS.map(opt => (
                            <OddsBar
                                key={opt.id}
                                label={opt.name}
                                odds={opt.odds}
                                poolShare={opt.poolShare}
                                selected={scorerPick === opt.id}
                                onClick={() => setScorerPick(opt.id)}
                            />
                        ))}
                    </div>
                    {scorerPick && (
                        <StakeInput
                            label={FIRST_SCORER_OPTIONS.find(o => o.id === scorerPick)?.name ?? ""}
                            onSubmit={handleSubmit}
                        />
                    )}
                </TabsContent>

                <TabsContent value="total_goals" className="mt-6 space-y-4">
                    <p className="text-sm text-muted-foreground">How many total goals will be scored?</p>
                    <div className="space-y-2">
                        {TOTAL_GOALS_OPTIONS.map(opt => (
                            <OddsBar
                                key={opt.label}
                                label={opt.label}
                                odds={opt.odds}
                                poolShare={opt.poolShare}
                                selected={goalsPick === opt.label}
                                onClick={() => setGoalsPick(opt.label)}
                            />
                        ))}
                    </div>
                    {goalsPick && (
                        <StakeInput label={goalsPick} onSubmit={handleSubmit} />
                    )}
                </TabsContent>

                <TabsContent value="exact_score" className="mt-6 space-y-6">
                    <p className="text-sm text-muted-foreground">Predict the exact final score (highest odds, hardest to get).</p>
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center space-y-2">
                            <Label>{MATCH.homeTeam}</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => setHomeScore(Math.max(0, homeScore - 1))}>-</Button>
                                <span className="text-3xl font-bold w-8 text-center">{homeScore}</span>
                                <Button variant="outline" size="icon" onClick={() => setHomeScore(homeScore + 1)}>+</Button>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-muted-foreground">—</span>
                        <div className="text-center space-y-2">
                            <Label>{MATCH.awayTeam}</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => setAwayScore(Math.max(0, awayScore - 1))}>-</Button>
                                <span className="text-3xl font-bold w-8 text-center">{awayScore}</span>
                                <Button variant="outline" size="icon" onClick={() => setAwayScore(awayScore + 1)}>+</Button>
                            </div>
                        </div>
                    </div>
                    <StakeInput label={`${MATCH.homeTeam} ${homeScore} - ${awayScore} ${MATCH.awayTeam}`} onSubmit={handleSubmit} />
                </TabsContent>
            </Tabs>

            {/* My stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Correct", value: MY_STATS.correct, icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, color: "text-green-500" },
                    { label: "Total Bets", value: MY_STATS.total, icon: <Target className="h-4 w-4 text-blue-500" />, color: "text-blue-500" },
                    { label: "STRK Earned", value: MY_STATS.earned, icon: <TrendingUp className="h-4 w-4 text-amber-500" />, color: "text-amber-500" },
                    { label: "Win Streak", value: MY_STATS.streak, icon: <Zap className="h-4 w-4 text-purple-500" />, color: "text-purple-500" },
                ].map(s => (
                    <Card key={s.label}>
                        <CardContent className="flex items-center gap-3 pt-5">
                            {s.icon}
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{s.label}</p>
                                <p className={cn("text-xl font-extrabold", s.color)}>{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" /> Top Predictors
                    </CardTitle>
                    <CardDescription>All-time leaderboard for prediction accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {LEADERBOARD.map((entry) => (
                            <div
                                key={entry.rank}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl border",
                                    entry.username === "You" ? "bg-primary/5 border-primary/30 font-semibold" : "bg-muted/30"
                                )}
                            >
                                <span className={cn(
                                    "w-6 text-center font-bold text-sm shrink-0",
                                    entry.rank === 1 ? "text-amber-500" : entry.rank === 2 ? "text-gray-400" : entry.rank === 3 ? "text-orange-600" : "text-muted-foreground"
                                )}>
                                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                                </span>
                                <span className="flex-1 text-sm">{entry.username}</span>
                                <span className="text-xs text-muted-foreground shrink-0">{entry.correctPredictions}/{entry.totalPredictions}</span>
                                <Badge variant="outline" className="shrink-0">
                                    <Star className="h-3 w-3 mr-1 text-amber-500" />{entry.accuracy.toFixed(1)}%
                                </Badge>
                                <span className="text-xs font-bold text-primary shrink-0">{entry.totalEarned} STRK</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
