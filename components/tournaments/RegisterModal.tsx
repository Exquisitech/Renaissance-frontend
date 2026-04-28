"use client"

import { useState } from "react"
import { Tournament, tournamentAPI } from "@/lib/api/tournaments"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Users, Trophy, Coins, AlertCircle, CheckCircle2 } from "lucide-react"

interface RegisterModalProps {
    tournament: Tournament | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function RegisterModal({ tournament, open, onClose, onSuccess }: RegisterModalProps) {
    const [agreed, setAgreed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleRegister = async () => {
        if (!tournament || !agreed) return
        setLoading(true)
        try {
            const res = await tournamentAPI.registerForTournament(tournament.id, "current-user")
            setResult(res)
            if (res.success) onSuccess?.()
        } catch {
            setResult({ success: false, message: "Registration failed. Please try again." })
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setAgreed(false)
        setResult(null)
        onClose()
    }

    if (!tournament) return null

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Register for Tournament</DialogTitle>
                    <DialogDescription className="text-base">{tournament.name}</DialogDescription>
                </DialogHeader>

                {result ? (
                    <div className={`flex flex-col items-center gap-4 py-6 text-center ${result.success ? "text-green-600" : "text-red-600"}`}>
                        {result.success
                            ? <CheckCircle2 className="h-14 w-14" />
                            : <AlertCircle className="h-14 w-14" />
                        }
                        <p className="text-lg font-semibold">{result.message}</p>
                        <Button onClick={handleClose} className="w-full">{result.success ? "Let's Go!" : "Close"}</Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                    <Coins className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Entry Fee</p>
                                        <p className="font-bold">{tournament.entryFee} {tournament.currency}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Prize Pool</p>
                                        <p className="font-bold">{tournament.prizePool.toLocaleString()} {tournament.currency}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted col-span-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Participants</p>
                                        <p className="font-bold">{tournament.currentParticipants} / {tournament.maxParticipants} registered</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-amber-50 dark:bg-amber-900/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                                ⚠️ The entry fee of <strong>{tournament.entryFee} {tournament.currency}</strong> will be deducted from your wallet balance.
                            </div>

                            <div className="flex items-start gap-3 pt-1">
                                <Checkbox
                                    id="agree"
                                    checked={agreed}
                                    onCheckedChange={(v) => setAgreed(v === true)}
                                    className="mt-0.5"
                                />
                                <Label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                                    I understand the entry fee is non-refundable and I agree to the tournament rules.
                                </Label>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
                            <Button onClick={handleRegister} disabled={!agreed || loading} className="min-w-24">
                                {loading ? "Processing..." : `Pay ${tournament.entryFee} ${tournament.currency}`}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
