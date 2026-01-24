import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Lock } from "lucide-react"

// Sample lifestyle news data
export const playerLifestyleNews = [
  {
    id: 1,
    title: "De Bruyne assists his wife to make pasta in heartwarming home video",
    preview: "Manchester City star shows he's just as skilled in the kitchen as he is on the pitch...",
    date: "2 hours ago",
    player: "Kevin De Bruyne",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
  },
  {
    id: 2,
    title: "Rodri opens up on why he plays with tucked in shirt",
    preview: "The Spanish midfielder reveals the surprising reason behind his distinctive look...",
    date: "5 hours ago",
    player: "Rodri",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
  },
  {
    id: 3,
    title: "Guess what Cristiano Ronaldo had for breakfast today",
    preview: "The Portuguese superstar's morning routine might surprise you...",
    date: "1 day ago",
    player: "Cristiano Ronaldo",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
  },
  {
    id: 4,
    title: "Messi's dog becomes Instagram sensation overnight",
    preview: "The Argentine legend's pet has gained over a million followers in just 24 hours...",
    date: "2 days ago",
    player: "Lionel Messi",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
  },
  {
    id: 5,
    title: "Mbappé launches new fashion line inspired by hometown",
    preview: "The French forward partners with luxury brand for exclusive collection...",
    date: "3 days ago",
    player: "Kylian Mbappé",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
  },
]

interface PlayerLifestyleNewsProps {
  limit?: number
  showHeader?: boolean
  isPremiumUser?: boolean
}

export function PlayerLifestyleNews({ limit = 3, showHeader = true, isPremiumUser = false }: PlayerLifestyleNewsProps) {
  const newsToShow = limit ? playerLifestyleNews.slice(0, limit) : playerLifestyleNews

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Player Lifestyle
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
          <CardDescription>Exclusive updates on players' personal lives</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {newsToShow.map((news) => (
            <div key={news.id} className="group">
              <div className="relative overflow-hidden rounded-lg mb-2">
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                />
                {news.isPremium && !isPremiumUser && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Lock className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Premium Content</p>
                    <p className="text-xs text-muted-foreground">Upgrade to unlock</p>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-base line-clamp-2">{news.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.preview}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{news.date}</span>
                <span className="text-xs font-medium">{news.player}</span>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Lifestyle News
        </Button>
      </CardFooter>
    </Card>
  )
}