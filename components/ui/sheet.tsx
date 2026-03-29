"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sheet({ children, open, onOpenChange }: SheetProps) {
  return <>{children}</>
}

export function SheetTrigger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return React.cloneElement(children as React.ReactElement, { onClick })
}

export function SheetContent({ 
  children, 
  className,
  side = "right"
}: { 
  children: React.ReactNode
  className?: string
  side?: "right" | "left"
}) {
  return (
    <div className={cn(
      "fixed inset-y-0 z-50 overflow-y-auto bg-background shadow-lg",
      side === "right" ? "right-0 border-l" : "left-0 border-r",
      "w-full max-w-md",
      className
    )}>
      {children}
    </div>
  )
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left p-6", className)}>{children}</div>
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
}
