'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardRowProps {
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

export default function LeaderboardRow({
  rank,
  username,
  avatar,
  stats,
  score,
  isCurrentUser = false,
  reward,
}: LeaderboardRowProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-semibold">{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-600'];
      return (
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors[rank - 1]}`}>
          {getRankIcon(rank)}
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        {getRankIcon(rank)}
      </div>
    );
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md ${
        isCurrentUser ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex-shrink-0">{getRankBadge(rank)}</div>

      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">
            {username}
            {isCurrentUser && (
              <Badge variant="secondary" className="ml-2">
                You
              </Badge>
            )}
          </p>
          {reward && (
            <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500">
              {reward}
            </Badge>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {stats.map((stat, index) => (
            <span key={index}>
              {stat.label}: <span className="font-medium text-foreground">{stat.value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-2xl font-bold">{typeof score === 'number' ? score.toLocaleString() : score}</p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
    </div>
  );
}
