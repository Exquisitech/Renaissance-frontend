"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps {
    value?: number
    max?: number
    className?: string
}

export function Progress({ value = 0, max = 100, className }: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            className={cn("relative w-full overflow-hidden rounded-full bg-muted", className)}
        >
            <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}
