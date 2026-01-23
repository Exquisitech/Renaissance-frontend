"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Home, Search, Settings, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/app/header"
import { usePlayerSearch } from "@/hooks/use-players-search"
import { useTeamSearch } from "@/hooks/use-teams-search"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("Rodri")
  const [activeTab, setActiveTab] = useState("players")
  const { players, isLoading: playersLoading } = usePlayerSearch(searchQuery)
  const { teams, isLoading: teamsLoading } = useTeamSearch(searchQuery)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-6">
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
            <h1 className="text-3xl font-bold">Search</h1>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="search"
                placeholder="Search players or clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button type="submit">Search</Button>
            </div>
          </div>

          <Tabs defaultValue="players" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="players">Players</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="players" className="space-y-4 mt-4">
              {playersLoading ? (
                <div className="text-center py-8 text-muted-foreground">Searching players...</div>
              ) : players.length > 0 ? (
                players.map((playerResult) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No players found" : "Start searching for players"}
                </div>
              )}
            </TabsContent>
            <TabsContent value="teams" className="space-y-4 mt-4">
              {teamsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Searching teams...</div>
              ) : teams.length > 0 ? (
                teams.map((team) => (
                  <Card key={team.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center md:items-start gap-2">
                          <img
                            src={team.crest || "/placeholder.svg"}
                            alt={team.name}
                            className="h-32 w-32 rounded-lg object-cover"
                          />
                          <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{team.name}</h2>
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-muted-foreground">Team information coming soon</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Team Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No teams found" : "Start searching for teams"}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
