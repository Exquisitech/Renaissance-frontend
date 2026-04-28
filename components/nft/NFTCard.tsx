"use client";

import { cn } from "@/lib/utils";
import { RarityBadge, RARITY_CONFIG, type Rarity } from "./RarityBadge";
import { getNFTLevelInfo, getPrestigeInfo } from "@/lib/api/nft";
import { Star, TrendingUp, Trophy } from "lucide-react";

export interface NFTCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  rarity: Rarity;
  /** Multiplier applied to spin-game winnings */
  spinMultiplier?: number;
  price?: number;
  currency?: string;
  className?: string;
  onClick?: () => void;
  /** XP and leveling props */
  totalXP?: number;
  prestigeLevel?: number;
  showLevelInfo?: boolean;
}

export function NFTCard({
  id,
  name,
  imageUrl,
  rarity,
  spinMultiplier,
  price,
  currency = "XLM",
  className,
  onClick,
  totalXP = 0,
  prestigeLevel = 0,
  showLevelInfo = true,
}: NFTCardProps) {
  const cfg = RARITY_CONFIG[rarity];
  const levelInfo = showLevelInfo ? getNFTLevelInfo(totalXP, prestigeLevel) : null;
  const prestigeInfo = levelInfo ? getPrestigeInfo(prestigeLevel) : null;
  
  const xpProgress = levelInfo && !levelInfo.isMaxLevel
    ? (levelInfo.xpForCurrentLevel / (levelInfo.xpForCurrentLevel + levelInfo.xpToNextLevel)) * 100
    : 100;

  return (
    <div
      data-testid="nft-card"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`NFT: ${name}, ${rarity}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "relative flex flex-col rounded-xl border-2 overflow-hidden bg-card shadow-sm transition-transform duration-150",
        cfg.border,
        `ring-1 ${cfg.ring}`,
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {/* Card image */}
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {/* Rarity badge overlay */}
        <div className="absolute top-2 left-2">
          <RarityBadge rarity={rarity} size="sm" />
        </div>

        {/* Spin multiplier badge */}
        {spinMultiplier !== undefined && (
          <div
            data-testid="spin-multiplier"
            className={cn(
              "absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold border",
              cfg.bg,
              cfg.text,
              cfg.border
            )}
          >
            {spinMultiplier}× spin
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="flex flex-col px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{name}</span>
          {price !== undefined && (
            <span className="ml-2 shrink-0 text-xs text-muted-foreground">
              {price} {currency}
            </span>
          )}
        </div>

        {/* Level and XP Display */}
        {showLevelInfo && levelInfo && (
          <div className="space-y-1.5">
            {/* Level Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-xs font-bold">Level {levelInfo.level}</span>
                {prestigeInfo && prestigeLevel > 0 && (
                  <span className={`text-xs font-semibold ${prestigeInfo.color}`}>
                    {prestigeInfo.icon} {prestigeInfo.title}
                  </span>
                )}
              </div>
              
              {levelInfo.isMaxLevel ? (
                <span className="text-[10px] font-bold text-yellow-500">MAX LEVEL</span>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  {levelInfo.xpForCurrentLevel}/{levelInfo.xpForCurrentLevel + levelInfo.xpToNextLevel} XP
                </span>
              )}
            </div>

            {/* XP Progress Bar */}
            {!levelInfo.isMaxLevel && (
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            )}

            {/* Level Bonuses */}
            <div className="flex items-center gap-2 text-[10px]">
              <div className="flex items-center gap-0.5 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Odds: {levelInfo.oddsMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex items-center gap-0.5 text-blue-600">
                <Trophy className="h-3 w-3" />
                <span>Spin: +{levelInfo.spinBonus.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
