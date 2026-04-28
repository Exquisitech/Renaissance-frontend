"use client"

import { useState } from "react"
import { socialAPI } from "@/lib/api/social"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlockUserModalProps {
    userId: string
    username: string
    isBlocked: boolean
    open: boolean
    onClose: () => void
    onSuccess?: (isBlocked: boolean) => void
}

export function BlockUserModal({ userId, username, isBlocked, open, onClose, onSuccess }: BlockUserModalProps) {
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const { toast } = useToast()

    const handleAction = async () => {
        setLoading(true)
        try {
            if (isBlocked) {
                await socialAPI.unblock(userId)
                toast({ title: `@${username} unblocked`, description: "They can now see your profile and interact with you." })
                onSuccess?.(false)
            } else {
                await socialAPI.block(userId)
                toast({ title: `@${username} blocked`, description: "They will no longer be able to interact with you." })
                onSuccess?.(true)
            }
            setDone(true)
        } catch {
            toast({ title: "Error", description: "Action failed. Please try again.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setDone(false)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-destructive" />
                        {isBlocked ? `Unblock @${username}` : `Block @${username}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isBlocked
                            ? `Unblocking @${username} will allow them to follow you and interact with your content again.`
                            : `Blocking @${username} will prevent them from seeing your profile, following you, or interacting with your content.`
                        }
                    </DialogDescription>
                </DialogHeader>

                {done ? (
                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <p className="font-semibold">{isBlocked ? "User unblocked" : "User blocked"} successfully.</p>
                        <Button onClick={handleClose} className="w-full">Done</Button>
                    </div>
                ) : (
                    <>
                        {!isBlocked && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                This action will also automatically unfollow @{username}.
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
                            <Button variant="destructive" onClick={handleAction} disabled={loading}>
                                {loading ? "Processing..." : isBlocked ? "Unblock" : "Block User"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
