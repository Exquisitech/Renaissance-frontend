"use client"

import { UserProfile } from "@/lib/api/social"
import { FollowButton } from "./FollowButton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Trophy, Star, Lock } from "lucide-react"
import { useState } from "react"

interface ProfileHeaderProps {
    profile: UserProfile
    isOwnProfile?: boolean
    onBlock?: () => void
}

export function ProfileHeader({ profile, isOwnProfile = false, onBlock }: ProfileHeaderProps) {
    const [followerCount, setFollowerCount] = useState(profile.followerCount)
    const [isFollowing, setIsFollowing] = useState(profile.isFollowing)

    const handleToggleFollow = (following: boolean) => {
        setIsFollowing(following)
        setFollowerCount((prev) => (following ? prev + 1 : prev - 1))
    }

    return (
        <div className="bg-linear-to-br from-primary/10 via-muted/40 to-background rounded-2xl border p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden flex items-center justify-center">
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-primary">
                                {profile.displayName[0].toUpperCase()}
                            </span>
                        )}
                    </div>
                    {profile.isPrivate && (
                        <div className="absolute -bottom-1 -right-1 bg-background border rounded-full p-1">
                            <Lock className="h-3 w-3 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-extrabold tracking-tight">{profile.displayName}</h2>
                        {profile.isPrivate && (
                            <Badge variant="outline" className="text-xs"><Lock className="h-3 w-3 mr-1" />Private</Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm">@{profile.username}</p>
                    {profile.bio && <p className="mt-2 text-sm max-w-lg">{profile.bio}</p>}
                </div>

                {!isOwnProfile && (
                    <div className="flex items-center gap-2 shrink-0">
                        <FollowButton
                            userId={profile.id}
                            isFollowing={isFollowing}
                            onToggle={handleToggleFollow}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            title="Block user"
                            onClick={onBlock}
                        >
                            <Shield className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { icon: <Users className="h-4 w-4 text-blue-500" />, label: "Followers", value: followerCount },
                    { icon: <Users className="h-4 w-4 text-purple-500" />, label: "Following", value: profile.followingCount },
                    { icon: <Trophy className="h-4 w-4 text-amber-500" />, label: "STRK Earned", value: `${profile.totalEarned.toLocaleString()}` },
                    { icon: <Star className="h-4 w-4 text-primary" />, label: "Badges", value: profile.badgeCount },
                ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 bg-background/70 rounded-xl p-3 border">
                        {stat.icon}
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</p>
                            <p className="font-bold text-sm">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
