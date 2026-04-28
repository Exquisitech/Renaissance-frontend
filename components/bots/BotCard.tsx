"use client";

import { Star, Download, Zap, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Bot {
  id: string;
  name: string;
  author: string;
  description: string;
  rating: number;
  installs: number;
  price: "free" | number;
  tags: string[];
  sandboxAvailable: boolean;
  installed?: boolean;
}

interface BotCardProps {
  bot: Bot;
  onInstall?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export function BotCard({ bot, onInstall, onConfigure }: BotCardProps) {
  const priceLabel = bot.price === "free" ? "Free" : `${bot.price} RENS`;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 hover:border-blue-500/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{bot.name}</p>
            <p className="text-xs text-gray-500">by {bot.author}</p>
          </div>
        </div>
        <Badge variant="outline" className={`text-[0.6rem] border-white/10 ${bot.price === "free" ? "text-emerald-400" : "text-yellow-400"}`}>
          {priceLabel}
        </Badge>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{bot.description}</p>

      <div className="flex flex-wrap gap-1">
        {bot.tags.map((t) => (
          <span key={t} className="text-[0.6rem] bg-white/10 text-gray-400 rounded px-1.5 py-0.5">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          {bot.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {bot.installs.toLocaleString()} installs
        </span>
        {bot.sandboxAvailable && (
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="h-3 w-3" /> Sandbox
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        {bot.installed ? (
          <Button size="sm" variant="outline" className="flex-1 border-white/10 text-gray-300 text-xs" onClick={() => onConfigure?.(bot.id)}>
            Configure
          </Button>
        ) : (
          <Button size="sm" className="flex-1 text-xs" onClick={() => onInstall?.(bot.id)}>
            Install
          </Button>
        )}
      </div>
    </div>
  );
}
