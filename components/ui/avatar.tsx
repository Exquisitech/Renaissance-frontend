"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps {
    className?: string
    children: React.ReactNode
}

export function Avatar({ className, children }: AvatarProps) {
    return (
        <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
            {children}
        </div>
    )
}

interface AvatarImageProps {
    src: string
    alt?: string
    className?: string
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
    return (
        <img
            src={src}
            alt={alt ?? ""}
            className={cn("h-full w-full object-cover", className)}
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none"
            }}
        />
    )
}

interface AvatarFallbackProps {
    className?: string
    children: React.ReactNode
}

export function AvatarFallback({ className, children }: AvatarFallbackProps) {
    return (
        <div
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold",
                className
            )}
        >
            {children}
        </div>
    )
}
