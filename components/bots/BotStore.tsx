"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BotCard, type Bot } from "./BotCard";

const BOTS: Bot[] = [
  { id: "1", name: "Trend Follower Pro", author: "0xAlpha", description: "Follows market momentum with configurable RSI and MACD signals.", rating: 4.7, installs: 1240, price: "free", tags: ["momentum", "trend"], sandboxAvailable: true },
  { id: "2", name: "Arbitrage Hunter", author: "0xBeta", description: "Detects price discrepancies across prediction pools for low-risk arb.", rating: 4.4, installs: 830, price: 50, tags: ["arbitrage", "low-risk"], sandboxAvailable: true },
  { id: "3", name: "Sentiment Oracle", author: "0xGamma", description: "Uses on-chain social signals to predict market movements.", rating: 4.1, installs: 560, price: 100, tags: ["sentiment", "AI"], sandboxAvailable: false },
  { id: "4", name: "Mean Reversion Bot", author: "0xDelta", description: "Bets against extreme moves, capitalising on reversion to mean.", rating: 3.9, installs: 410, price: "free", tags: ["mean-reversion", "statistical"], sandboxAvailable: true },
];

interface BotStoreProps {
  installed: Set<string>;
  onInstall: (id: string) => void;
  onConfigure: (id: string) => void;
}

export function BotStore({ installed, onInstall, onConfigure }: BotStoreProps) {
  const [search, setSearch] = useState("");
  const filtered = BOTS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.tags.some((t) => t.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search bots by name or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-transparent border-white/10 text-white"
        />
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-10">No bots match your search.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((bot) => (
          <BotCard
            key={bot.id}
            bot={{ ...bot, installed: installed.has(bot.id) }}
            onInstall={onInstall}
            onConfigure={onConfigure}
          />
        ))}
      </div>
    </div>
  );
}
