"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/lib/api/badges"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BadgeUnlockAnimationProps {
    badge: Badge | null
    onClose: () => void
}

export function BadgeUnlockAnimation({ badge, onClose }: BadgeUnlockAnimationProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (badge) {
            setIsVisible(true)
            // Play sound if available
            // const audio = new Audio('/sounds/unlock.mp3');
            // audio.play().catch(() => {});
        } else {
            setIsVisible(false)
        }
    }, [badge])

    if (!badge || !isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-primary/20 animate-ping"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 20 + 10}px`,
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                        }}
                    />
                ))}
            </div>

            <Card className="w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-500 shadow-2xl border-primary/50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-20 rounded-full hover:bg-muted"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent animate-pulse" />

                <CardContent className="flex flex-col items-center pt-12 pb-8 px-8 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="relative bg-muted rounded-full p-8 ring-4 ring-primary/20">
                            <img
                                src={badge.imageUrl}
                                alt={badge.name}
                                className="h-32 w-32 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=150&width=150"
                                }}
                            />
                        </div>
                        <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg rotate-12">
                            <Sparkles className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Achievement Unlocked!</h2>
                        <h3 className="text-3xl font-extrabold tracking-tight">{badge.name}</h3>
                        <p className="text-muted-foreground">{badge.description}</p>
                    </div>

                    <div className={cn(
                        "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider",
                        badge.rarity === "common" && "border-gray-200 bg-gray-100 text-gray-900",
                        badge.rarity === "rare" && "border-blue-200 bg-blue-100 text-blue-900",
                        badge.rarity === "epic" && "border-purple-200 bg-purple-100 text-purple-900",
                        badge.rarity === "legendary" && "border-amber-200 bg-amber-100 text-amber-900"
                    )}>
                        {badge.rarity}
                    </div>

                    <Button size="lg" className="w-full font-bold h-12" onClick={onClose}>
                        Incredible!
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
