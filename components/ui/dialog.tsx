"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => onOpenChange?.(false)}
            />
            <div className="relative z-10">{children}</div>
        </div>
    )
}

interface DialogContentProps {
    children: React.ReactNode
    className?: string
}

export function DialogContent({ children, className }: DialogContentProps) {
    return (
        <div
            className={cn(
                "bg-background border rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-300",
                className
            )}
        >
            {children}
        </div>
    )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("flex flex-col space-y-2 mb-4", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6", className)}>{children}</div>
}

export function DialogClose({ onClick, className }: { onClick?: () => void; className?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn("absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground", className)}
            aria-label="Close"
        >
            <X className="h-4 w-4" />
        </button>
    )
}
