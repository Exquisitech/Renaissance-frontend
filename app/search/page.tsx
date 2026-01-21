"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Tab = "players" | "teams";

interface SearchResult {
  id: string;
  name: string;
  info: string;
  github?: string;
  assignee: string;
  address: string;
  date: string;
  basePoints: number;
  penalty: number;
  activity: number;
  total: number;
}

const mockPlayers: SearchResult[] = [
  {
    id: "p1",
    name: "Bukayo Saka",
    info: "Player information coming soon",
    github: "https://github.com",
    assignee: "Karu12099",
    address: "0xe3...",
    date: "Jan 21, 2026, 10:00 AM",
    basePoints: 100,
    penalty: 0,
    activity: 100,
    total: 200,
  },
  {
    id: "p2",
    name: "Martin Odegaard",
    info: "Player information coming soon",
    github: "https://github.com",
    assignee: "Karu12099",
    address: "0xf4...",
    date: "Jan 20, 2026, 09:30 AM",
    basePoints: 120,
    penalty: 5,
    activity: 95,
    total: 210,
  },
  {
    id: "p3",
    name: "Declan Rice",
    info: "Player information coming soon",
    github: "https://github.com",
    assignee: "Karu12099",
    address: "0xa1...",
    date: "Jan 19, 2026, 11:00 AM",
    basePoints: 90,
    penalty: 0,
    activity: 110,
    total: 200,
  },
];

const mockTeams: SearchResult[] = [
  {
    id: "t1",
    name: "Arsenal",
    info: "Team information coming soon",
    github: "https://github.com",
    assignee: "Karu12099",
    address: "0xe3...",
    date: "Jan 21, 2026, 10:00 AM",
    basePoints: 100,
    penalty: 0,
    activity: 100,
    total: 200,
  },
  {
    id: "t2",
    name: "Manchester City",
    info: "Team information coming soon",
    github: "https://github.com",
    assignee: "Karu12099",
    address: "0xb2...",
    date: "Jan 18, 2026, 02:00 PM",
    basePoints: 150,
    penalty: 10,
    activity: 80,
    total: 220,
  },
  {
    id: "t3",
    name: "Liverpool",
    info: "Team information coming soon",
    github: "https://github.com",
    assignee: "Karu12099",
    address: "0xc5...",
    date: "Jan 17, 2026, 04:30 PM",
    basePoints: 110,
    penalty: 5,
    activity: 105,
    total: 210,
  },
];

const TABS: { key: Tab; label: string }[] = [
  { key: "players", label: "Players" },
  { key: "teams", label: "Teams" },
];

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>("players");
  const [query, setQuery] = useState("");

  const dataSource = activeTab === "players" ? mockPlayers : mockTeams;

  const results = query.trim()
    ? dataSource.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  const showEmpty = query.trim() && results.length === 0;
  const showResults = results.length > 0;

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Search</h1>

        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search players or teams"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-9 sm:h-10 px-3 text-sm rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button>Search</Button>
        </div>

        <div className="inline-flex gap-1 p-1 rounded-lg bg-muted/50 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!query.trim() && (
          <p className="text-muted-foreground text-center py-12">
            Type to search {activeTab}
          </p>
        )}

        {showEmpty && (
          <p className="text-muted-foreground text-center py-12">
            No {activeTab} found
          </p>
        )}

        {showResults && (
          <div className="space-y-4">
            {results.map((item) => (
              <article
                key={item.id}
                className="flex flex-col md:flex-row rounded-lg bg-card border border-border overflow-hidden"
              >
                <div className="flex flex-1 gap-3 sm:gap-4 p-3 sm:p-4 items-start">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded bg-primary/90 flex items-center justify-center">
                      <span className="text-primary-foreground text-xl sm:text-2xl lg:text-3xl font-bold select-none">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 pt-1">
                    <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                      {item.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      {item.info}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-border my-3" />
                <div className="md:hidden h-px bg-border mx-3" />

                <aside className="w-full md:w-48 p-3 sm:p-4 text-sm">
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-xs mb-3 block"
                    >
                      View on GitHub
                    </a>
                  )}

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-2 md:gap-0">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Assigned/Applicants
                      </p>
                      <p className="text-foreground">{item.assignee}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Address
                      </p>
                      <p className="text-foreground font-mono text-xs">
                        {item.address}
                      </p>
                    </div>

                    <p className="text-foreground text-xs col-span-2 md:col-span-1">{item.date}</p>
                  </div>

                  <div className="border-t border-border mt-3 pt-3 grid grid-cols-2 gap-1 md:grid-cols-1 md:space-y-1 md:gap-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Base Points</span>
                      <span>{item.basePoints}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Penalty</span>
                      <span>{item.penalty}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Activity</span>
                      <span>{item.activity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 col-span-2 md:col-span-1">
                      <span>Total</span>
                      <span>{item.total}</span>
                    </div>
                  </div>
                </aside>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
