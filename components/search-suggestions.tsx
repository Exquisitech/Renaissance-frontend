"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export interface SearchSuggestion {
  type: "player" | "team" | "recent" | "saved"
  label: string
  value: string
  icon?: React.ReactNode
}

export interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[]
  onSelect: (suggestion: SearchSuggestion) => void
  className?: string
}

export function SearchSuggestions({
  suggestions,
  onSelect,
  className,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div
      className={cn(
        "absolute z-50 w-full mt-1 max-h-96 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
    >
      <div className="p-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${suggestion.value}-${index}`}
            type="button"
            onClick={() => onSelect(suggestion)}
            className={cn(
              "relative flex w-full cursor-default select-none items-center gap-3 rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
              "text-left"
            )}
          >
            {suggestion.icon || <Search className="h-4 w-4" />}
            <div className="flex flex-col">
              <span className="font-medium">{suggestion.label}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {suggestion.type}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
