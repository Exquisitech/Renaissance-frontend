import { DashboardNav } from "@/components/dashboard-nav";
import { PlayerLifestyleNews } from "@/components/player-lifestyle-new";

export default function DashboardLifestylePage() {
  return (
    <div className="min-h-screen bg-[#050c1b] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden border-r border-white/8 bg-[#040b18] md:block">
          <DashboardNav />
        </aside>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-11">
          <PlayerLifestyleNews limit={3} isPremiumUser={false} />
        </main>
      </div>
    </div>
  );
}
