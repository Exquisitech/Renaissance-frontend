"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Crown, 
  Star, 
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Zap
} from "lucide-react";
import { 
  canPrestige, 
  calculatePrestigeReset, 
  getPrestigeInfo,
  MAX_LEVEL 
} from "@/lib/api/nft";

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentPrestige: number;
  totalXP: number;
  onConfirm: () => void;
}

export function PrestigeModal({
  isOpen,
  onClose,
  currentLevel,
  currentPrestige,
  totalXP,
  onConfirm,
}: PrestigeModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canPrestigeNow = canPrestige(currentLevel);
  const prestigeResult = calculatePrestigeReset(totalXP, currentPrestige);
  const currentPrestigeInfo = getPrestigeInfo(currentPrestige);
  const nextPrestigeInfo = getPrestigeInfo(currentPrestige + 1);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onConfirm();
      setIsConfirmed(true);
      setTimeout(() => {
        onClose();
        setIsConfirmed(false);
      }, 2000);
    } catch (error) {
      console.error("Prestige failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-center">Prestige Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your NFT has been prestiged to {nextPrestigeInfo.icon} {nextPrestigeInfo.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200">
              <AlertDescription className="text-center">
                <p className="font-bold text-green-600">
                  Permanent Bonus: +{(nextPrestigeInfo.bonusMultiplier * 100 - 100).toFixed(0)}%
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-center">
            Prestige Your NFT
          </DialogTitle>
          <DialogDescription className="text-center">
            Reset your level for permanent bonuses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold">Current Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-xl font-bold">{currentLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl ${currentPrestigeInfo.color}`}>
                  {currentPrestigeInfo.icon}
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Prestige</p>
                  <p className="text-xl font-bold">{currentPrestigeInfo.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              After Prestige
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">New Prestige:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${nextPrestigeInfo.color}`}>
                    {nextPrestigeInfo.icon}
                  </span>
                  <span className="font-bold">{nextPrestigeInfo.title}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bonus Multiplier:</span>
                <span className="font-bold text-purple-600">
                  +{(nextPrestigeInfo.bonusMultiplier * 100 - 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Starting XP:</span>
                <span className="font-bold">{prestigeResult.bonusXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          {!canPrestigeNow && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You must reach max level ({MAX_LEVEL}) to prestige. 
                Current level: {currentLevel}/{MAX_LEVEL}
              </AlertDescription>
            </Alert>
          )}

          {canPrestigeNow && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> This will reset your level to 1 but keep {prestigeResult.bonusXP.toLocaleString()} XP as a starting bonus. 
                You'll gain permanent multipliers!
              </AlertDescription>
            </Alert>
          )}

          {/* Benefits */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Prestige Benefits
            </h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Permanent odds multiplier increase</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Enhanced spin bonuses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Exclusive prestige badge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Faster progression to max level</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canPrestigeNow || isProcessing}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            {isProcessing ? "Processing..." : "Confirm Prestige"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
