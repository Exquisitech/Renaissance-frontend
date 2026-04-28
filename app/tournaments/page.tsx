"use client"

import { useEffect, useState } from "react"
import { Tournament, tournamentAPI } from "@/lib/api/tournaments"
import { TournamentCard } from "@/components/tournaments/TournamentCard"
import { RegisterModal } from "@/components/tournaments/RegisterModal"
import { Header } from "@/components/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Swords } from "lucide-react"

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "active" | "completed">("all")
    const [registerTarget, setRegisterTarget] = useState<Tournament | null>(null)

    useEffect(() => {
        tournamentAPI.getTournaments().then((data) => {
            setTournaments(data)
            setLoading(false)
        })
    }, [])

    const filtered = statusFilter === "all"
        ? tournaments
        : tournaments.filter((t) => t.status === statusFilter)

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 space-y-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-muted">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-3 text-primary">
                            <Swords className="h-8 w-8" />
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Tournaments</h1>
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Compete in prediction and fantasy football tournaments. Stake STRK, climb the bracket, and win big.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {[
                            { label: "Active", value: tournaments.filter(t => t.status === "active").length, color: "text-green-500" },
                            { label: "Upcoming", value: tournaments.filter(t => t.status === "upcoming").length, color: "text-blue-500" },
                        ].map(stat => (
                            <div key={stat.label} className="bg-muted rounded-xl px-5 py-3 text-center border">
                                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v as any)}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Live</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />)}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(t => (
                            <TournamentCard
                                key={t.id}
                                tournament={t}
                                onRegister={(id) => setRegisterTarget(tournaments.find(x => x.id === id) ?? null)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                        <Swords className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold">No tournaments found</h3>
                        <p className="text-muted-foreground">Check back soon for new tournaments.</p>
                    </div>
                )}
            </main>

            <RegisterModal
                tournament={registerTarget}
                open={!!registerTarget}
                onClose={() => setRegisterTarget(null)}
                onSuccess={() => {
                    setTournaments(prev => prev.map(t =>
                        t.id === registerTarget?.id ? { ...t, isRegistered: true } : t
                    ))
                }}
            />
        </div>
    )
}
