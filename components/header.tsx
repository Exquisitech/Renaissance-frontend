"use client";

import Link from "next/link";
import { RenaissanceLogo } from "@/components/renaissance-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export function Header({ showAuthButtons = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <RenaissanceLogo className="h-8 w-8" />
            <span className="font-bold text-xl">Renaissance</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />

          {showAuthButtons && (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
