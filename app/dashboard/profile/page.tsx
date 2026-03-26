"use client";

import { Header } from "@/components/header";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Trophy, Wallet, Settings, Star, Shield, ChevronRight, Edit } from "lucide-react";

export default function ProfilePage() {
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="border-secondary/20 bg-card/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      variant="secondary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">Alex Johnson</h1>
                      <Badge variant="secondary" className="w-fit">
                        <Shield className="w-3 h-3 mr-1" />
                        Premium Member
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">@alexjohnson • Member since Oct 2024</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>alex.johnson@email.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Joined October 15, 2024</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button size="sm">
                      Share Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-secondary/20 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Predictions Won</div>
                </CardContent>
              </Card>
              
              <Card className="border-secondary/20 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </CardContent>
              </Card>
              
              <Card className="border-secondary/20 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Wallet className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">100.00</div>
                  <div className="text-sm text-muted-foreground">XLM Balance</div>
                </CardContent>
              </Card>
              
              <Card className="border-secondary/20 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">NFT Cards</div>
                </CardContent>
              </Card>
            </div>

            {/* Favorite Teams & Players */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Favorite Teams */}
              <Card className="border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Favorite Teams
                  </CardTitle>
                  <CardDescription>
                    Teams you follow for live updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Arsenal FC", league: "Premier League", color: "bg-red-500" },
                    { name: "Barcelona", league: "La Liga", color: "bg-blue-600" },
                    { name: "Bayern Munich", league: "Bundesliga", color: "bg-red-600" }
                  ].map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${team.color}`} />
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">{team.league}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add More Teams
                  </Button>
                </CardContent>
              </Card>

              {/* Favorite Players */}
              <Card className="border-secondary/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Favorite Players
                  </CardTitle>
                  <CardDescription>
                    Players you track for performance stats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Bukayo Saka", team: "Arsenal", position: "RW" },
                    { name: "Lionel Messi", team: "Inter Miami", position: "FW" },
                    { name: "Erling Haaland", team: "Man City", position: "ST" }
                  ].map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.team} • {player.position}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add More Players
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Account Settings */}
            <Card className="border-secondary/20 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Johnson" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="alex.johnson@email.com" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notifications */}
                <div>
                  <h3 className="font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Match reminders for favorite teams</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Player performance updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Promotional offers and news</span>
                    </label>
                  </div>
                </div>

                <Separator />

                {/* Web3 Wallet */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Web3 Wallet
                  </h3>
                  <div className="p-4 rounded-lg bg-background/50 border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Stellar Wallet</div>
                        <div className="text-sm text-muted-foreground font-mono">G...K2P9</div>
                      </div>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Disconnect</Button>
                      <Button variant="outline" size="sm">Change Wallet</Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
