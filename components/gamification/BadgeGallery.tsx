"use client"

import { useEffect, useState } from "react"
import { Badge, badgeAPI, BadgeRarity } from "@/lib/api/badges"
import { BadgeCard } from "./BadgeCard"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Trophy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BadgeGallery() {
    const [badges, setBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "earned" | "locked">("all")
    const [rarityFilter, setRarityFilter] = useState<BadgeRarity | "all">("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function loadBadges() {
            try {
                const data = await badgeAPI.getBadges()
                setBadges(data)
            } catch (error) {
                console.error("Failed to load badges:", error)
            } finally {
                setLoading(false)
            }
        }
        loadBadges()
    }, [])

    const filteredBadges = badges.filter((badge) => {
        const matchesStatus =
            filter === "all" || (filter === "earned" ? badge.isUnlocked : !badge.isUnlocked)
        const matchesRarity = rarityFilter === "all" || badge.rarity === rarityFilter
        const matchesSearch =
            badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesStatus && matchesRarity && matchesSearch
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">All Badges</TabsTrigger>
                        <TabsTrigger value="earned">Earned</TabsTrigger>
                        <TabsTrigger value="locked">Locked</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search badges..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Select value={rarityFilter} onValueChange={(v) => setRarityFilter(v as any)}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Rarity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Rarities</SelectItem>
                            <SelectItem value="common">Common</SelectItem>
                            <SelectItem value="rare">Rare</SelectItem>
                            <SelectItem value="epic">Epic</SelectItem>
                            <SelectItem value="legendary">Legendary</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : filteredBadges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                    <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-xl font-semibold">No badges found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    )
}
