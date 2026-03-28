import { v4 as uuidv4 } from 'crypto';

export type NotificationType = 'player_news' | 'social_interaction' | 'reward' | 'match_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface PlayerNewsData {
  playerId: string;
  playerName: string;
  newsSource: string;
}

export interface SocialInteractionData {
  postId: string;
  interactionType: 'upvote' | 'comment';
  interactedByUser: string;
  postTitle: string;
}

export interface RewardData {
  rewardType: 'spin_win' | 'rank_up' | 'staking_reward';
  amount?: string;
  newRank?: number;
  prize?: string;
}

export interface MatchUpdateData {
  matchId: string;
  eventType: 'goal' | 'card' | 'substitution' | 'match_start' | 'match_end';
  teams: string;
  score?: string;
}

export function createPlayerNewsNotification(
  userId: string,
  playerName: string,
  newsTitle: string,
  data: PlayerNewsData
): Notification {
  return {
    id: uuidv4(),
    userId,
    type: 'player_news',
    title: ${playerName} News,
    message: newsTitle,
    relatedId: data.playerId,
    data,
    read: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createSocialInteractionNotification(
  userId: string,
  interactedByUser: string,
  postTitle: string,
  data: SocialInteractionData
): Notification {
  const actionText = data.interactionType === 'upvote' ? 'upvoted' : 'commented on';
  return {
    id: uuidv4(),
    userId,
    type: 'social_interaction',
    title: New ${data.interactionType},
    message: ${interactedByUser} ${actionText} your post "${postTitle}",
    relatedId: data.postId,
    data,
    read: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createRewardNotification(
  userId: string,
  rewardType: RewardData['rewardType'],
  data: RewardData
): Notification {
  let title = '';
  let message = '';

  if (rewardType === 'spin_win') {
    title = 'Spin-to-Win Prize!';
    message = You won ${data.prize}!;
  } else if (rewardType === 'rank_up') {
    title = 'Rank Up!';
    message = Congratulations! You reached rank ${data.newRank};
  } else if (rewardType === 'staking_reward') {
    title = 'Staking Reward';
    message = You earned ${data.amount} XLM from staking;
  }

  return {
    id: uuidv4(),
    userId,
    type: 'reward',
    title,
    message,
    data,
    read: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createMatchUpdateNotification(
  userId: string,
  eventType: MatchUpdateData['eventType'],
  teams: string,
  data: MatchUpdateData
): Notification {
  let title = '';
  let message = '';

  if (eventType === 'goal') {
    title = 'Goal Scored!';
    message = ${teams}: ${data.score};
  } else if (eventType === 'card') {
    title = 'Card Alert';
    message = ${teams} - Card issued;
  } else if (eventType === 'match_start') {
    title = 'Match Started';
    message = ${teams} - Match has begun;
  } else if (eventType === 'match_end') {
    title = 'Match Ended';
    message = ${teams} - Final score: ${data.score};
  } else if (eventType === 'substitution') {
    title = 'Substitution';
    message = ${teams} - Player substitution;
  }

  return {
    id: uuidv4(),
    userId,
    type: 'match_update',
    title,
    message,
    relatedId: data.matchId,
    data,
    read: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}