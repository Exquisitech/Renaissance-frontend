"use client"

import { Badge as BadgeType, BadgeRarity } from "@/lib/api/badges"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Lock, CheckCircle2 } from "lucide-react"

interface BadgeCardProps {
    badge: BadgeType
    size?: "sm" | "md" | "lg"
}

const RARITY_CONFIG: Record<BadgeRarity, { color: string; bg: string; border: string }> = {
    common: {
        color: "text-gray-500",
        bg: "bg-gray-100 dark:bg-gray-800",
        border: "border-gray-200 dark:border-gray-700",
    },
    rare: {
        color: "text-blue-500",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-200 dark:border-blue-800",
    },
    epic: {
        color: "text-purple-500",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-200 dark:border-purple-800",
    },
    legendary: {
        color: "text-amber-500",
        bg: "bg-amber-100 dark:bg-amber-900/30",
        border: "border-amber-200 dark:border-amber-800",
    },
}

export function BadgeCard({ badge, size = "md" }: BadgeCardProps) {
    const config = RARITY_CONFIG[badge.rarity]

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                badge.isUnlocked ? config.border : "border-dashed grayscale opacity-70",
                badge.isUnlocked && "bg-linear-to-br from-transparent to-muted/30"
            )}
        >
            {!badge.isUnlocked && (
                <div className="absolute top-2 right-2 z-10">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
            )}

            {badge.isUnlocked && (
                <div className="absolute top-2 right-2 z-10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
            )}

            <CardHeader className="items-center pb-2 pt-6">
                <div
                    className={cn(
                        "rounded-full p-4 flex items-center justify-center",
                        config.bg,
                        badge.isUnlocked ? "ring-2 ring-primary/20" : ""
                    )}
                >
                    <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className={cn(
                            "object-contain",
                            size === "sm" ? "h-12 w-12" : size === "lg" ? "h-24 w-24" : "h-16 w-16"
                        )}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=100"
                        }}
                    />
                </div>
                <CardTitle className="mt-4 text-center">{badge.name}</CardTitle>
                <UIBadge variant="outline" className={cn("uppercase text-[10px]", config.color)}>
                    {badge.rarity}
                </UIBadge>
            </CardHeader>

            <CardContent className="text-center pb-6">
                <CardDescription className="mb-4">{badge.description}</CardDescription>

                {!badge.isUnlocked && badge.progress !== undefined && (
                    <div className="space-y-2 text-left">
                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                        </div>
                        <Progress value={badge.progress} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground font-medium italic mt-1">
                            Criteria: {badge.criteria}
                        </p>
                    </div>
                )}

                {badge.isUnlocked && badge.unlockedAt && (
                    <p className="text-[10px] text-muted-foreground mt-2 italic">
                        Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
