"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectContextValue = {
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within Select")
  }
  return context
}

export interface SelectRootProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

export function Select({ value, onValueChange, children, ...props }: SelectRootProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (document.body.contains(target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, onOpenChange: setIsOpen }}>
      <div {...props}>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { isOpen, onOpenChange } = useSelectContext()

  return (
    <button
      type="button"
      onClick={() => onOpenChange(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
}

export function SelectValue({
  placeholder = "Select an option",
  ...props
}: { placeholder?: string } & React.HTMLAttributes<HTMLElement>) {
  const { value: ctxValue } = useSelectContext()
  return <span {...props}>{ctxValue || placeholder}</span>
}

export function SelectContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSelectContext()

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  const { value: ctxValue, onValueChange, onOpenChange } = useSelectContext()

  return (
    <div
      role="option"
      aria-selected={ctxValue === value}
      onClick={() => {
        onValueChange(value)
        onOpenChange(false)
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-3 pr-9 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        ctxValue === value && "bg-accent",
        className
      )}
      {...props}
    >
      {children}
      {ctxValue === value && (
        <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
    </div>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
