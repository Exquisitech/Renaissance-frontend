"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Timer
} from "lucide-react";
import { StakePosition, compoundStake } from "@/lib/api/staking";

interface StakePositionCardProps {
  stake: StakePosition;
  onCompound?: () => void;
}

export function StakePositionCard({ stake, onCompound }: StakePositionCardProps) {
  const [timeUntilNextCompound, setTimeUntilNextCompound] = useState<string>("");
  const [isCompounding, setIsCompounding] = useState(false);

  useEffect(() => {
    if (!stake.nextCompoundDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextCompound = new Date(stake.nextCompoundDate!);
      const diff = nextCompound.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilNextCompound("Ready to compound");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeUntilNextCompound(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeUntilNextCompound(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeUntilNextCompound(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [stake.nextCompoundDate]);

  const handleCompound = async () => {
    setIsCompounding(true);
    try {
      await compoundStake(stake.id);
      if (onCompound) {
        onCompound();
      }
    } catch (error) {
      console.error("Failed to compound stake:", error);
    } finally {
      setIsCompounding(false);
    }
  };

  const getFrequencyLabel = () => {
    switch (stake.compoundFrequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "manual":
        return "Manual";
    }
  };

  const getStatusColor = () => {
    switch (stake.status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "lost":
        return "bg-red-500";
    }
  };

  const earnings = stake.currentBalance - stake.amount;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${getStatusColor()}`} />
            <CardTitle className="text-lg">
              {stake.homeTeam} vs {stake.awayTeam}
            </CardTitle>
          </div>
          <Badge variant={stake.status === "active" ? "default" : "secondary"}>
            {stake.status}
          </Badge>
        </div>
        <CardDescription>
          Bet on: {stake.team === "home" ? stake.homeTeam : stake.awayTeam} @ {stake.odds.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stake Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Initial Stake</p>
            <p className="text-lg font-bold">{stake.amount.toFixed(2)} STRK</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-lg font-bold">{stake.currentBalance.toFixed(2)} STRK</p>
          </div>
        </div>

        {/* Earnings */}
        {earnings > 0 && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Earnings</span>
              </div>
              <span className="font-bold text-green-600">+{earnings.toFixed(2)} STRK</span>
            </div>
          </div>
        )}

        {/* Compound Frequency & Countdown */}
        {stake.status === "active" && (
          <div className="space-y-3">
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Compound Frequency</span>
              </div>
              <Badge variant="outline">{getFrequencyLabel()}</Badge>
            </div>

            {stake.nextCompoundDate && stake.compoundFrequency !== "manual" && (
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span className="text-sm">Next Compound</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-bold">
                      {timeUntilNextCompound}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {stake.compoundFrequency === "manual" && (
              <Button
                className="w-full"
                onClick={handleCompound}
                disabled={isCompounding}
              >
                {isCompounding ? "Compounding..." : "Compound Now"}
              </Button>
            )}
          </div>
        )}

        {/* Compound Schedule Preview */}
        {stake.compoundSchedule.length > 0 && stake.status === "active" && (
          <div className="space-y-2">
            <Separator />
            <p className="text-sm font-medium">Upcoming Compounds</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stake.compoundSchedule
                .filter((event) => event.status === "pending")
                .slice(0, 3)
                .map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm rounded-lg bg-muted/50 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <span className="font-medium">+{event.interestEarned.toFixed(3)} STRK</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Completed Compounds */}
        {stake.compoundSchedule.some((e) => e.status === "completed") && (
          <div className="space-y-2">
            <Separator />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium">
                {stake.compoundSchedule.filter((e) => e.status === "completed").length} Compounds Completed
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
