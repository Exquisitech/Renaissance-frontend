'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import LeaderboardRow from './LeaderboardRow';
import { useState } from 'react';
import { Trophy, Crown, Users, Calendar } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  score: number;
  isCurrentUser?: boolean;
  reward?: string;
}

interface LeaderboardTabsProps {
  overallData: LeaderboardEntry[];
  weeklyData: LeaderboardEntry[];
  monthlyData: LeaderboardEntry[];
  friendsData: LeaderboardEntry[];
  currentUserId: string;
}

export default function LeaderboardTabs({
  overallData,
  weeklyData,
  monthlyData,
  friendsData,
  currentUserId,
}: LeaderboardTabsProps) {
  const [gameType, setGameType] = useState<string>('all');

  const filterByGameType = (data: LeaderboardEntry[]) => {
    if (gameType === 'all') return data;
    return data.filter((entry) =>
      entry.stats.some((stat) => stat.label.toLowerCase().includes(gameType))
    );
  };

  const getRewards = (rank: number): string | undefined => {
    switch (rank) {
      case 1:
        return '🥇 10,000 XP';
      case 2:
        return '🥈 5,000 XP';
      case 3:
        return '🥉 2,500 XP';
      case 4:
      case 5:
        return '🏅 1,000 XP';
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboards</h2>
        </div>
        <Select
          value={gameType}
          onValueChange={setGameType}
          options={[
            { value: 'all', label: 'All Games' },
            { value: 'betting', label: 'Betting' },
            { value: 'staking', label: 'Staking' },
            { value: 'spin', label: 'Spin & Win' },
            { value: 'predictions', label: 'Predictions' },
          ]}
          placeholder="Filter by game"
          className="w-[200px]"
        />
      </div>

      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          {filterByGameType(overallData).map((entry) => (
            <LeaderboardRow
              key={entry.rank}
              {...entry}
              isCurrentUser={entry.username === currentUserId}
              reward={getRewards(entry.rank)}
            />
          ))}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          {filterByGameType(weeklyData).map((entry) => (
            <LeaderboardRow
              key={entry.rank}
              {...entry}
              isCurrentUser={entry.username === currentUserId}
              reward={getRewards(entry.rank)}
            />
          ))}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          {filterByGameType(monthlyData).map((entry) => (
            <LeaderboardRow
              key={entry.rank}
              {...entry}
              isCurrentUser={entry.username === currentUserId}
              reward={getRewards(entry.rank)}
            />
          ))}
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          {friendsData.length > 0 ? (
            filterByGameType(friendsData).map((entry) => (
              <LeaderboardRow
                key={entry.rank}
                {...entry}
                isCurrentUser={entry.username === currentUserId}
                reward={getRewards(entry.rank)}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No friends on leaderboard yet</p>
              <p className="text-sm text-muted-foreground">
                Invite friends to compete together
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-2 font-semibold">Your Current Rank</h3>
        {overallData.find((e) => e.username === currentUserId) ? (
          <LeaderboardRow
            {...overallData.find((e) => e.username === currentUserId)!}
            isCurrentUser={true}
          />
        ) : (
          <p className="text-sm text-muted-foreground">You haven't ranked yet. Start playing to appear on the leaderboard!</p>
        )}
      </div>
    </div>
  );
}
