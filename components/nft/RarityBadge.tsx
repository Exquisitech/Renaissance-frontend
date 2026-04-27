"use client";

import { cn } from "@/lib/utils";

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

interface RarityConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  ring: string;
}

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  Common: {
    label: "Common",
    bg: "bg-gray-500/20",
    text: "text-gray-300",
    border: "border-gray-500",
    ring: "ring-gray-500",
  },
  Rare: {
    label: "Rare",
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500",
    ring: "ring-blue-500",
  },
  Epic: {
    label: "Epic",
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    border: "border-purple-500",
    ring: "ring-purple-500",
  },
  Legendary: {
    label: "Legendary",
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
    border: "border-yellow-500",
    ring: "ring-yellow-400",
  },
};

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
  size?: "sm" | "md";
}

export function RarityBadge({ rarity, className, size = "sm" }: RarityBadgeProps) {
  const cfg = RARITY_CONFIG[rarity];
  return (
    <span
      data-testid="rarity-badge"
      aria-label={`Rarity: ${cfg.label}`}
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        cfg.bg,
        cfg.text,
        cfg.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
