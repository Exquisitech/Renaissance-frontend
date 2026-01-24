import { Header } from "@/components/header";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showAuthButtons={false} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <DashboardNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm font-medium border">
                  Balance: 100.00 STRK
                </div>
                <Button variant="outline">Upgrade to Premium</Button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Live Scores Card */}
              <Card className="col-span-1 border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Live Scores</CardTitle>
                  <CardDescription>
                    Current matches of your teams
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center justify-center min-h-[150px]">
                  <p className="text-muted-foreground text-sm">
                    No live matches right now
                  </p>
                  <Button variant="secondary" className="w-full">
                    View All Matches
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Matches Card */}
              <Card className="col-span-1 border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Upcoming Matches</CardTitle>
                  <CardDescription>
                    Next fixtures for your teams
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center justify-center min-h-[150px]">
                  <Button variant="outline" className="w-full">
                    Place Stakes
                  </Button>
                </CardContent>
              </Card>

              {/* Latest News Card */}
              <Card className="col-span-1 border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Latest News</CardTitle>
                  <CardDescription>Updates about your teams</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center justify-center min-h-[150px]">
                  <p className="text-muted-foreground text-sm text-center">
                    Connect your teams to see personalized news
                  </p>
                  <Button variant="secondary" className="w-full">
                    View All News
                  </Button>
                </CardContent>
              </Card>

              {/* NFT Player Cards */}
              <Card className="col-span-1 lg:col-span-1 border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>NFT Player Cards</CardTitle>
                  <CardDescription>
                    Your digital collectible cards on Stellar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {/* Placeholders for cards */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-24 h-32 bg-secondary/30 rounded-md border border-white/10"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Player Search */}
              <Card className="col-span-1 lg:col-span-2 border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Player Search</CardTitle>
                  <CardDescription>
                    Search for any player or club to get detailed stats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search players or clubs..."
                      className="bg-background/50"
                    />
                    <Button variant="destructive">Search</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
