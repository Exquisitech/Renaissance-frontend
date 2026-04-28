"use client";

import { useState } from "react";
import { BotStore } from "@/components/bots/BotStore";
import { MyBots } from "@/components/bots/MyBots";
import { BotConfiguration } from "@/components/bots/BotConfiguration";

type Tab = "Store" | "My Bots";

export default function BotsPage() {
  const [tab, setTab] = useState<Tab>("Store");
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [configuring, setConfiguring] = useState<{ id: string; name: string } | null>(null);

  const handleInstall = (id: string) => setInstalled((s) => new Set([...s, id]));
  const handleUninstall = (id: string) => setInstalled((s) => { const n = new Set(s); n.delete(id); return n; });

  const BOT_NAMES: Record<string, string> = {
    "1": "Trend Follower Pro",
    "2": "Arbitrage Hunter",
    "3": "Sentiment Oracle",
    "4": "Mean Reversion Bot",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trading Bots Marketplace</h1>
        <p className="text-sm text-gray-400">Browse, install, and configure automated prediction bots.</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-white/5 p-1 w-fit">
        {(["Store", "My Bots"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            {t}
            {t === "My Bots" && installed.size > 0 && (
              <span className="ml-1.5 rounded-full bg-blue-500/30 text-blue-300 text-xs px-1.5">{installed.size}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "Store" ? (
        <BotStore
          installed={installed}
          onInstall={handleInstall}
          onConfigure={(id) => setConfiguring({ id, name: BOT_NAMES[id] ?? id })}
        />
      ) : (
        <MyBots
          installed={installed}
          onConfigure={(id) => setConfiguring({ id, name: BOT_NAMES[id] ?? id })}
          onUninstall={handleUninstall}
        />
      )}

      {configuring && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <BotConfiguration
            botId={configuring.id}
            botName={configuring.name}
            onClose={() => setConfiguring(null)}
          />
        </div>
      )}
    </div>
  );
}
