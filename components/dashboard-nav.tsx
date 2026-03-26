"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  LayoutDashboard,
  Newspaper,
  Trophy,
  User,
  Settings,
  CalendarDays,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const defaultNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Matches",
    href: "/dashboard/matches",
    icon: CalendarDays,
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Lifestyle",
    href: "/dashboard/lifestyle",
    icon: Newspaper,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const communityNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    title: "Community Posts",
    href: "/dashboard/community-posts",
    icon: Newspaper,
  },
  {
    title: "Lifestyle News",
    href: "/dashboard/lifestyle",
    icon: Newspaper,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

const teams = [
  { name: "Arsenal", color: "bg-red-500" },
  { name: "Barcelona", color: "bg-blue-600" },
];

interface DashboardNavProps {
  variant?: "default" | "community";
}

export function DashboardNav({ variant = "default" }: DashboardNavProps) {
  const pathname = usePathname();
  const navItems = variant === "community" ? communityNavItems : defaultNavItems;

  return (
    <nav className="flex h-full w-72 flex-col bg-[#040b18] p-4 text-white">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "h-11 justify-start gap-3 rounded-xl px-4 text-base font-semibold text-white hover:bg-white/6 hover:text-white",
              pathname === item.href &&
                "bg-[#202b3f] text-white hover:bg-[#202b3f]",
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>

      {variant === "default" ? (
        <>
          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col gap-4">
            <span className="px-3 text-sm font-semibold text-white">
              Your Teams
            </span>
            <div className="flex flex-col gap-2">
              {teams.map((team) => (
                <Button
                  key={team.name}
                  variant="ghost"
                  className="h-11 justify-start gap-3 rounded-xl px-4 text-base font-medium text-white hover:bg-white/6 hover:text-white"
                >
                  <div className={cn("h-5 w-5 rounded-full", team.color)} />
                  {team.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}
