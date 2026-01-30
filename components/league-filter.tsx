"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LEAGUES } from "@/lib/mock-data";

export interface LeagueFilterProps {
  /**
   * Currently selected league
   */
  value: string;
  /**
   * Callback when league selection changes
   */
  onValueChange: (league: string) => void;
  /**
   * Display variant: 'tabs' for horizontal tabs or 'dropdown' for select menu
   * @default 'tabs'
   */
  variant?: "tabs" | "dropdown";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * League Filter Component
 * 
 * Allows filtering teams by league with two display variants:
 * - tabs: Horizontal scrollable tabs (default)
 * - dropdown: Compact dropdown select menu
 * 
 * @example
 * ```tsx
 * <LeagueFilter 
 *   value={selectedLeague} 
 *   onValueChange={setSelectedLeague}
 *   variant="tabs"
 * />
 * ```
 */
export function LeagueFilter({
  value,
  onValueChange,
  variant = "tabs",
  className,
}: LeagueFilterProps) {
  if (variant === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn(
            "w-full px-4 py-2 rounded-lg text-sm font-medium",
            "bg-transparent border border-white/10",
            "text-white focus:outline-none focus:ring-2 focus:ring-white/20",
            "hover:border-white/20 transition-colors",
            "cursor-pointer appearance-none bg-no-repeat bg-right pr-10",
            "dark:bg-transparent"
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundPosition: "right 0.75rem center",
          }}
        >
          {LEAGUES.map((league) => (
            <option key={league} value={league} className="bg-black text-white">
              {league}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Tabs variant (default)
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2 scrollbar-none", className)}>
      {LEAGUES.map((league) => (
        <button
          key={league}
          onClick={() => onValueChange(league)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            value === league
              ? "text-white"
              : "text-muted-foreground hover:text-white",
            league === "England" && "border border-white/20"
          )}
          aria-pressed={value === league}
          aria-label={`Filter by ${league}`}
        >
          {league}
        </button>
      ))}
    </div>
  );
}