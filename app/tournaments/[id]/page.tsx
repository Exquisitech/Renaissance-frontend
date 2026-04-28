"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Tournament, tournamentAPI } from "@/lib/api/tournaments"
import { Header } from "@/components/header"
import { BracketTree } from "@/components/tournaments/BracketTree"
import { PrizePoolDisplay } from "@/components/tournaments/PrizePoolDisplay"
import { RegisterModal } from "@/components/tournaments/RegisterModal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarDays, Coins, Swords, Trophy } from "lucide-react"

export default function TournamentDetailPage() {
    const params = useParams<{ id: string }>()
    const [tournament, setTournament] = useState<Tournament | null>(null)
    const [loading, setLoading] = useState(true)
    const [registerOpen, setRegisterOpen] = useState(false)

    useEffect(() => {
        if (!params.id) return
        tournamentAPI.getTournamentById(params.id).then((data) => {
            setTournament(data ?? null)
            setLoading(false)
        })
    }, [params.id])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <div className="container mx-auto px-4 py-12 space-y-6">
                    <div className="h-10 w-64 bg-muted rounded-xl animate-pulse" />
                    <div className="h-48 bg-muted rounded-xl animate-pulse" />
                </div>
            </div>
        )
    }

    if (!tournament) return notFound()

    const STATUS_BADGE: Record<string, string> = {
        upcoming: "bg-blue-100 text-blue-800",
        active: "bg-green-100 text-green-800",
        completed: "bg-gray-100 text-gray-700",
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight">{tournament.name}</h1>
                            <Badge className={STATUS_BADGE[tournament.status]}>
                                {tournament.status === "active" ? "🟢 Live" : tournament.status === "upcoming" ? "🔜 Upcoming" : "✅ Completed"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{tournament.description}</p>
                    </div>
                    {tournament.status === "upcoming" && !tournament.isRegistered && (
                        <Button size="lg" onClick={() => setRegisterOpen(true)} className="shrink-0">
                            <Swords className="h-4 w-4 mr-2" />
                            Register — {tournament.entryFee} {tournament.currency}
                        </Button>
                    )}
                    {tournament.isRegistered && (
                        <Badge className="bg-primary text-primary-foreground text-sm px-4 py-2 shrink-0">
                            ✓ You're Registered
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <Trophy className="h-5 w-5 text-amber-500" />, label: "Prize Pool", value: `${tournament.prizePool.toLocaleString()} ${tournament.currency}` },
                        { icon: <Coins className="h-5 w-5 text-primary" />, label: "Entry Fee", value: `${tournament.entryFee} ${tournament.currency}` },
                        { icon: <Users className="h-5 w-5 text-blue-500" />, label: "Participants", value: `${tournament.currentParticipants} / ${tournament.maxParticipants}` },
                        { icon: <CalendarDays className="h-5 w-5 text-purple-500" />, label: "Start Date", value: new Date(tournament.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="flex items-center gap-3 pt-5">
                                {stat.icon}
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</p>
                                    <p className="font-bold text-sm">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="bracket">
                    <TabsList>
                        <TabsTrigger value="bracket">Bracket</TabsTrigger>
                        <TabsTrigger value="prizes">Prize Pool</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bracket" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tournament Bracket</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <BracketTree matches={tournament.bracket} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="prizes" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Prize Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <PrizePoolDisplay tournament={tournament} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <RegisterModal
                tournament={tournament}
                open={registerOpen}
                onClose={() => setRegisterOpen(false)}
                onSuccess={() => {
                    setTournament(prev => prev ? { ...prev, isRegistered: true } : null)
                }}
            />
        </div>
    )
}
