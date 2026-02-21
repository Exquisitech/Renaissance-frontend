"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Home, TrendingUp, CoinsIcon, Zap } from "lucide-react";
import { useToast } from "@chakra-ui/react";

export default function SpinToWinPage() {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(100); // Mock balance in XLM

  const handleSpin = async () => {
    if (stakeAmount < 10) {
      toast({
        title: "Invalid Stake Amount",
        description: "Minimum stake is 10 XLM",
        variant: "destructive",
      });
      return;
    }

    if (stakeAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough XLM to spin",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);

    try {
      const response = await fetch("/api/spin-to-win", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stakeAmount }),
      });

      const data = await response.json();

      if (data.success) {
        setLastWin(data.prize);
        setUserBalance(data.newBalance);

        toast({
          title: "Congratulations! 🎉",
          description: `You won: ${data.prize}!`,
        });
      } else {
        toast({
          title: "Spin Failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process spin",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-6">
        <aside className="hidden md:block">
          <nav className="grid items-start gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/live-scores">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Zap className="h-4 w-4" />
                Live Scores
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/spin-to-win">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 bg-muted"
              >
                <CoinsIcon className="h-4 w-4" />
                Spin to Win
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Spin to Win</h1>
              <p className="text-muted-foreground">
                Stake XLM and spin the wheel for amazing prizes!
              </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>
                      Stake a minimum of 10 XLM to spin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-red-600/50 bg-red-600/10 p-4">
                        <p className="text-sm font-semibold text-red-600">
                          Prize 1
                        </p>
                        <p className="text-2xl font-bold">Player NFT</p>
                        <p className="text-xs text-muted-foreground">
                          Rare collectible card
                        </p>
                      </div>
                      <div className="rounded-lg border border-red-600/50 bg-red-600/10 p-4">
                        <p className="text-sm font-semibold text-red-600">
                          Prize 2
                        </p>
                        <p className="text-2xl font-bold">2 XLM</p>
                        <p className="text-xs text-muted-foreground">
                          Free bet tokens
                        </p>
                      </div>
                      <div className="rounded-lg border border-red-600/50 bg-red-600/10 p-4">
                        <p className="text-sm font-semibold text-red-600">
                          Prize 3
                        </p>
                        <p className="text-2xl font-bold">25 XLM</p>
                        <p className="text-xs text-muted-foreground">
                          Cash prize
                        </p>
                      </div>
                      <div className="rounded-lg border border-red-600/50 bg-red-600/10 p-4">
                        <p className="text-sm font-semibold text-red-600">
                          Prize 4
                        </p>
                        <p className="text-2xl font-bold">0 XLM</p>
                        <p className="text-xs text-muted-foreground">
                          Try again
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Place Your Stake</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stake">Stake Amount (XLM)</Label>
                      <Input
                        id="stake"
                        type="number"
                        min={10}
                        max={userBalance}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(Number(e.target.value))}
                        placeholder="Enter stake amount"
                        disabled={isSpinning}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your balance:{" "}
                        <span className="font-semibold">{userBalance} XLM</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[10, 25, 50].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() =>
                            setStakeAmount(Math.min(amount, userBalance))
                          }
                          disabled={isSpinning}
                        >
                          {amount} XLM
                        </Button>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-lg h-12"
                      onClick={handleSpin}
                      disabled={isSpinning}
                    >
                      {isSpinning ? "Spinning..." : "SPIN TO WIN"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <SpinWheel isSpinning={isSpinning} lastWin={lastWin} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
