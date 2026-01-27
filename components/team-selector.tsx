"use client";

import * as React from "react";
import { Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_TEAMS, Team, LEAGUES } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TeamSelector() {
    const [selectedTeamIds, setSelectedTeamIds] = React.useState<string[]>([]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeLeague, setActiveLeague] = React.useState<string>(LEAGUES[0]);

    const toggleTeam = (teamId: string) => {
        setSelectedTeamIds((prev) => {
            if (prev.includes(teamId)) {
                return prev.filter((id) => id !== teamId);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, teamId];
        });
    };

    const removeTeam = (teamId: string) => {
        setSelectedTeamIds((prev) => prev.filter((id) => id !== teamId));
    };

    const filteredTeams = MOCK_TEAMS.filter((team) => {
        let matchesCategory = false;

        if (activeLeague === "England") {
            matchesCategory = team.country === "England";
        } else {
            matchesCategory = team.league === activeLeague;
        }

        if (team.id === "rma" || team.id === "bay") {
            matchesCategory = true;
        }

        const matchesSearch = team.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const selectedTeams = MOCK_TEAMS.filter((team) =>
        selectedTeamIds.includes(team.id)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column: Team Selection */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h2 className="text-2xl font-normal tracking-tight">Available Teams</h2>
                    <p className="text-muted-foreground">
                        Search and select your favorite teams
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search teams..."
                        className="pl-9 bg-transparent dark:bg-transparent border border-white/10 shadow-none focus-visible:ring-0 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* League Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {LEAGUES.map((league) => (
                        <button
                            key={league}
                            onClick={() => setActiveLeague(league)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                                activeLeague === league
                                    ? "text-white"
                                    : "text-muted-foreground hover:text-white",
                                league === "England" && "border border-white/20"
                            )}
                        >
                            {league}
                        </button>
                    ))}
                </div>

                {/* Team List */}
                <div className="space-y-2">
                    {filteredTeams.length > 0 ? (
                        filteredTeams.map((team) => {
                            const isSelected = selectedTeamIds.includes(team.id);
                            const isMaxReached = selectedTeamIds.length >= 3 && !isSelected;

                            return (
                                <div
                                    key={team.id}
                                    onClick={() => !isMaxReached && toggleTeam(team.id)}
                                    className={cn(
                                        "group flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer border border-transparent",
                                        isSelected
                                            ? "bg-white/10 border-white/5"
                                            : "hover:bg-white/5",
                                        isMaxReached && ""
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-12 w-12 rounded-full flex items-center justify-center ring-2 ring-white/10 bg-white"
                                        >
                                            {/* Placeholder for logo */}
                                        </div>
                                        <div>
                                            <h3 className="font-normal text-lg">{team.name}</h3>
                                            {/* Potentially show something else here if needed */}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <span className="bg-[#FA6968] text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            Selected
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No teams found in {activeLeague}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Selected Teams Summary */}
            <div className="lg:col-span-1 border-l border-border/10 pl-0 lg:pl-8 pt-8 lg:pt-0">
                <div className="sticky top-6 space-y-8">
                    <div>
                        <h2 className="text-2xl font-normal tracking-tight">Selected Teams</h2>
                        <p className={cn(
                            "text-sm font-medium mt-1 text-muted-foreground"
                        )}>
                            {selectedTeams.length}/3 teams selected
                        </p>
                    </div>

                    <div className="space-y-4">
                        {selectedTeams.map(team => (
                            <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-full flex items-center justify-center ring-1 ring-white/10 bg-white"
                                    >
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm leading-none">{team.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{team.league}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeTeam(team.id)}
                                    className="text-xs text-white hover:text-white/80 transition-colors px-2 py-1 font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {selectedTeams.length === 0 && (
                            <div className="p-8 border-2 border-dashed border-border/10 rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground/50">
                                <span className="text-sm">No teams selected</span>
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full bg-[#FA6968] hover:bg-[#E55A59] text-black font-bold h-12 rounded-lg"
                        disabled={selectedTeams.length === 0}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
