"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Home, Search, Settings, User, Newspaper } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/app/header"
import { playerLifestyleNews } from "@/components/player-lifestyle-news"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LifestylePage() {
  const [isPremiumUser, setIsPremiumUser] = useState(false)

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
            <Link href="/lifestyle">
              <Button variant="ghost" className="w-full justify-start gap-2 bg-muted">
                <Newspaper className="h-4 w-4" />
                Lifestyle
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
                  <img src="/placeholder.svg?height=24&width=24" alt="Arsenal" className="h-6 w-6 rounded-full" />
                  Arsenal
                </Link>
                <Link
                  href="/team/barcelona"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img src="/placeholder.svg?height=24&width=24" alt="Barcelona" className="h-6 w-6 rounded-full" />
                  Barcelona
                </Link>
                <Link
                  href="/team/juventus"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <img src="/placeholder.svg?height=24&width=24" alt="Juventus" className="h-6 w-6 rounded-full" />
                  Juventus
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        <main className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Player Lifestyle</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={isPremiumUser ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPremiumUser(!isPremiumUser)}
              >
                {isPremiumUser ? "Premium Active" : "Upgrade to Premium"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="your-teams">Your Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {playerLifestyleNews.map((news) => (
                  <Card key={news.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      {news.isPremium && !isPremiumUser && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                          <Badge variant="outline" className="mb-2">
                            Premium
                          </Badge>
                          <p className="text-sm">Upgrade to view</p>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{news.title}</CardTitle>
                        {news.isPremium && (
                          <Badge variant="secondary" className="ml-2 shrink-0">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {news.player} • {news.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{news.preview}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled={news.isPremium && !isPremiumUser}>
                        Read Full Story
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="trending" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {playerLifestyleNews.slice(0, 3).map((news) => (
                  <Card key={news.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      {news.isPremium && !isPremiumUser && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                          <Badge variant="outline" className="mb-2">
                            Premium
                          </Badge>
                          <p className="text-sm">Upgrade to view</p>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{news.title}</CardTitle>
                        {news.isPremium && (
                          <Badge variant="secondary" className="ml-2 shrink-0">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {news.player} • {news.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{news.preview}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled={news.isPremium && !isPremiumUser}>
                        Read Full Story
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="your-teams" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {playerLifestyleNews.slice(1, 4).map((news) => (
                  <Card key={news.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      {news.isPremium && !isPremiumUser && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                          <Badge variant="outline" className="mb-2">
                            Premium
                          </Badge>
                          <p className="text-sm">Upgrade to view</p>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{news.title}</CardTitle>
                        {news.isPremium && (
                          <Badge variant="secondary" className="ml-2 shrink-0">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {news.player} • {news.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{news.preview}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled={news.isPremium && !isPremiumUser}>
                        Read Full Story
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>//hide
  )
}
