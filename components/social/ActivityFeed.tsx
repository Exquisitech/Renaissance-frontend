"use client"

import { useEffect, useState } from "react"
import { ActivityItem, socialAPI } from "@/lib/api/social"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Trophy, ShoppingBag, Star, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ACTIVITY_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    bet_placed: { icon: <TrendingUp className="h-4 w-4" />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", label: "Bet Placed" },
    bet_won: { icon: <Trophy className="h-4 w-4" />, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", label: "Bet Won" },
    stake: { icon: <Zap className="h-4 w-4" />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", label: "Stake" },
    nft_purchase: { icon: <ShoppingBag className="h-4 w-4" />, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400", label: "NFT Purchase" },
    achievement: { icon: <Star className="h-4 w-4" />, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", label: "Achievement" },
}

function timeAgo(dateString: string): string {
    const diff = Date.now() - new Date(dateString).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

interface ActivityFeedProps {
    userId?: string // if provided, only show that user's activity
}

export function ActivityFeed({ userId }: ActivityFeedProps) {
    const [feed, setFeed] = useState<ActivityItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const loadFeed = async () => {
        const data = await socialAPI.getFeed()
        setFeed(userId ? data.filter((a) => a.userId === userId) : data)
        setLoading(false)
        setRefreshing(false)
    }

    useEffect(() => { loadFeed() }, [userId])

    const handleRefresh = () => {
        setRefreshing(true)
        loadFeed()
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{userId ? "Activity" : "Community Feed"}</CardTitle>
                        <CardDescription>Latest actions from the Renaissance community</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {feed.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6 text-sm">No activity to show yet.</p>
                ) : (
                    feed.map((item) => {
                        const config = ACTIVITY_CONFIG[item.type]
                        return (
                            <div key={item.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                                <div className={cn("p-2 rounded-full shrink-0 mt-0.5", config.color)}>
                                    {config.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm">{item.username}</span>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{config.label}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                                    {item.metadata?.amount && (
                                        <span className="text-xs font-bold text-primary">
                                            {item.metadata.amount} {item.metadata.currency}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0 mt-1">{timeAgo(item.createdAt)}</span>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}
