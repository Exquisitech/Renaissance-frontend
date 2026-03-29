"use client"

import { useState, useMemo, useCallback } from "react"
import { usePlayerSearch, PlayerResult } from "./use-player-search"

export type SortField = "name" | "age" | "goals" | "assists" | "appearances"
export type SortOrder = "asc" | "desc"

export interface FilterOptions {
  league?: string
  nationality?: string
  position?: string
  minAge?: number
  maxAge?: number
  minGoals?: number
  minAssists?: number
}

export interface AdvancedPlayerSearchResult {
  players: PlayerResult[]
  isLoading: boolean
  isError: boolean
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  resetFilters: () => void
  sortField: SortField
  sortOrder: SortOrder
  setSort: (field: SortField, order?: SortOrder) => void
  availableFilters: {
    leagues: string[]
    nationalities: string[]
    positions: string[]
  }
}

export function useAdvancedPlayerSearch(
  query: string,
  initialFilters?: FilterOptions
): AdvancedPlayerSearchResult {
  const [filters, setFiltersState] = useState<FilterOptions>(initialFilters || {})
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  
  const { players, isLoading, isError } = usePlayerSearch(query)

  // Extract available filters from results
  const availableFilters = useMemo(() => {
    const leagues = new Set<string>()
    const nationalities = new Set<string>()
    const positions = new Set<string>()

    players.forEach((player) => {
      nationalities.add(player.player.nationality)
      
      player.statistics?.forEach((stat) => {
        leagues.add(stat.league.name)
        if (stat.games?.position) {
          positions.add(stat.games.position)
        }
      })
    })

    return {
      leagues: Array.from(leagues).sort(),
      nationalities: Array.from(nationalities).sort(),
      positions: Array.from(positions).sort(),
    }
  }, [players])

  // Filter and sort players
  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...players]

    // Apply filters
    if (filters.league) {
      result = result.filter((player) =>
        player.statistics?.some((stat) => stat.league.name === filters.league)
      )
    }

    if (filters.nationality) {
      result = result.filter(
        (player) => player.player.nationality === filters.nationality
      )
    }

    if (filters.position) {
      result = result.filter((player) =>
        player.statistics?.some((stat) => stat.games?.position === filters.position)
      )
    }

    if (filters.minAge !== undefined) {
      result = result.filter((player) => player.player.age >= (filters.minAge || 0))
    }

    if (filters.maxAge !== undefined) {
      result = result.filter((player) => player.player.age <= (filters.maxAge || 150))
    }

    if (filters.minGoals !== undefined) {
      result = result.filter((player) => {
        const totalGoals = player.statistics?.reduce(
          (sum, stat) => sum + (stat.goals?.total || 0),
          0
        )
        return (totalGoals || 0) >= (filters.minGoals || 0)
      })
    }

    if (filters.minAssists !== undefined) {
      result = result.filter((player) => {
        const totalAssists = player.statistics?.reduce(
          (sum, stat) => sum + (stat.goals?.assists || 0),
          0
        )
        return (totalAssists || 0) >= (filters.minAssists || 0)
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "name":
          comparison = a.player.name.localeCompare(b.player.name)
          break
        case "age":
          comparison = a.player.age - b.player.age
          break
        case "goals":
          const aGoals = a.statistics?.reduce((sum, stat) => sum + (stat.goals?.total || 0), 0) || 0
          const bGoals = b.statistics?.reduce((sum, stat) => sum + (stat.goals?.total || 0), 0) || 0
          comparison = aGoals - bGoals
          break
        case "assists":
          const aAssists = a.statistics?.reduce((sum, stat) => sum + (stat.goals?.assists || 0), 0) || 0
          const bAssists = b.statistics?.reduce((sum, stat) => sum + (stat.goals?.assists || 0), 0) || 0
          comparison = aAssists - bAssists
          break
        case "appearances":
          const aAppearances = a.statistics?.reduce((sum, stat) => sum + (stat.games?.appearences || 0), 0) || 0
          const bAppearances = b.statistics?.reduce((sum, stat) => sum + (stat.games?.appearences || 0), 0) || 0
          comparison = aAppearances - bAppearances
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [players, filters, sortField, sortOrder])

  const setFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState({})
  }, [])

  const setSort = useCallback((field: SortField, order?: SortOrder) => {
    setSortField(field)
    if (order) {
      setSortOrder(order)
    } else {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    }
  }, [])

  return {
    players: filteredAndSortedPlayers,
    isLoading,
    isError,
    filters,
    setFilters,
    resetFilters,
    sortField,
    sortOrder,
    setSort,
    availableFilters,
  }
}
