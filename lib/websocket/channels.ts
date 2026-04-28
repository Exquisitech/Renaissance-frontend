// WebSocket Channel Definitions
// Defines all available channels and their message types

// Channel names
export const CHANNELS = {
  BETS: 'bets',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
  LEADERBOARD: 'leaderboard',
  SPIN: 'spin',
  PREDICTIONS: 'predictions',
  MATCHES: 'matches',
  CONTROL: 'control',
} as const;

export type ChannelName = typeof CHANNELS[keyof typeof CHANNELS];

// Message types for each channel
export interface BetUpdate {
  type: 'bet_placed' | 'bet_settled' | 'bet_cancelled';
  betId: string;
  userId: string;
  amount: number;
  odds: number;
  result?: 'win' | 'loss';
  timestamp: string;
}

export interface CommentMessage {
  type: 'new_comment' | 'comment_deleted' | 'comment_edited';
  commentId: string;
  userId: string;
  username: string;
  content: string;
  postId?: string;
  timestamp: string;
}

export interface NotificationMessage {
  type: 'bet_result' | 'achievement' | 'leaderboard_update' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: string;
}

export interface LeaderboardUpdate {
  type: 'rank_change' | 'new_entry';
  userId: string;
  username: string;
  newRank: number;
  oldRank?: number;
  score: number;
  period: 'weekly' | 'monthly' | 'overall';
}

export interface SpinResult {
  type: 'spin_complete';
  userId: string;
  prize: string;
  amount: number;
  timestamp: string;
}

export interface PredictionUpdate {
  type: 'prediction_created' | 'prediction_resolved' | 'prediction_updated';
  predictionId: string;
  title: string;
  resolved?: boolean;
  outcome?: string;
  timestamp: string;
}

export interface MatchUpdate {
  type: 'match_started' | 'score_update' | 'match_ended';
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'finished' | 'upcoming';
  timestamp: string;
}

// Union type for all message payloads
export type ChannelMessage =
  | BetUpdate
  | CommentMessage
  | NotificationMessage
  | LeaderboardUpdate
  | SpinResult
  | PredictionUpdate
  | MatchUpdate;

// Channel subscription options
export interface ChannelSubscription {
  channel: ChannelName;
  filters?: Record<string, any>;
}

// Helper functions
export function getChannelName(channel: ChannelName): string {
  return channel;
}

export function isValidChannel(channel: string): channel is ChannelName {
  return Object.values(CHANNELS).includes(channel as ChannelName);
}

// Message builder functions
export function createBetMessage(bet: Partial<BetUpdate>): BetUpdate {
  return {
    type: 'bet_placed',
    betId: '',
    userId: '',
    amount: 0,
    odds: 0,
    timestamp: new Date().toISOString(),
    ...bet,
  } as BetUpdate;
}

export function createCommentMessage(comment: Partial<CommentMessage>): CommentMessage {
  return {
    type: 'new_comment',
    commentId: '',
    userId: '',
    username: '',
    content: '',
    timestamp: new Date().toISOString(),
    ...comment,
  } as CommentMessage;
}

export function createNotificationMessage(notification: Partial<NotificationMessage>): NotificationMessage {
  return {
    type: 'system',
    title: '',
    message: '',
    read: false,
    timestamp: new Date().toISOString(),
    ...notification,
  } as NotificationMessage;
}
