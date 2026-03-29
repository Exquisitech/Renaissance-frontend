"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, Trash2, Clock, Zap, Star } from "lucide-react"
import { SavedSearch, useSavedSearches } from "@/hooks/use-saved-searches"
import { FilterOptions } from "@/hooks/use-advanced-player-search"

interface SavedSearchesPanelProps {
  onApplySearch: (query: string, filters: FilterOptions) => void
  className?: string
}

export function SavedSearchesPanel({ onApplySearch, className }: SavedSearchesPanelProps) {
  const { savedSearches, deleteSearch, isLoading } = useSavedSearches()

  if (isLoading) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Loading saved searches...
      </div>
    )
  }

  if (savedSearches.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No saved searches yet</p>
        <p className="text-sm">Save your favorite search combinations for quick access</p>
      </div>
    )
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="space-y-2 p-4">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-start justify-between gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onApplySearch(search.query, search.filters)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <h4 className="font-medium text-sm">{search.name}</h4>
              </div>
              {search.query && (
                <p className="text-xs text-muted-foreground mb-1">"{search.query}"</p>
              )}
              <div className="flex flex-wrap gap-1">
                {Object.entries(search.filters).map(([key, value]) => {
                  if (value === undefined || value === "") return null
                  return (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {String(value)}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteSearch(search.id)}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

interface QuickFiltersProps {
  onSelectPreset: (preset: FilterOptions) => void
  className?: string
}

const PRESET_FILTERS: { name: string; icon: React.ReactNode; filters: FilterOptions }[] = [
  {
    name: "Top Scorers",
    icon: <Zap className="h-4 w-4" />,
    filters: { minGoals: 10 },
  },
  {
    name: "Young Talents",
    icon: <Star className="h-4 w-4" />,
    filters: { maxAge: 23 },
  },
  {
    name: "Recent Searches",
    icon: <Clock className="h-4 w-4" />,
    filters: {},
  },
]

export function QuickFilters({ onSelectPreset, className }: QuickFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {PRESET_FILTERS.map((preset) => (
        <Button
          key={preset.name}
          variant="outline"
          size="sm"
          onClick={() => onSelectPreset(preset.filters)}
          className="gap-2"
        >
          {preset.icon}
          {preset.name}
        </Button>
      ))}
    </div>
  )
}

interface FilterPresetsProps {
  onLoadPreset: (name: string, filters: FilterOptions) => void
  className?: string
}

const COMMON_PRESETS: { name: string; filters: FilterOptions }[] = [
  {
    name: "Premier League Stars",
    filters: { league: "Premier League", minGoals: 5 },
  },
  {
    name: "La Liga Top Performers",
    filters: { league: "La Liga", minAssists: 5 },
  },
  {
    name: "Bundesliga Young Guns",
    filters: { league: "Bundesliga", maxAge: 25 },
  },
  {
    name: "Serie A Defenders",
    filters: { league: "Serie A", position: "Defender" },
  },
]

export function FilterPresets({ onLoadPreset, className }: FilterPresetsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {COMMON_PRESETS.map((preset) => (
        <Button
          key={preset.name}
          variant="outline"
          size="sm"
          onClick={() => onLoadPreset(preset.name, preset.filters)}
          className="h-auto py-2 px-3 text-xs flex flex-col items-start gap-1"
        >
          <span className="font-medium">{preset.name}</span>
          <div className="flex gap-1">
            {Object.entries(preset.filters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-[10px]">
                {key}: {String(value)}
              </Badge>
            ))}
          </div>
        </Button>
      ))}
    </div>
  )
}
