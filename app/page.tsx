import Link from "next/link";
import { Button } from "@/components/ui/button";
import HomeClient from "./home-client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-6 items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">⚽ Renaissance</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="default">Join the Revolution</Button>
        <Link href="/live-scores">
          <Button variant="outline" className="gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            View Live Scores
          </Button>
        </Link>
      </div>
    </main>
  );
}
