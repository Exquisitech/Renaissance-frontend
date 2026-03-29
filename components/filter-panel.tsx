"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X, Filter, RotateCcw } from "lucide-react"
import { FilterOptions } from "@/hooks/use-advanced-player-search"

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  availableFilters: {
    leagues: string[]
    nationalities: string[]
    positions: string[]
  }
  className?: string
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  availableFilters,
  className,
}: FilterPanelProps) {
  const hasActiveFilters = React.useMemo(() => {
    return Object.values(filters).some((value) => value !== undefined && value !== "")
  }, [filters])

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-6 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* League Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="league-filter">League</Label>
              {filters.league && (
                <button
                  onClick={() => clearFilter("league")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Select
              options={availableFilters.leagues.map((league) => ({
                value: league,
                label: league,
              }))}
              value={filters.league}
              onValueChange={(value) => updateFilter("league", value)}
              placeholder="All Leagues"
            />
          </div>

          {/* Nationality Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="nationality-filter">Nationality</Label>
              {filters.nationality && (
                <button
                  onClick={() => clearFilter("nationality")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Select
              options={availableFilters.nationalities.map((nat) => ({
                value: nat,
                label: nat,
              }))}
              value={filters.nationality}
              onValueChange={(value) => updateFilter("nationality", value)}
              placeholder="All Nationalities"
            />
          </div>

          {/* Position Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="position-filter">Position</Label>
              {filters.position && (
                <button
                  onClick={() => clearFilter("position")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Select
              options={availableFilters.positions.map((pos) => ({
                value: pos,
                label: pos,
              }))}
              value={filters.position}
              onValueChange={(value) => updateFilter("position", value)}
              placeholder="All Positions"
            />
          </div>
        </div>

        {/* Age Range Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Age Range</Label>
            {(filters.minAge !== undefined || filters.maxAge !== undefined) && (
              <button
                onClick={() => {
                  const newFilters = { ...filters }
                  delete newFilters.minAge
                  delete newFilters.maxAge
                  onFiltersChange(newFilters)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[filters.minAge || 16, filters.maxAge || 40]}
                min={16}
                max={40}
                step={1}
                onValueChange={(values) => {
                  updateFilter("minAge", values[0])
                  updateFilter("maxAge", values[1])
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>{filters.minAge || 16}</span>
              <span>-</span>
              <span>{filters.maxAge || 40}</span>
            </div>
          </div>
        </div>

        {/* Stats Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Minimum Goals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="goals-filter">Min Goals</Label>
              {filters.minGoals !== undefined && (
                <button
                  onClick={() => clearFilter("minGoals")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Input
              id="goals-filter"
              type="number"
              min="0"
              value={filters.minGoals || ""}
              onChange={(e) =>
                updateFilter("minGoals", e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="0"
            />
          </div>

          {/* Minimum Assists */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="assists-filter">Min Assists</Label>
              {filters.minAssists !== undefined && (
                <button
                  onClick={() => clearFilter("minAssists")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Input
              id="assists-filter"
              type="number"
              min="0"
              value={filters.minAssists || ""}
              onChange={(e) =>
                updateFilter("minAssists", e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
