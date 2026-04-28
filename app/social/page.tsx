"use client"

import { useEffect, useState } from "react"
import { socialAPI, UserProfile } from "@/lib/api/social"
import { Header } from "@/components/header"
import { ActivityFeed } from "@/components/social/ActivityFeed"
import { FollowButton } from "@/components/social/FollowButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users2, Rss } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SocialPage() {
    const [suggested, setSuggested] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        socialAPI.getSuggestedUsers().then((data) => {
            setSuggested(data)
            setLoading(false)
        })
    }, [])

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 space-y-10">
                <div className="flex items-center gap-3 pb-6 border-b border-muted">
                    <Rss className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Social</h1>
                        <p className="text-muted-foreground">Follow fans, see activity, build your community.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <ActivityFeed />
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Users2 className="h-4 w-4 text-primary" /> Suggested Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)
                                ) : (
                                    suggested.map((user) => (
                                        <div key={user.id} className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                                    {user.displayName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/profile/${user.id}`}
                                                    className="font-semibold text-sm hover:text-primary transition-colors truncate block"
                                                >
                                                    {user.displayName}
                                                </Link>
                                                <p className="text-xs text-muted-foreground truncate">@{user.username} · {user.followerCount} followers</p>
                                            </div>
                                            <FollowButton userId={user.id} isFollowing={user.isFollowing} size="sm" />
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
