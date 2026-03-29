"use client"

import { useState, useEffect, useCallback } from "react"
import { FilterOptions } from "./use-advanced-player-search"

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: FilterOptions
  createdAt: number
}

const STORAGE_KEY = "saved_searches"

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load saved searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSavedSearches(parsed)
      }
    } catch (error) {
      console.error("Error loading saved searches:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever savedSearches changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches))
      } catch (error) {
        console.error("Error saving searches:", error)
      }
    }
  }, [savedSearches, isLoading])

  const saveSearch = useCallback((name: string, query: string, filters: FilterOptions) => {
    const newSearch: SavedSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      query,
      filters,
      createdAt: Date.now(),
    }
    
    setSavedSearches((prev) => [...prev, newSearch])
    return newSearch
  }, [])

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== id))
  }, [])

  const updateSearch = useCallback((id: string, updates: Partial<SavedSearch>) => {
    setSavedSearches((prev) =>
      prev.map((search) => (search.id === id ? { ...search, ...updates } : search))
    )
  }, [])

  const clearAll = useCallback(() => {
    setSavedSearches([])
  }, [])

  return {
    savedSearches,
    isLoading,
    saveSearch,
    deleteSearch,
    updateSearch,
    clearAll,
  }
}
