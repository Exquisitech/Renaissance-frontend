"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: "live" | "halftime" | "finished";
  competition: string;
  homeLogo: string;
  awayLogo: string;
}

// Simulated followed teams data
const followedTeams = [
  "Manchester United",
  "Real Madrid",
  "Barcelona",
  "Liverpool",
  "Bayern Munich",
];

// Initial simulated match data
const initialMatches: LiveMatch[] = [
  {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Chelsea",
    homeScore: 2,
    awayScore: 1,
    minute: 67,
    status: "live",
    competition: "Premier League",
    homeLogo: "🔴",
    awayLogo: "🔵",
  },
  {
    id: "2",
    homeTeam: "Real Madrid",
    awayTeam: "Atletico Madrid",
    homeScore: 1,
    awayScore: 1,
    minute: 45,
    status: "halftime",
    competition: "La Liga",
    homeLogo: "⚪",
    awayLogo: "🔴",
  },
  {
    id: "3",
    homeTeam: "Liverpool",
    awayTeam: "Manchester City",
    homeScore: 3,
    awayScore: 2,
    minute: 82,
    status: "live",
    competition: "Premier League",
    homeLogo: "🔴",
    awayLogo: "🔵",
  },
  {
    id: "4",
    homeTeam: "Barcelona",
    awayTeam: "Sevilla",
    homeScore: 4,
    awayScore: 0,
    minute: 90,
    status: "finished",
    competition: "La Liga",
    homeLogo: "🔵",
    awayLogo: "⚪",
  },
  {
    id: "5",
    homeTeam: "Borussia Dortmund",
    awayTeam: "Bayern Munich",
    homeScore: 0,
    awayScore: 2,
    minute: 34,
    status: "live",
    competition: "Bundesliga",
    homeLogo: "🟡",
    awayLogo: "🔴",
  },
];

function MatchSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24 mb-2"></div>
            <div className="h-6 bg-muted rounded w-32"></div>
          </div>
          <div className="px-4">
            <div className="h-8 bg-muted rounded w-16"></div>
          </div>
          <div className="flex-1 text-right">
            <div className="h-4 bg-muted rounded w-24 ml-auto mb-2"></div>
            <div className="h-6 bg-muted rounded w-32 ml-auto"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      LIVE
    </span>
  );
}

function StatusBadge({ status, minute }: { status: string; minute: number }) {
  if (status === "live") {
    return (
      <div className="flex flex-col items-center gap-1">
        <LiveIndicator />
        <span className="text-sm font-semibold text-muted-foreground">
          {minute}&apos;
        </span>
      </div>
    );
  }
  if (status === "halftime") {
    return (
      <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">
        HT
      </span>
    );
  }
  return (
    <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
      FT
    </span>
  );
}

function MatchCard({ match }: { match: LiveMatch }) {
  const isFollowedHome = followedTeams.includes(match.homeTeam);
  const isFollowedAway = followedTeams.includes(match.awayTeam);

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors duration-300 bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-3 text-center">
          {match.competition}
        </div>
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-2xl">{match.homeLogo}</span>
            <div>
              <p
                className={`font-semibold ${
                  isFollowedHome ? "text-primary" : "text-foreground"
                }`}
              >
                {match.homeTeam}
              </p>
              {isFollowedHome && (
                <span className="text-xs text-primary/70">Following</span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className={match.status === "live" ? "text-primary" : ""}>
                {match.homeScore}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className={match.status === "live" ? "text-primary" : ""}>
                {match.awayScore}
              </span>
            </div>
            <StatusBadge status={match.status} minute={match.minute} />
          </div>

          {/* Away Team */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <div className="text-right">
              <p
                className={`font-semibold ${
                  isFollowedAway ? "text-primary" : "text-foreground"
                }`}
              >
                {match.awayTeam}
              </p>
              {isFollowedAway && (
                <span className="text-xs text-primary/70">Following</span>
              )}
            </div>
            <span className="text-2xl">{match.awayLogo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">⚽</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Live Matches
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          There are no live matches for your followed teams right now. Check
          back later!
        </p>
      </CardContent>
    </Card>
  );
}

export default function LiveScoresPage() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMatches(initialMatches);
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setMatches((prevMatches) =>
        prevMatches.map((match) => {
          if (match.status === "finished") return match;

          // Simulate minute progression
          let newMinute = match.minute + 1;
          let newStatus: LiveMatch["status"] = match.status;

          if (newMinute === 45 && match.status === "live") {
            newStatus = "halftime";
          } else if (newMinute > 45 && match.status === "halftime") {
            newStatus = "live";
          } else if (newMinute >= 90) {
            newStatus = "finished";
            newMinute = 90;
          }

          // Random score update (10% chance)
          const homeScoreChange = Math.random() < 0.1 ? 1 : 0;
          const awayScoreChange = Math.random() < 0.1 ? 1 : 0;

          return {
            ...match,
            minute: newMinute,
            status: newStatus,
            homeScore: match.homeScore + homeScoreChange,
            awayScore: match.awayScore + awayScoreChange,
          };
        }),
      );
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Filter matches for followed teams
  const followedMatches = matches.filter(
    (match) =>
      followedTeams.includes(match.homeTeam) ||
      followedTeams.includes(match.awayTeam),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold">⚽ Live Scores</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6 bg-linear-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📡</span>
              Live Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Scores refresh automatically every 30 seconds. Last updated:{" "}
              <span className="font-medium text-foreground">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </p>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Followed Teams</h2>
          <span className="text-sm text-muted-foreground">
            {followedMatches.length} match
            {followedMatches.length !== 1 ? "es" : ""}
          </span>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <>
              <MatchSkeleton />
              <MatchSkeleton />
              <MatchSkeleton />
            </>
          ) : followedMatches.length === 0 ? (
            <EmptyState />
          ) : (
            followedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
        </div>

        {/* Followed Teams Preview */}
        <Card className="mt-8 bg-card/30 border-border/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Currently following:
            </p>
            <div className="flex flex-wrap gap-2">
              {followedTeams.map((team) => (
                <span
                  key={team}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {team}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
