"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  Coins,
  Images,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
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
    title: "Stake STRK",
    href: "/dashboard/stake",
    icon: Coins,
  },
  {
    title: "NFT Cards",
    href: "/dashboard/nft-cards",
    icon: Images,
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

const teams = [
  { name: "Arsenal", color: "bg-red-500" },
  { name: "Barcelona", color: "bg-blue-600" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full w-64 border-r bg-card text-card-foreground p-4 hidden md:flex">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              pathname === item.href && "bg-secondary",
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

      <Separator className="my-4" />

      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold px-2 text-muted-foreground">
          Your Teams
        </span>
        <div className="flex flex-col gap-2">
          {teams.map((team) => (
            <Button
              key={team.name}
              variant="ghost"
              className="justify-start gap-2"
            >
              <div className={cn("h-4 w-4 rounded-full", team.color)} />
              {team.name}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
