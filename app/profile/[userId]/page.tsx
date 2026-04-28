"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { socialAPI, UserProfile } from "@/lib/api/social"
import { Header } from "@/components/header"
import { ProfileHeader } from "@/components/social/ProfileHeader"
import { ActivityFeed } from "@/components/social/ActivityFeed"
import { BlockUserModal } from "@/components/social/BlockUserModal"
import { BadgeGallery } from "@/components/gamification/BadgeGallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock } from "lucide-react"

export default function PublicProfilePage() {
    const params = useParams<{ userId: string }>()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [blockModalOpen, setBlockModalOpen] = useState(false)

    useEffect(() => {
        if (!params.userId) return
        socialAPI.getProfile(params.userId).then((data) => {
            setProfile(data ?? null)
            setLoading(false)
        })
    }, [params.userId])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <div className="container mx-auto px-4 py-12 space-y-6">
                    <div className="h-40 rounded-2xl bg-muted animate-pulse" />
                    <div className="h-10 w-40 bg-muted rounded-xl animate-pulse" />
                    <div className="h-64 bg-muted rounded-xl animate-pulse" />
                </div>
            </div>
        )
    }

    if (!profile) return notFound()

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 space-y-8">
                <ProfileHeader
                    profile={profile}
                    onBlock={() => setBlockModalOpen(true)}
                />

                {profile.isPrivate && !profile.isFollowing ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                        <Lock className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-xl font-semibold">This profile is private</h3>
                        <p className="text-muted-foreground">Follow @{profile.username} to see their activity.</p>
                    </div>
                ) : (
                    <Tabs defaultValue="activity">
                        <TabsList>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="badges">Badges</TabsTrigger>
                        </TabsList>

                        <TabsContent value="activity" className="mt-6">
                            <ActivityFeed userId={profile.id} />
                        </TabsContent>

                        <TabsContent value="badges" className="mt-6">
                            <BadgeGallery />
                        </TabsContent>
                    </Tabs>
                )}
            </main>

            <BlockUserModal
                userId={profile.id}
                username={profile.username}
                isBlocked={profile.isBlocked}
                open={blockModalOpen}
                onClose={() => setBlockModalOpen(false)}
                onSuccess={(blocked) => setProfile(prev => prev ? { ...prev, isBlocked: blocked } : null)}
            />
        </div>
    )
}
