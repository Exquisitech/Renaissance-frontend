"use client";

import { BotCard, type Bot } from "./BotCard";

const ALL_BOTS: Bot[] = [
  { id: "1", name: "Trend Follower Pro", author: "0xAlpha", description: "Follows market momentum.", rating: 4.7, installs: 1240, price: "free", tags: ["momentum"], sandboxAvailable: true },
  { id: "2", name: "Arbitrage Hunter", author: "0xBeta", description: "Detects price discrepancies.", rating: 4.4, installs: 830, price: 50, tags: ["arbitrage"], sandboxAvailable: true },
];

interface MyBotsProps {
  installed: Set<string>;
  onConfigure: (id: string) => void;
  onUninstall: (id: string) => void;
}

export function MyBots({ installed, onConfigure, onUninstall }: MyBotsProps) {
  const myBots = ALL_BOTS.filter((b) => installed.has(b.id));

  if (myBots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-4xl">🤖</p>
        <p className="text-white font-semibold">No bots installed yet</p>
        <p className="text-gray-400 text-sm">Browse the marketplace to find and install trading bots.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {myBots.map((bot) => (
        <BotCard
          key={bot.id}
          bot={{ ...bot, installed: true }}
          onConfigure={onConfigure}
          onInstall={onUninstall}
        />
      ))}
    </div>
  );
}
