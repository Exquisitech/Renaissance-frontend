"use client"

import { BracketMatch, Participant } from "@/lib/api/tournaments"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

interface BracketTreeProps {
    matches: BracketMatch[]
}

function ParticipantSlot({ participant, isWinner }: { participant?: Participant; isWinner?: boolean }) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors",
                participant
                    ? isWinner
                        ? "bg-primary/10 border-primary/30 font-semibold"
                        : "bg-muted border-muted-foreground/10"
                    : "bg-muted/50 border-dashed border-muted-foreground/20 text-muted-foreground"
            )}
        >
            {isWinner && <Trophy className="h-3 w-3 text-amber-500 shrink-0" />}
            <span className="truncate max-w-[100px]">{participant?.username ?? "TBD"}</span>
            {participant && (
                <span className="ml-auto text-xs text-muted-foreground shrink-0">#{participant.seed}</span>
            )}
        </div>
    )
}

function MatchBox({ match }: { match: BracketMatch }) {
    return (
        <div className="flex flex-col gap-1 w-36 border rounded-lg p-2 bg-background shadow-sm hover:shadow-md transition-shadow">
            <ParticipantSlot
                participant={match.participant1}
                isWinner={match.winnerId === match.participant1?.id}
            />
            <div className="border-t border-dashed" />
            <ParticipantSlot
                participant={match.participant2}
                isWinner={match.winnerId === match.participant2?.id}
            />
            {match.score && (
                <div className="text-center text-xs text-muted-foreground mt-1 font-mono">
                    {match.score.p1} — {match.score.p2}
                </div>
            )}
        </div>
    )
}

export function BracketTree({ matches }: BracketTreeProps) {
    if (!matches || matches.length === 0) {
        return (
            <div className="flex items-center justify-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                Bracket is not available yet.
            </div>
        )
    }

    const rounds = Math.max(...matches.map((m) => m.round)) + 1
    const matchesByRound: BracketMatch[][] = []
    for (let r = 0; r < rounds; r++) {
        matchesByRound.push(matches.filter((m) => m.round === r).sort((a, b) => a.position - b.position))
    }

    const roundLabels = (round: number, total: number) => {
        if (round === total - 1) return "Final"
        if (round === total - 2) return "Semi-Final"
        if (round === total - 3) return "Quarter-Final"
        return `Round ${round + 1}`
    }

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-12 items-center min-w-max">
                {matchesByRound.map((roundMatches, roundIdx) => (
                    <div key={roundIdx} className="flex flex-col">
                        <div className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-1 border-b">
                            {roundLabels(roundIdx, rounds)}
                        </div>
                        <div
                            className="flex flex-col gap-6 justify-around"
                            style={{ minHeight: `${matchesByRound[0].length * 80}px` }}
                        >
                            {roundMatches.map((match) => (
                                <MatchBox key={match.id} match={match} />
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex flex-col">
                    <div className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-1 border-b">
                        Champion
                    </div>
                    <div className="flex flex-col items-center justify-center w-36 h-20 border-2 border-amber-400 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                        <Trophy className="h-8 w-8 text-amber-500 mb-1" />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Winner</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
