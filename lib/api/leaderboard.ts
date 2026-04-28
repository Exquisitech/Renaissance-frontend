// Leaderboard API functions

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

// Mock data generators
function generateMockLeaderboard(count: number, currentUserId?: string): LeaderboardEntry[] {
  const usernames = [
    'CryptoKing', 'BetMaster', 'LuckySpin', 'PredictorPro', 'StakingWhale',
    'HighRoller', 'WinStreak', 'GoldRush', 'DiamondHands', 'MoonShot',
    'AlphaBet', 'OmegaWin', 'DeltaForce', 'SigmaGrind', 'ThetaGang',
  ];

  return Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    username: usernames[i % usernames.length] + (i >= usernames.length ? ` ${Math.floor(i / usernames.length) + 1}` : ''),
    avatar: undefined,
    stats: [
      { label: 'Win Rate', value: `${(55 + Math.random() * 25).toFixed(1)}%` },
      { label: 'Total Bets', value: Math.floor(100 + Math.random() * 900) },
      { label: 'Games', value: ['Betting', 'Staking', 'Spin', 'Predictions'][Math.floor(Math.random() * 4)] },
    ],
    score: Math.floor(10000 - i * 800 + Math.random() * 400),
    isCurrentUser: currentUserId ? usernames[i % usernames.length] === currentUserId : false,
  })).sort((a, b) => b.score - a.score).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export async function getOverallLeaderboard(limit: number = 50, currentUserId?: string): Promise<LeaderboardEntry[]> {
  // TODO: Replace with actual API endpoint
  return generateMockLeaderboard(limit, currentUserId);
}

export async function getWeeklyLeaderboard(limit: number = 50, currentUserId?: string): Promise<LeaderboardEntry[]> {
  // TODO: Replace with actual API endpoint
  return generateMockLeaderboard(limit, currentUserId);
}

export async function getMonthlyLeaderboard(limit: number = 50, currentUserId?: string): Promise<LeaderboardEntry[]> {
  // TODO: Replace with actual API endpoint
  return generateMockLeaderboard(limit, currentUserId);
}

export async function getFriendsLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
  // TODO: Replace with actual API endpoint
  // Return smaller list for friends
  return generateMockLeaderboard(10, currentUserId);
}

export async function getUserRank(userId: string): Promise<{ rank: number; total: number } | null> {
  // TODO: Replace with actual API endpoint
  // Mock implementation
  const rank = Math.floor(Math.random() * 1000) + 1;
  return {
    rank,
    total: 10000,
  };
}

export async function getLeaderboardArchive(period: string): Promise<LeaderboardEntry[]> {
  // TODO: Replace with actual API endpoint
  return generateMockLeaderboard(50);
}
