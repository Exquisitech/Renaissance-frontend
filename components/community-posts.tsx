import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const postTabs = ["All Posts", "Player Stories", "Manager Insights", "Lifestyle"];

const posts = [
  {
    id: 1,
    author: "Football Insider",
    age: "2 hours ago",
    title: "Rodri's Secret Training Routine Revealed",
    excerpt:
      "Discover the off-pitch discipline and recovery habits behind Rodri's remarkable consistency this season.",
    audience: "player",
    // premium: true,
     premium: true,
  },
];

export function CommunityPosts() {
  return (
    <section className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-[2.85rem] leading-none font-bold tracking-tight text-white">
          Community Posts
        </h1>
        <p className="text-[1.05rem] text-[#8ea5c8]">
          Share football insights and earn XLM rewards
        </p>
      </div>

      <div className="rounded-xl border border-[#d83535] bg-[#690909] px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
        <p className="text-[1.05rem] text-white">
          Upgrade to Premium to post lifestyle news and earn XLM rewards!
        </p>
        <Button
          variant="outline"
          className="mt-5 h-11 rounded-xl border-white/12 bg-[#071020] px-5 text-base font-semibold text-white hover:bg-[#0c1831] hover:text-white"
        >
          Upgrade Now
        </Button>
      </div>

      <div className="inline-flex rounded-xl border border-white/8 bg-[#1c273c] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        {postTabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={cnTab(index === 0)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-white/12 bg-[#040b18] px-6 py-7 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#7d3cb4_0%,#3d2a8f_45%,#11172d_100%)] text-[#c5a5ff]">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[1.05rem] font-semibold text-white">
                    {post.author}
                  </div>
                  <div className="text-sm text-[#8ea5c8]">{post.age}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {post.premium ? (
                  <Badge className="rounded-full bg-[#ff3b30] px-3 py-1 text-sm font-medium text-black hover:bg-[#ff3b30]">
                    Premium
                  </Badge>
                ) : null}
                <Badge className="rounded-full border border-white/18 bg-transparent px-3 py-1 text-sm font-medium capitalize text-white hover:bg-transparent">
                  {post.audience}
                </Badge>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <h2 className="text-[2rem] leading-tight font-semibold tracking-tight text-white">
                {post.title}
              </h2>
              <p className="max-w-3xl text-[1rem] leading-7 text-[#8ea5c8]">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function cnTab(active: boolean) {
  return active
    ? "rounded-lg bg-[#081225] px-4 py-2 text-sm font-semibold text-white"
    : "rounded-lg px-4 py-2 text-sm font-semibold text-[#93a8ca] transition-colors hover:text-white";
}
