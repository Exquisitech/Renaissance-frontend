"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RenaissanceLogo } from "@/components/renaissance-logo"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  showAuthButtons?: boolean
}

export function Header({ showAuthButtons = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <RenaissanceLogo className="h-6 w-6" />
          <span className="text-lg font-bold">Renaissance</span>
        </div>
        <nav className="hidden md:flex flex-1 gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#premium" className="text-sm font-medium hover:text-primary transition-colors">
            Premium
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {showAuthButtons && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
