"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/app/header";
import { CreateDisputeModal } from "@/components/disputes/CreateDisputeModal";
import { DisputeList } from "@/components/disputes/DisputeList";
import { DisputeStatusBadge } from "@/components/disputes/DisputeStatusBadge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Home,
  Search,
  Settings,
  User,
  CoinsIcon,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { getPrediction } from "@/lib/ai-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StakeForm } from "@/components/staking/StakeForm";
import { StakePositionCard } from "@/components/staking/StakePositionCard";
import { StakePosition, getUserStakes } from "@/lib/api/staking";

type Match = {
  id: number;
  homeTeam: {
    name: string;
    logo: string;
    odds: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    odds: number;
  };
  date: string;
  competition: string;
  status: "upcoming" | "live" | "completed";
};

export default function StakePage() {
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away" | null>(
    null,
  );
  const [stakeAmount, setStakeAmount] = useState<number>(0.1);
  const [confidence, setConfidence] = useState<number>(50);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [userStakes, setUserStakes] = useState<StakePosition[]>([]);

  const loadUserStakes = async () => {
    try {
      const stakes = await getUserStakes();
      setUserStakes(stakes);
    } catch (error) {
      console.error("Failed to load user stakes:", error);
    }
  };

  const upcomingMatches: Match[] = [
    {
      id: 1,
      homeTeam: {
        name: "Arsenal",
        logo: "/placeholder.svg?height=40&width=40",
        odds: 1.85,
      },
      awayTeam: {
        name: "Chelsea",
        logo: "/placeholder.svg?height=40&width=40",
        odds: 3.25,
      },
      date: "2025-05-10T15:00:00",
      competition: "Premier League",
      status: "upcoming",
    },
    {
      id: 2,
      homeTeam: {
        name: "Barcelona",
        logo: "/placeholder.svg?height=40&width=40",
        odds: 1.65,
      },
      awayTeam: {
        name: "Real Madrid",
        logo: "/placeholder.svg?height=40&width=40",
        odds: 2.75,
      },
      date: "2025-05-12T20:00:00",
      competition: "La Liga",
      status: "upcoming",
    },
    {
      id: 3,
      homeTeam: {
        name: "Bayern Munich",
        logo: "/placeholder.svg?height=40&width=40",
        odds: 1.45,
      },
      awayTeam: {
        name: "Borussia Dortmund",
        logo: "/placeholder.svg?height=40&width=40",
        odds: 4.5,
      },
      date: "2025-05-15T18:30:00",
      competition: "Bundesliga",
      status: "upcoming",
    },
  ];

  // Format date for display
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setSelectedTeam(null);
    setAiPrediction(null);
    setPredictionError(null);
  };

  const handleTeamSelect = (team: "home" | "away") => {
    setSelectedTeam(team);
  };

  const calculatePotentialReward = () => {
    if (!selectedMatch || !selectedTeam) return 0;

    const odds =
      selectedTeam === "home"
        ? selectedMatch.homeTeam.odds
        : selectedMatch.awayTeam.odds;

    return stakeAmount * odds;
  };

  const handleStakeSubmit = () => {
    if (!selectedMatch || !selectedTeam || stakeAmount <= 0) {
      toast({
        title: "Invalid Stake",
        description:
          "Please select a match, team, and enter a valid stake amount.",
        variant: "destructive",
      });
      return;
    }

    if (stakeAmount > remainingDailyBetVolume) {
      toast({
        title: "Daily limit reached",
        description: `Your remaining daily bet volume is ${formatLimitValue(
          remainingDailyBetVolume,
          "XLM",
        )}. Reduce your stake or wait for the reset window.`,
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call a smart contract function
    toast({
      title: "Stake Placed Successfully!",
      description: `You've staked ${stakeAmount} XLM on ${
        selectedTeam === "home"
          ? selectedMatch.homeTeam.name
          : selectedMatch.awayTeam.name
      } to win. Potential reward: ${calculatePotentialReward().toFixed(2)} XLM`,
    });
  };

  const handleGetAiPrediction = async () => {
    if (!selectedMatch) return;

    setIsLoadingPrediction(true);
    setPredictionError(null);

    try {
      const prediction = await getPrediction(
        selectedMatch.homeTeam.name,
        selectedMatch.awayTeam.name,
        selectedMatch.competition,
      );
      setAiPrediction(prediction);
    } catch (error) {
      console.error("Error getting prediction:", error);
      setPredictionError(
        "AI prediction service is currently unavailable. Please try again later.",
      );
      toast({
        title: "Prediction Error",
        description: "Failed to get AI prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  // Fallback prediction function that doesn't rely on the AI API
  const getFallbackPrediction = () => {
    if (!selectedMatch) return null;

    // Simple algorithm to generate a prediction based on odds
    const homeOdds = selectedMatch.homeTeam.odds;
    const awayOdds = selectedMatch.awayTeam.odds;

    let prediction = `Based on current form and odds, this match between ${selectedMatch.homeTeam.name} and ${selectedMatch.awayTeam.name} looks `;

    if (homeOdds < awayOdds) {
      prediction += `to favor ${selectedMatch.homeTeam.name}. The home advantage and current form suggest they have a good chance of winning. Predicted score: ${selectedMatch.homeTeam.name} 2-1 ${selectedMatch.awayTeam.name}.`;
    } else if (awayOdds < homeOdds) {
      prediction += `to favor ${selectedMatch.awayTeam.name} despite playing away. Their recent form has been impressive and they might secure a win. Predicted score: ${selectedMatch.homeTeam.name} 0-1 ${selectedMatch.awayTeam.name}.`;
    } else {
      prediction += `quite balanced. Both teams are in similar form and a draw is a likely outcome. Predicted score: ${selectedMatch.homeTeam.name} 1-1 ${selectedMatch.awayTeam.name}.`;
    }

    return prediction;
  };

  const loadDisputeData = useCallback(async () => {
    const [bets, userDisputes] = await Promise.all([
      fetchSettledBets("default-user"),
      fetchUserDisputes("default-user"),
    ]);
    setSettledBets(bets);
    setDisputes(userDisputes);
  }, []);

  useEffect(() => {
    void loadDisputeData();
  }, [loadDisputeData]);

  const disputeTransport = useDisputeUpdates(() => {
    void loadDisputeData();
  });

  const disputedBetIds = new Set(disputes.map((item) => item.betId));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-6">
        {activeDisputeBet ? (
          <CreateDisputeModal
            bet={activeDisputeBet}
            open={Boolean(activeDisputeBet)}
            submitting={submittingDispute}
            onClose={() => setActiveDisputeBet(null)}
            onSubmit={async (input) => {
              setSubmittingDispute(true);
              try {
                await createDispute({
                  userId: "default-user",
                  betId: activeDisputeBet.id,
                  ...input,
                });
                toast({
                  title: "Dispute submitted",
                  description:
                    "Your dispute is now open and the moderation queue has been notified.",
                });
                setActiveDisputeBet(null);
                await loadDisputeData();
              } catch {
                toast({
                  title: "Dispute failed",
                  description: "Unable to file your dispute right now.",
                  variant: "destructive",
                });
              } finally {
                setSubmittingDispute(false);
              }
            }}
          />
        ) : null}

        <aside className="hidden md:block">
          <nav className="grid items-start gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Matches
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </Link>
            <Link href="/stake">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 bg-muted"
              >
                <CoinsIcon className="h-4 w-4" />
                Stake XLM
              </Button>
            </Link>
            <Link href="/nft">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                NFT Cards
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>

            <Separator className="my-4" />

            <div className="px-3 py-2">
              <h3 className="mb-2 text-sm font-medium">Your Teams</h3>
              <div className="space-y-2">
                <Link
                  href="/team/arsenal"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img
                    src="/placeholder.svg?height=24&width=24"
                    alt="Arsenal"
                    className="h-6 w-6 rounded-full"
                  />
                  Arsenal
                </Link>
                <Link
                  href="/team/barcelona"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img
                    src="/placeholder.svg?height=24&width=24"
                    alt="Barcelona"
                    className="h-6 w-6 rounded-full"
                  />
                  Barcelona
                </Link>
                <Link
                  href="/team/juventus"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img
                    src="/placeholder.svg?height=24&width=24"
                    alt="Juventus"
                    className="h-6 w-6 rounded-full"
                  />
                  Juventus
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        <main className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Stake XLM on Matches</h1>
              <div className="flex flex-wrap items-center gap-2">
                <UserTierBadge tier={bettingLimitsProfile.tier} />
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  Daily reset in {bettingLimitsProfile.dailyResetIn}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <CoinsIcon className="h-4 w-4 mr-1" />
                Balance: 100.00 XLM
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
              <TabsTrigger value="my-stakes">My Stakes</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6 mt-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Betting Limits</CardTitle>
                    <CardDescription>
                      Your current tier determines how much you can wager today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    {bettingLimitsProfile.limits.map((limit) => {
                      const ratio = Math.min((limit.used / limit.max) * 100, 100);
                      const remaining = getRemainingLimit(limit.used, limit.max);

                      return (
                        <div
                          key={limit.label}
                          className="rounded-xl border bg-muted/40 p-4"
                        >
                          <p className="text-sm font-medium">{limit.label}</p>
                          <p className="mt-2 text-2xl font-semibold">
                            {formatLimitValue(remaining, limit.unit)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Remaining of {formatLimitValue(limit.max, limit.unit)}
                          </p>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tier Benefits</CardTitle>
                    <CardDescription>
                      Your Silver tier keeps higher limits unlocked for today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {bettingLimitsProfile.tierSubtitle}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress to Gold</span>
                        <span>{bettingLimitsProfile.tierProgress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${bettingLimitsProfile.tierProgress}%` }}
                        />
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/profile/limits">View detailed limits</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select a Match</h2>
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                      <Card
                        key={match.id}
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedMatch?.id === match.id ? "border-primary" : ""
                        }`}
                        onClick={() => handleMatchSelect(match)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{match.competition}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatMatchDate(match.date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={match.homeTeam.logo || "/placeholder.svg"}
                                alt={match.homeTeam.name}
                                className="h-8 w-8"
                              />
                              <span>{match.homeTeam.name}</span>
                            </div>
                            <span className="text-sm font-medium">
                              Odds: {match.homeTeam.odds.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-center my-2">
                            <span className="text-xs text-muted-foreground">
                              vs
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={match.awayTeam.logo || "/placeholder.svg"}
                                alt={match.awayTeam.name}
                                className="h-8 w-8"
                              />
                              <span>{match.awayTeam.name}</span>
                            </div>
                            <span className="text-sm font-medium">
                              Odds: {match.awayTeam.odds.toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  {selectedMatch ? (
                    <StakeForm
                      matchId={selectedMatch.id}
                      homeTeam={selectedMatch.homeTeam}
                      awayTeam={selectedMatch.awayTeam}
                      onStakePlaced={() => {
                        toast({
                          title: "Stake Placed Successfully!",
                          description: `You've staked on ${
                            selectedMatch.homeTeam.name
                          } vs ${selectedMatch.awayTeam.name}`,
                        });
                        loadUserStakes();
                      }}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <CoinsIcon className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <h3 className="text-lg font-medium">
                              Select a Match
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Choose a match from the list to place your stake
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my-stakes" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Active Stakes</h2>
                {userStakes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {userStakes.map((stake) => (
                      <StakePositionCard
                        key={stake.id}
                        stake={stake}
                        onCompound={() => loadUserStakes()}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <CoinsIcon className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-medium">
                            No Active Stakes
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Place your first stake to start earning with compound interest
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Stakes</CardTitle>
                    <CardDescription>
                      Review settled bets and file disputes for incorrect outcomes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {settledBets.map((bet) => {
                      const linkedDispute = disputes.find((item) => item.betId === bet.id);

                      return (
                        <div
                          key={bet.id}
                          className="rounded-xl border bg-muted/20 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">{bet.matchLabel}</p>
                              <p className="text-sm text-muted-foreground">
                                {bet.market}
                              </p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                Settled {new Date(bet.settledAt).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {linkedDispute ? (
                                <DisputeStatusBadge status={linkedDispute.status} />
                              ) : null}
                              <Badge variant="outline">
                                Stake {bet.stakeAmount.toFixed(2)} XLM
                              </Badge>
                              <Badge variant="outline">
                                Payout {bet.payoutAmount.toFixed(2)} XLM
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                            <div className="rounded-xl border bg-background/70 p-3 text-sm text-muted-foreground">
                              {bet.settledResult}
                            </div>
                            <Button
                              variant="outline"
                              disabled={
                                !bet.eligibleForDispute || disputedBetIds.has(bet.id)
                              }
                              onClick={() => setActiveDisputeBet(bet)}
                            >
                              {disputedBetIds.has(bet.id)
                                ? "Dispute filed"
                                : "Dispute Result"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <DisputeList disputes={disputes} transport={disputeTransport} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
