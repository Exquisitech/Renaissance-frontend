import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const playerLifestyleNews = [
  {
    id: 1,
    title: "De Bruyne assists his wife to make pasta in heartwarming home video",
    preview:
      "Manchester City star shows he's just as skilled in the kitchen as he is on the pitch...",
    date: "2 hours ago",
    player: "Kevin De Bruyne",
    image: "/placeholder.svg?height=320&width=520",
    isPremium: true,
  },
  { 
    // premium: true,
    id: 2,
    title: "Rodri opens up on why he plays with tucked in shirt",
    preview:
      "The Spanish midfielder reveals the surprising reason behind his distinctive look...",
    date: "5 hours ago",
    player: "Rodri",
    image: "/placeholder.svg?height=320&width=520",
    isPremium: true,
  },
  {
    id: 3,
    title: "Guess what Cristiano Ronaldo had for breakfast today",
    preview:
      "The Portuguese superstar's morning routine might surprise you...",
    date: "1 day ago",
    player: "Cristiano Ronaldo",
    image: "/placeholder.svg?height=320&width=520",
    isPremium: true,
  },
  {
    id: 4,
    title: "Messi's dog becomes Instagram sensation overnight",
    preview:
      "The Argentine legend's pet has gained over a million followers in just 24 hours...",
    date: "2 days ago",
    player: "Lionel Messi",
    image: "/placeholder.svg?height=320&width=520",
    isPremium: true,
  },
  {
    id: 5,
    title: "Mbappe launches new fashion line inspired by hometown",
    preview:
      "The French forward partners with a luxury brand for an exclusive collection...",
    date: "3 days ago",
    player: "Kylian Mbappe",
    image: "/placeholder.svg?height=320&width=520",
    isPremium: true,
  },
];

interface PlayerLifestyleNewsProps {
  limit?: number;
  showHeader?: boolean;
  isPremiumUser?: boolean;
}

export function PlayerLifestyleNews({
  limit = 3,
  showHeader = true,
  isPremiumUser = false,
}: PlayerLifestyleNewsProps) {
  const newsToShow = limit ? playerLifestyleNews.slice(0, limit) : playerLifestyleNews;

  return (
    <section className="space-y-8">
      {showHeader ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Player Lifestyle
            </h1>

            <div className="inline-flex rounded-xl border border-white/8 bg-[#1c273c] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <button
                type="button"
                className="rounded-lg bg-[#081225] px-4 py-2 text-sm font-semibold text-white"
              >
                All
              </button>
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#93a8ca] transition-colors hover:text-white"
              >
                Trending
              </button>
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#93a8ca] transition-colors hover:text-white"
              >
                Your Teams
              </button>
            </div>
          </div>

          {!isPremiumUser ? (
            <Button
              variant="outline"
              className="h-11 rounded-xl border-white/12 bg-transparent px-5 font-semibold text-white hover:bg-white/5 hover:text-white"
            >
              Upgrade to Premium
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {newsToShow.map((news) => (
          <article
            key={news.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#091226] shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
          >
            <div className="relative h-56 border-b border-white/8 bg-[#3b414d]">
              {news.isPremium && !isPremiumUser ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <Badge className="rounded-full border border-white/10 bg-[#353d4a] px-3 py-1 text-xs font-semibold text-white hover:bg-[#353d4a]">
                    Premium
                  </Badge>
                  <p className="text-[1.65rem] font-semibold tracking-tight text-white">
                    Upgrade to view
                  </p>
                </div>
              ) : (
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="max-w-[15ch] text-[2rem] leading-[1.05] font-semibold tracking-tight text-white">
                  {news.title}
                </h2>
                {news.isPremium ? (
                  <Badge className="shrink-0 rounded-full bg-[#22314b] px-3 py-1 text-xs font-semibold text-white hover:bg-[#22314b]">
                    Premium
                  </Badge>
                ) : null}
              </div>

              <p className="max-w-[44ch] text-sm leading-6 text-[#95a9ca]">
                {news.preview}
              </p>

              <div className="flex items-center justify-between text-sm text-[#8298be]">
                <span>{news.player}</span>
                <span>{news.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
