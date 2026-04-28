"use client"

import { Tournament } from "@/lib/api/tournaments"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, Coins, CalendarDays, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TournamentCardProps {
    tournament: Tournament
    onRegister?: (id: string) => void
}

const STATUS_CONFIG = {
    upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" },
    active: { label: "Live", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 animate-pulse" },
    completed: { label: "Completed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200" },
}

export function TournamentCard({ tournament, onRegister }: TournamentCardProps) {
    const status = STATUS_CONFIG[tournament.status]
    const spotsLeft = tournament.maxParticipants - tournament.currentParticipants
    const fillPercent = (tournament.currentParticipants / tournament.maxParticipants) * 100

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative h-36 bg-linear-to-br from-primary/20 via-muted to-muted/50 overflow-hidden">
                <img
                    src={tournament.imageUrl}
                    alt={tournament.name}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-primary/40" />
                </div>
                <div className="absolute top-3 left-3">
                    <Badge className={cn("border text-xs font-bold uppercase tracking-wide", status.className)}>
                        {status.label}
                    </Badge>
                </div>
                {tournament.isRegistered && (
                    <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                            Registered ✓
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight line-clamp-1">{tournament.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">{tournament.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-foreground">{tournament.prizePool.toLocaleString()} {tournament.currency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Coins className="h-4 w-4 text-primary shrink-0" />
                        <span><span className="font-semibold text-foreground">{tournament.entryFee}</span> {tournament.currency} entry</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span><span className="font-semibold text-foreground">{tournament.currentParticipants}</span>/{tournament.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>{new Date(tournament.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spots filled</span>
                        <span className={spotsLeft <= 5 ? "text-red-500 font-bold" : ""}>{spotsLeft} spots left</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all", fillPercent >= 90 ? "bg-red-500" : fillPercent >= 70 ? "bg-amber-500" : "bg-primary")}
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0 gap-2">
                <Button asChild variant="outline" className="flex-1">
                    <Link href={`/tournaments/${tournament.id}`}>
                        View Bracket <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                {tournament.status === "upcoming" && !tournament.isRegistered && (
                    <Button className="flex-1" onClick={() => onRegister?.(tournament.id)}>
                        Register
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
