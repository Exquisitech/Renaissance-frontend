"use client";

import { useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface BotConfigurationProps {
  botId: string;
  botName: string;
  onClose: () => void;
}

export function BotConfiguration({ botId: _botId, botName, onClose }: BotConfigurationProps) {
  const [maxStake, setMaxStake] = useState(50);
  const [confidence, setConfidence] = useState([65]);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [running, setRunning] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-5 space-y-5 max-w-md w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Configure: {botName}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">×</button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-400">Max Stake per Trade (RENS)</Label>
          <Input
            type="number"
            min={1}
            value={maxStake}
            onChange={(e) => setMaxStake(Number(e.target.value))}
            className="bg-transparent border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Min Confidence Threshold: {confidence[0]}%</Label>
          <Slider value={confidence} onValueChange={setConfidence} min={0} max={100} step={5} className="w-full" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            role="switch"
            aria-checked={sandboxMode}
            onClick={() => setSandboxMode((v) => !v)}
            className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${sandboxMode ? "bg-emerald-600" : "bg-white/20"}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${sandboxMode ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <div>
            <p className="text-sm text-white font-medium">Sandbox Mode</p>
            <p className="text-xs text-gray-500">Test without real funds</p>
          </div>
        </label>
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          size="sm"
          className={`flex-1 gap-2 ${running ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? <><Square className="h-3.5 w-3.5" /> Stop</> : <><Play className="h-3.5 w-3.5" /> {sandboxMode ? "Run Sandbox" : "Start Bot"}</>}
        </Button>
        <Button size="sm" variant="outline" className="border-white/10 text-gray-300" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
