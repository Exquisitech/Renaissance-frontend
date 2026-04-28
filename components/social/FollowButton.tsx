"use client"

import { useState } from "react"
import { socialAPI } from "@/lib/api/social"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FollowButtonProps {
    userId: string
    isFollowing: boolean
    onToggle?: (isFollowing: boolean) => void
    size?: "sm" | "default" | "lg"
    className?: string
}

export function FollowButton({ userId, isFollowing: initialFollowing, onToggle, size = "default", className }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleToggle = async () => {
        setLoading(true)
        try {
            if (isFollowing) {
                await socialAPI.unfollow(userId)
                setIsFollowing(false)
                onToggle?.(false)
                toast({ title: "Unfollowed", description: "You have unfollowed this user." })
            } else {
                await socialAPI.follow(userId)
                setIsFollowing(true)
                onToggle?.(true)
                toast({ title: "Following!", description: "You are now following this user." })
            }
        } catch {
            toast({ title: "Error", description: "Failed to update follow status.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            size={size}
            variant={isFollowing ? "outline" : "default"}
            onClick={handleToggle}
            disabled={loading}
            className={cn("min-w-24 transition-all", className)}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <><UserCheck className="h-4 w-4 mr-2" />Following</>
            ) : (
                <><UserPlus className="h-4 w-4 mr-2" />Follow</>
            )}
        </Button>
    )
}
