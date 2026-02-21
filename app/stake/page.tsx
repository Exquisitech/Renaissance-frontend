"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/app/header";
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
            <h1 className="text-3xl font-bold">Stake XLM on Matches</h1>
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
                    <Card>
                      <CardHeader>
                        <CardTitle>Place Your Stake</CardTitle>
                        <CardDescription>
                          {selectedMatch.homeTeam.name} vs{" "}
                          {selectedMatch.awayTeam.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="mb-2 block">
                            Select Team to Win
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Card
                              className={`cursor-pointer hover:border-primary transition-colors p-4 ${
                                selectedTeam === "home"
                                  ? "border-primary bg-muted"
                                  : ""
                              }`}
                              onClick={() => handleTeamSelect("home")}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <img
                                  src={
                                    selectedMatch.homeTeam.logo ||
                                    "/placeholder.svg"
                                  }
                                  alt={selectedMatch.homeTeam.name}
                                  className="h-12 w-12"
                                />
                                <span className="font-medium">
                                  {selectedMatch.homeTeam.name}
                                </span>
                                <Badge variant="outline">
                                  Odds: {selectedMatch.homeTeam.odds.toFixed(2)}
                                </Badge>
                              </div>
                            </Card>
                            <Card
                              className={`cursor-pointer hover:border-primary transition-colors p-4 ${
                                selectedTeam === "away"
                                  ? "border-primary bg-muted"
                                  : ""
                              }`}
                              onClick={() => handleTeamSelect("away")}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <img
                                  src={
                                    selectedMatch.awayTeam.logo ||
                                    "/placeholder.svg"
                                  }
                                  alt={selectedMatch.awayTeam.name}
                                  className="h-12 w-12"
                                />
                                <span className="font-medium">
                                  {selectedMatch.awayTeam.name}
                                </span>
                                <Badge variant="outline">
                                  Odds: {selectedMatch.awayTeam.odds.toFixed(2)}
                                </Badge>
                              </div>
                            </Card>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="stake-amount">
                            Stake Amount (STRK)
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="stake-amount"
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={stakeAmount}
                              onChange={(e) =>
                                setStakeAmount(
                                  Number.parseFloat(e.target.value) || 0,
                                )
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStakeAmount(1)}
                            >
                              1 STRK
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStakeAmount(5)}
                            >
                              5 STRK
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStakeAmount(10)}
                            >
                              10 STRK
                            </Button>
                          </div>
                        </div>

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

                        {selectedTeam && (
                          <div className="rounded-lg bg-muted p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Potential Reward:</span>
                              <span className="font-bold">
                                {calculatePotentialReward().toFixed(2)} STRK
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <Button
                            className="w-full"
                            disabled={!selectedTeam || stakeAmount <= 0}
                            onClick={handleStakeSubmit}
                          >
                            Place Stake
                          </Button>
                        </div>

                        <Separator />

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Match Analysis</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Use the fallback prediction instead of the AI API
                                setAiPrediction(getFallbackPrediction());
                              }}
                              disabled={isLoadingPrediction}
                            >
                              {isLoadingPrediction
                                ? "Loading..."
                                : "Get Analysis"}
                            </Button>
                          </div>

                          {predictionError && (
                            <Alert variant="destructive" className="mb-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>
                                {predictionError}
                              </AlertDescription>
                            </Alert>
                          )}

                          {aiPrediction ? (
                            <div className="rounded-lg bg-muted p-4 text-sm">
                              {aiPrediction}
                            </div>
                          ) : (
                            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                              {isLoadingPrediction
                                ? "Analyzing match data..."
                                : "Click to get a match analysis based on current form and odds"}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>Your Active Stakes</CardTitle>
                  <CardDescription>
                    Track your current stakes and potential rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don't have any active stakes yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Stakes</CardTitle>
                  <CardDescription>
                    History of your past stakes and outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No completed stakes to display</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
