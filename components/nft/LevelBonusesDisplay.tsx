"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  TrendingUp, 
  Trophy,
  Crown,
  Zap,
  ArrowRight
} from "lucide-react";
import { 
  getNFTLevelInfo, 
  getPrestigeInfo, 
  PRESTIGE_TIERS,
  MAX_LEVEL,
  calculateXPForLevel 
} from "@/lib/api/nft";

interface LevelBonusesDisplayProps {
  totalXP: number;
  prestigeLevel: number;
  className?: string;
}

export function LevelBonusesDisplay({
  totalXP,
  prestigeLevel,
  className,
}: LevelBonusesDisplayProps) {
  const levelInfo = getNFTLevelInfo(totalXP, prestigeLevel);
  const currentPrestige = getPrestigeInfo(prestigeLevel);
  const nextPrestige = prestigeLevel < PRESTIGE_TIERS.length - 1 
    ? getPrestigeInfo(prestigeLevel + 1) 
    : null;

  const xpForCurrentLevel = calculateXPForLevel(levelInfo.level);
  const progressPercent = levelInfo.isMaxLevel 
    ? 100 
    : (levelInfo.xpForCurrentLevel / (levelInfo.xpForCurrentLevel + levelInfo.xpToNextLevel)) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Level & Bonuses
        </CardTitle>
        <CardDescription>
          Your NFT progression and rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level Display */}
        <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-3xl font-bold">{levelInfo.level}</p>
              </div>
            </div>
            
            {levelInfo.isMaxLevel ? (
              <Badge className="bg-yellow-500 text-black font-bold">
                MAX LEVEL
              </Badge>
            ) : (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">XP Progress</p>
                <p className="text-lg font-bold">
                  {levelInfo.xpForCurrentLevel} / {levelInfo.xpForCurrentLevel + levelInfo.xpToNextLevel}
                </p>
              </div>
            )}
          </div>

          {/* XP Progress Bar */}
          {!levelInfo.isMaxLevel && (
            <div className="space-y-1">
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {progressPercent.toFixed(1)}% to Level {levelInfo.level + 1}
              </p>
            </div>
          )}
        </div>

        {/* Active Bonuses */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Active Bonuses</h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            {/* Odds Multiplier */}
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Odds Multiplier</p>
                <p className="text-2xl font-bold text-green-600">
                  {levelInfo.oddsMultiplier.toFixed(2)}x
                </p>
              </div>
            </div>

            {/* Spin Bonus */}
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Spin Bonus</p>
                <p className="text-2xl font-bold text-blue-600">
                  +{levelInfo.spinBonus.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Prestige Bonus */}
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Prestige Bonus</p>
                <p className="text-2xl font-bold text-purple-600">
                  +{(currentPrestige.bonusMultiplier * 100 - 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Total XP</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {levelInfo.xp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prestige Progress */}
        {nextPrestige && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Next Prestige</h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${currentPrestige.color}`}>
                    {currentPrestige.icon}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-2xl ${nextPrestige.color}`}>
                    {nextPrestige.icon}
                  </span>
                </div>
                <Badge variant="outline" className={nextPrestige.color}>
                  {nextPrestige.title}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {prestigeLevel + 1} / {PRESTIGE_TIERS.length - 1}
                  </span>
                </div>
                <Progress 
                  value={((prestigeLevel + 1) / (PRESTIGE_TIERS.length - 1)) * 100} 
                  className="h-2" 
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Reach max level ({MAX_LEVEL}) to prestige and earn a permanent bonus multiplier
              </p>
            </div>
          </div>
        )}

        {/* Prestige Tiers Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Prestige Tiers</h3>
          <div className="grid grid-cols-4 gap-2">
            {PRESTIGE_TIERS.map((tier) => (
              <div
                key={tier.level}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors ${
                  tier.level === prestigeLevel
                    ? "bg-primary/10 border-2 border-primary"
                    : tier.level < prestigeLevel
                    ? "bg-muted"
                    : "bg-muted/50"
                }`}
              >
                <span className={`text-2xl ${tier.color}`}>{tier.icon}</span>
                <span className="text-xs font-medium">{tier.title}</span>
                <span className="text-[10px] text-muted-foreground">
                  {tier.bonusMultiplier}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
