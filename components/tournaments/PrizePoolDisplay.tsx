"use client"

import { Tournament } from "@/lib/api/tournaments"
import { Trophy, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrizePoolDisplayProps {
    tournament: Tournament
}

const PLACE_ICONS: Record<string, React.ReactNode> = {
    "1st": <Trophy className="h-5 w-5 text-amber-500" />,
    "2nd": <Medal className="h-5 w-5 text-gray-400" />,
    "3rd": <Medal className="h-5 w-5 text-amber-700" />,
}

const PLACE_COLORS: Record<string, string> = {
    "1st": "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800",
    "2nd": "bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700",
    "3rd": "bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800",
}

export function PrizePoolDisplay({ tournament }: PrizePoolDisplayProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-r from-amber-500/10 to-primary/10 border border-amber-200/30">
                <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Total Prize Pool</div>
                    <div className="text-3xl font-extrabold mt-1">
                        {tournament.prizePool.toLocaleString()} <span className="text-lg text-muted-foreground">{tournament.currency}</span>
                    </div>
                </div>
                <Trophy className="h-12 w-12 text-amber-500 opacity-50" />
            </div>

            <div className="space-y-2">
                {tournament.prizes.map((prize, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-lg border",
                            PLACE_COLORS[prize.place] ?? "bg-muted border-muted-foreground/10"
                        )}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            {PLACE_ICONS[prize.place] ?? (
                                <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                    {idx + 1}
                                </div>
                            )}
                            <span className="font-bold text-sm">{prize.place} Place</span>
                        </div>
                        <div className="text-right">
                            <div className="font-bold">{prize.amount.toLocaleString()} {prize.currency}</div>
                            <div className="text-xs text-muted-foreground">{prize.percentage}% of pool</div>
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${prize.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
