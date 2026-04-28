import { Header } from "@/components/header"
import { BadgeGallery } from "@/components/gamification/BadgeGallery"
import { Trophy } from "lucide-react"

export default function BadgesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 space-y-12">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-muted">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3 text-primary">
                            <Trophy className="h-8 w-8" />
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                                Achievements
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Track your progress, unlock exclusive badges, and showcase your achievements to the Renaissance community.
                        </p>
                    </div>

                    <div className="bg-muted p-6 rounded-2xl border border-muted-foreground/10 flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold">2 / 6</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Badges Earned</div>
                        </div>
                        <div className="h-8 w-px bg-muted-foreground/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold">33%</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Completion</div>
                        </div>
                    </div>
                </div>

                <BadgeGallery />
            </main>
        </div>
    )
}
