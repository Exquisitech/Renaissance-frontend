"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Home, Search, Settings, User, SlidersHorizontal, BookmarkPlus, SortAsc, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/app/header"
import { useAdvancedPlayerSearch, FilterOptions, SortField } from "@/hooks/use-advanced-player-search"
import { useSavedSearches } from "@/hooks/use-saved-searches"
import { FilterPanel } from "@/components/filter-panel"
import { SavedSearchesPanel } from "@/components/saved-searches-panel"
import { QuickFilters } from "@/components/saved-searches-panel"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [activeTab, setActiveTab] = useState("players")
  const [showFilters, setShowFilters] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { 
    players, 
    isLoading, 
    isError,
    filters, 
    setFilters, 
    resetFilters,
    sortField, 
    sortOrder, 
    setSort,
    availableFilters 
  } = useAdvancedPlayerSearch(debouncedQuery)

  const { saveSearch } = useSavedSearches()

  const handleSaveSearch = () => {
    if (saveName.trim()) {
      saveSearch(saveName.trim(), debouncedQuery, filters)
      setSaveName("")
      setShowSaveDialog(false)
    }
  }

  const handleApplySavedSearch = useCallback((query: string, savedFilters: FilterOptions) => {
    setSearchQuery(query)
    setFilters(savedFilters)
    setShowSavedSearches(false)
  }, [setFilters])

  const handleQuickFilter = useCallback((presetFilters: FilterOptions) => {
    setFilters(presetFilters)
  }, [setFilters])

  const getSortLabel = (field: SortField) => {
    if (sortField !== field) return field.charAt(0).toUpperCase() + field.slice(1)
    return `${field.charAt(0).toUpperCase() + field.slice(1)} ${sortOrder === "asc" ? "↑" : "↓"}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container grid flex-1 gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-6">
        <aside className="hidden md:block">
          <nav className="grid items-start gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Matches
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" className="w-full justify-start gap-2 bg-muted">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>

            <Separator className="my-4" />

            <div className="px-3 py-2">
              <h3 className="mb-2 text-sm font-medium">Your Teams</h3>
              <div className="space-y-2">
                <Link
                  href="/team/arsenal"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img src="/placeholder.svg?height=24&width=24" alt="Arsenal" className="h-6 w-6 rounded-full" />
                  Arsenal
                </Link>
                <Link
                  href="/team/barcelona"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img src="/placeholder.svg?height=24&width=24" alt="Barcelona" className="h-6 w-6 rounded-full" />
                  Barcelona
                </Link>
                <Link
                  href="/team/juventus"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img src="/placeholder.svg?height=24&width=24" alt="Juventus" className="h-6 w-6 rounded-full" />
                  Juventus
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Search</h1>
              <div className="flex gap-2">
                {/* Desktop Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn("hidden md:flex", showFilters ? "bg-accent" : "")}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                  className={cn("hidden md:flex", showSavedSearches ? "bg-accent" : "")}
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Saved
                </Button>
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Bar with Suggestions */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search players or clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 max-w-md mx-auto">
                  <div className="rounded-md border bg-popover p-2 text-sm text-muted-foreground">
                    {isLoading ? "Searching..." : `${players.length} results found`}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Filters */}
            <QuickFilters onSelectPreset={handleQuickFilter} />
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              availableFilters={availableFilters}
              className="animate-in slide-in-from-top-2"
            />
          )}

          {/* Saved Searches Panel */}
          {showSavedSearches && (
            <Card className="animate-in slide-in-from-top-2">
              <CardContent className="p-0">
                <SavedSearchesPanel onApplySearch={handleApplySavedSearch} />
              </CardContent>
            </Card>
          )}

          {/* Save Search Dialog */}
          {showSaveDialog && (
            <Card className="animate-in fade-in zoom-in">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Save Current Search</h3>
                <Input
                  placeholder="Enter a name for this search"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveSearch()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveSearch}>Save</Button>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="players" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
              </TabsList>

              {activeTab === "players" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSort("name")}
                    className="text-xs"
                  >
                    {getSortLabel("name")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSort("goals")}
                    className="text-xs"
                  >
                    {getSortLabel("goals")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSort("age")}
                    className="text-xs"
                  >
                    {getSortLabel("age")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={!debouncedQuery}
                    className="text-xs gap-2"
                  >
                    <BookmarkPlus className="h-3 w-3" />
                    Save Search
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="players" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Searching players...</div>
              ) : isError ? (
                <div className="text-center py-8 text-destructive">Error loading players</div>
              ) : players.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-4 pr-4">
                    {players.map((playerResult) => (
                      <Card key={playerResult.player.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center md:items-start gap-2">
                              <img
                                src={playerResult.player.photo || "/placeholder.svg"}
                                alt={playerResult.player.name}
                                className="h-32 w-32 rounded-lg object-cover"
                              />
                              <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold">{playerResult.player.name}</h2>
                                {playerResult.statistics?.[0] && (
                                  <p className="text-muted-foreground">{playerResult.statistics[0].team.name}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Player Info</h3>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Age:</span>
                                    <span>{playerResult.player.age}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nationality:</span>
                                    <span>{playerResult.player.nationality}</span>
                                  </div>
                                  {playerResult.statistics?.[0] && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Position:</span>
                                        <span>{playerResult.statistics[0].games?.position}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Appearances:</span>
                                        <span>{playerResult.statistics[0].games?.appearences}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {playerResult.statistics?.[0] && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">Season Stats</h3>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Goals:</span>
                                      <span>{playerResult.statistics[0].goals?.total || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Assists:</span>
                                      <span>{playerResult.statistics[0].goals?.assists || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Pass Accuracy:</span>
                                      <span>{playerResult.statistics[0].passes?.accuracy || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Tackles:</span>
                                      <span>{playerResult.statistics[0].tackles?.total || 0}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full bg-transparent">
                            View Full Profile
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {debouncedQuery ? "No players found" : "Start searching for players"}
                </div>
              )}
            </TabsContent>

            <TabsContent value="teams" className="space-y-4 mt-4">
              <div className="text-center py-8 text-muted-foreground">
                Team search coming soon
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
