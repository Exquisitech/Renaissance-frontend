"use client";

import { cn } from "@/lib/utils";
import { RarityBadge, RARITY_CONFIG, type Rarity } from "./RarityBadge";

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
}: NFTCardProps) {
  const cfg = RARITY_CONFIG[rarity];

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
      <div className="flex items-center justify-between px-3 py-2">
        <span className="truncate text-sm font-medium">{name}</span>
        {price !== undefined && (
          <span className="ml-2 shrink-0 text-xs text-muted-foreground">
            {price} {currency}
          </span>
        )}
      </div>
    </div>
  );
}
