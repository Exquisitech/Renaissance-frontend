"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { CoinsIcon, TrendingUp, Clock, Calendar } from "lucide-react";
import { 
  CompoundFrequency, 
  StakeInput, 
  createStake, 
  calculateProjectedEarnings 
} from "@/lib/api/staking";

interface StakeFormProps {
  matchId: number;
  homeTeam: { name: string; logo: string; odds: number };
  awayTeam: { name: string; logo: string; odds: number };
  onStakePlaced?: () => void;
}

export function StakeForm({ matchId, homeTeam, awayTeam, onStakePlaced }: StakeFormProps) {
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away" | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(0.1);
  const [confidence, setConfidence] = useState<number>(50);
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundFrequency>("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOdds = selectedTeam === "home" ? homeTeam.odds : awayTeam.odds;
  const selectedTeamName = selectedTeam === "home" ? homeTeam.name : awayTeam.name;

  const potentialReward = selectedTeam && stakeAmount > 0 
    ? stakeAmount * selectedOdds 
    : 0;

  const projectedEarnings = calculateProjectedEarnings(stakeAmount, compoundFrequency, 90);

  const handleStakeSubmit = async () => {
    if (!selectedTeam || stakeAmount <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const stakeInput: StakeInput = {
        matchId,
        team: selectedTeam,
        amount: stakeAmount,
        compoundFrequency,
        confidence,
      };

      await createStake(stakeInput);
      
      if (onStakePlaced) {
        onStakePlaced();
      }
    } catch (error) {
      console.error("Failed to create stake:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCompoundFrequency = (freq: CompoundFrequency) => {
    switch (freq) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "manual":
        return "Manual";
    }
  };

  const getFrequencyDescription = (freq: CompoundFrequency) => {
    switch (freq) {
      case "daily":
        return "Compounds every day";
      case "weekly":
        return "Compounds every week";
      case "manual":
        return "Compound manually when you choose";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Your Stake</CardTitle>
        <CardDescription>
          {homeTeam.name} vs {awayTeam.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Selection */}
        <div>
          <Label className="mb-2 block">Select Team to Win</Label>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer hover:border-primary transition-colors p-4 ${
                selectedTeam === "home" ? "border-primary bg-muted" : ""
              }`}
              onClick={() => setSelectedTeam("home")}
            >
              <div className="flex flex-col items-center gap-2">
                <img
                  src={homeTeam.logo || "/placeholder.svg"}
                  alt={homeTeam.name}
                  className="h-12 w-12"
                />
                <span className="font-medium">{homeTeam.name}</span>
                <Badge variant="outline">Odds: {homeTeam.odds.toFixed(2)}</Badge>
              </div>
            </Card>
            <Card
              className={`cursor-pointer hover:border-primary transition-colors p-4 ${
                selectedTeam === "away" ? "border-primary bg-muted" : ""
              }`}
              onClick={() => setSelectedTeam("away")}
            >
              <div className="flex flex-col items-center gap-2">
                <img
                  src={awayTeam.logo || "/placeholder.svg"}
                  alt={awayTeam.name}
                  className="h-12 w-12"
                />
                <span className="font-medium">{awayTeam.name}</span>
                <Badge variant="outline">Odds: {awayTeam.odds.toFixed(2)}</Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Stake Amount */}
        <div className="space-y-2">
          <Label htmlFor="stake-amount">Stake Amount (STRK)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="stake-amount"
              type="number"
              min="0.1"
              step="0.1"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number.parseFloat(e.target.value) || 0)}
            />
            <Button variant="outline" size="sm" onClick={() => setStakeAmount(1)}>
              1 STRK
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStakeAmount(5)}>
              5 STRK
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStakeAmount(10)}>
              10 STRK
            </Button>
          </div>
        </div>

        {/* Confidence Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="confidence">Your Confidence</Label>
            <span className="text-sm">{confidence}%</span>
          </div>
          <Slider
            id="confidence"
            min={0}
            max={100}
            step={1}
            value={[confidence]}
            onValueChange={(value) => setConfidence(value[0])}
          />
        </div>

        {/* Compound Frequency Selector */}
        <div className="space-y-3">
          <Label>Compound Frequency</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["daily", "weekly", "manual"] as CompoundFrequency[]).map((freq) => (
              <Card
                key={freq}
                className={`cursor-pointer hover:border-primary transition-colors p-3 ${
                  compoundFrequency === freq ? "border-primary bg-muted" : ""
                }`}
                onClick={() => setCompoundFrequency(freq)}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium text-sm">{formatCompoundFrequency(freq)}</span>
                  <span className="text-xs text-muted-foreground">
                    {getFrequencyDescription(freq)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Potential Reward & Projected Earnings */}
        {selectedTeam && (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Potential Reward:</span>
                <span className="font-bold">{potentialReward.toFixed(2)} STRK</span>
              </div>
            </div>
            
            {compoundFrequency !== "manual" && stakeAmount > 0 && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Projected Earnings (90 days):</span>
                  </div>
                  <span className="font-bold text-green-600">
                    +{projectedEarnings.totalEarnings.toFixed(2)} STRK
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Final Balance:</span>
                  <span>{projectedEarnings.finalBalance.toFixed(2)} STRK</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Compounding:</span>
                  <span>{formatCompoundFrequency(compoundFrequency)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Submit Button */}
        <Button
          className="w-full"
          disabled={!selectedTeam || stakeAmount <= 0 || isSubmitting}
          onClick={handleStakeSubmit}
        >
          {isSubmitting ? "Placing Stake..." : "Place Stake"}
        </Button>
      </CardContent>
    </Card>
  );
}
