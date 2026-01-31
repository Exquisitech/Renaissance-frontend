"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RenaissanceLogo } from "@/components/renaissance-logo"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Sample data for teams
const leagues = [
    {
        id: 1,
        name: "Premier League",
        country: "England",
        teams: [
            { id: 101, name: "Arsenal", logo: "/placeholder.svg?height=40&width=40" },
            { id: 102, name: "Chelsea", logo: "/placeholder.svg?height=40&width=40" },
            { id: 103, name: "Liverpool", logo: "/placeholder.svg?height=40&width=40" },
            { id: 104, name: "Manchester City", logo: "/placeholder.svg?height=40&width=40" },
            { id: 105, name: "Manchester United", logo: "/placeholder.svg?height=40&width=40" },
            { id: 106, name: "Tottenham Hotspur", logo: "/placeholder.svg?height=40&width=40" },
        ],
    },
    {
        id: 2,
        name: "La Liga",
        country: "Spain",
        teams: [
            { id: 201, name: "Atletico Madrid", logo: "/placeholder.svg?height=40&width=40" },
            { id: 202, name: "Barcelona", logo: "/placeholder.svg?height=40&width=40" },
            { id: 203, name: "Real Madrid", logo: "/placeholder.svg?height=40&width=40" },
            { id: 204, name: "Sevilla", logo: "/placeholder.svg?height=40&width=40" },
            { id: 205, name: "Valencia", logo: "/placeholder.svg?height=40&width=40" },
            { id: 206, name: "Villarreal", logo: "/placeholder.svg?height=40&width=40" },
        ],
    },
    {
        id: 3,
        name: "Serie A",
        country: "Italy",
        teams: [
            { id: 301, name: "AC Milan", logo: "/placeholder.svg?height=40&width=40" },
            { id: 302, name: "AS Roma", logo: "/placeholder.svg?height=40&width=40" },
            { id: 303, name: "Inter Milan", logo: "/placeholder.svg?height=40&width=40" },
            { id: 304, name: "Juventus", logo: "/placeholder.svg?height=40&width=40" },
            { id: 305, name: "Napoli", logo: "/placeholder.svg?height=40&width=40" },
            { id: 306, name: "Lazio", logo: "/placeholder.svg?height=40&width=40" },
        ],
    },
    {
        id: 4,
        name: "Bundesliga",
        country: "Germany",
        teams: [
            { id: 401, name: "Bayern Munich", logo: "/placeholder.svg?height=40&width=40" },
            { id: 402, name: "Borussia Dortmund", logo: "/placeholder.svg?height=40&width=40" },
            { id: 403, name: "RB Leipzig", logo: "/placeholder.svg?height=40&width=40" },
            { id: 404, name: "Bayer Leverkusen", logo: "/placeholder.svg?height=40&width=40" },
            { id: 405, name: "Eintracht Frankfurt", logo: "/placeholder.svg?height=40&width=40" },
            { id: 406, name: "Borussia Mönchengladbach", logo: "/placeholder.svg?height=40&width=40" },
        ],
    },
]

export default function SelectTeamsPage() {
    const router = useRouter()
    const [selectedTeams, setSelectedTeams] = useState<{ id: number; name: string; league: string }[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const handleTeamSelect = (teamId: number, teamName: string, leagueName: string) => {
        // Check if team is already selected
        if (selectedTeams.some((team) => team.id === teamId)) {
            setSelectedTeams(selectedTeams.filter((team) => team.id !== teamId))
            return
        }

        // Check if we already have 3 teams
        if (selectedTeams.length >= 3) {
            alert("You can only select up to 3 teams")
            return
        }

        // Check if we already have a team from this league
        if (selectedTeams.some((team) => team.league === leagueName)) {
            alert("You can only select one team per league")
            return
        }

        // Add the team
        setSelectedTeams([...selectedTeams, { id: teamId, name: teamName, league: leagueName }])
    }

    const handleContinue = async () => {
        if (selectedTeams.length > 0) {
            try {
                // In a real implementation, this would call the Stellar/Soroban smart contract
                // to register the user's team selections on the blockchain
                const response = await fetch("/api/stellar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "select_teams",
                        teams: selectedTeams.map((t) => t.id),
                    }),
                })

                if (response.ok) {
                    router.push("/dashboard")
                }
            } catch (error) {
                console.error("Error saving team selection:", error)
                // Still proceed even if there's an error
                router.push("/dashboard")
            }
        }
    }

    const filteredLeagues = leagues
        .map((league) => {
            const filteredTeams = league.teams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
            return {
                ...league,
                teams: filteredTeams,
            }
        })
        .filter((league) => league.teams.length > 0)

    return (
        <div className="container flex min-h-screen w-full flex-col items-center justify-center py-10 mx-auto px-4">
            <Link href="/" className="fixed left-4 top-4 md:left-8 md:top-8">
                <Button variant="ghost" className="flex items-center gap-2">
                    <RenaissanceLogo className="h-6 w-6" />
                    <span className="font-bold">Renaissance</span>
                </Button>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-4xl">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Select Your Teams</h1>
                    <p className="text-sm text-muted-foreground">Choose up to 3 teams from different leagues to follow</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Available Teams</CardTitle>
                            <CardDescription>Search and select your favorite teams</CardDescription>
                            <div className="relative mt-2">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search teams..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] pr-4">
                                {filteredLeagues.map((league) => (
                                    <div key={league.id} className="mb-6">
                                        <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
                                            {league.name}
                                            <Badge variant="outline">{league.country}</Badge>
                                        </h3>
                                        <div className="space-y-2">
                                            {league.teams.map((team) => (
                                                <div
                                                    key={team.id}
                                                    className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted",
                                                        selectedTeams.some((t) => t.id === team.id) ? "bg-muted" : ""
                                                    )}
                                                    onClick={() => handleTeamSelect(team.id, team.name, league.name)}
                                                >
                                                    <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-8 h-8 rounded-full" />
                                                    <span>{team.name}</span>
                                                    {selectedTeams.some((t) => t.id === team.id) && <Badge className="ml-auto">Selected</Badge>}
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="my-4" />
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="w-full md:w-80">
                        <CardHeader>
                            <CardTitle>Selected Teams</CardTitle>
                            <CardDescription>{selectedTeams.length}/3 teams selected</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedTeams.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No teams selected yet</div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedTeams.map((team) => (
                                        <div key={team.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        leagues.flatMap((l) => l.teams).find((t) => t.id === team.id)?.logo || "/placeholder.svg"
                                                    }
                                                    alt={team.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <p className="font-medium">{team.name}</p>
                                                    <p className="text-xs text-muted-foreground">{team.league}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedTeams(selectedTeams.filter((t) => t.id !== team.id))}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleContinue} disabled={selectedTeams.length === 0}>
                                Continue
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
