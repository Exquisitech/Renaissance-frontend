// NFT XP and Leveling System

export interface NFTLevelInfo {
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
  maxLevel: number;
  isMaxLevel: boolean;
  prestigeLevel: number;
  oddsMultiplier: number;
  spinBonus: number;
}

export interface XPTransaction {
  id: string;
  date: Date;
  xpAmount: number;
  reason: XPReason;
  description: string;
}

export type XPReason = 
  | 'stake_win'
  | 'stake_loss'
  | 'daily_login'
  | 'prediction_correct'
  | 'tournament_reward'
  | 'manual_grant'
  | 'prestige_reset';

export interface PrestigeInfo {
  level: number;
  title: string;
  bonusMultiplier: number;
  icon: string;
  color: string;
}

// Configuration
export const MAX_LEVEL = 100;
export const XP_BASE = 100;
export const XP_GROWTH_RATE = 1.5;

export const PRESTIGE_TIERS: PrestigeInfo[] = [
  { level: 0, title: 'Rookie', bonusMultiplier: 1.0, icon: '🌟', color: 'text-gray-400' },
  { level: 1, title: 'Bronze', bonusMultiplier: 1.1, icon: '🥉', color: 'text-orange-600' },
  { level: 2, title: 'Silver', bonusMultiplier: 1.25, icon: '🥈', color: 'text-gray-300' },
  { level: 3, title: 'Gold', bonusMultiplier: 1.5, icon: '🥇', color: 'text-yellow-500' },
  { level: 4, title: 'Platinum', bonusMultiplier: 1.75, icon: '💎', color: 'text-cyan-400' },
  { level: 5, title: 'Diamond', bonusMultiplier: 2.0, icon: '👑', color: 'text-blue-400' },
  { level: 6, title: 'Master', bonusMultiplier: 2.5, icon: '⚡', color: 'text-purple-500' },
  { level: 7, title: 'Grandmaster', bonusMultiplier: 3.0, icon: '🔥', color: 'text-red-500' },
];

// Calculate XP required for a specific level
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(XP_BASE * Math.pow(level - 1, XP_GROWTH_RATE));
}

// Calculate total XP needed to reach a level
export function calculateTotalXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 1; i <= level; i++) {
    totalXP += calculateXPForLevel(i);
  }
  return totalXP;
}

// Calculate level from total XP
export function calculateLevelFromXP(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number } {
  let level = 1;
  let remainingXP = totalXP;
  
  while (level < MAX_LEVEL) {
    const xpNeeded = calculateXPForLevel(level + 1);
    if (remainingXP < xpNeeded) {
      break;
    }
    remainingXP -= xpNeeded;
    level++;
  }
  
  const currentLevelXP = remainingXP;
  const nextLevelXP = calculateXPForLevel(level + 1);
  
  return { level, currentLevelXP, nextLevelXP };
}

// Calculate odds multiplier based on level and prestige
export function calculateOddsMultiplier(level: number, prestigeLevel: number): number {
  const baseMultiplier = 1 + (level - 1) * 0.02; // 2% per level
  const prestigeInfo = PRESTIGE_TIERS[Math.min(prestigeLevel, PRESTIGE_TIERS.length - 1)];
  return baseMultiplier * prestigeInfo.bonusMultiplier;
}

// Calculate spin bonus based on level
export function calculateSpinBonus(level: number): number {
  return Math.floor(level / 10) * 0.5; // +0.5 spin bonus every 10 levels
}

// Get full NFT level information
export function getNFTLevelInfo(
  totalXP: number,
  prestigeLevel: number = 0
): NFTLevelInfo {
  const { level, currentLevelXP, nextLevelXP } = calculateLevelFromXP(totalXP);
  const isMaxLevel = level >= MAX_LEVEL;
  
  return {
    level,
    xp: totalXP,
    xpToNextLevel: isMaxLevel ? 0 : nextLevelXP - currentLevelXP,
    xpForCurrentLevel: currentLevelXP,
    maxLevel: MAX_LEVEL,
    isMaxLevel,
    prestigeLevel,
    oddsMultiplier: calculateOddsMultiplier(level, prestigeLevel),
    spinBonus: calculateSpinBonus(level),
  };
}

// Get prestige information
export function getPrestigeInfo(prestigeLevel: number): PrestigeInfo {
  return PRESTIGE_TIERS[Math.min(prestigeLevel, PRESTIGE_TIERS.length - 1)];
}

// Calculate XP reward for different actions
export function calculateXPReward(reason: XPReason, baseAmount?: number): number {
  switch (reason) {
    case 'stake_win':
      return baseAmount ? Math.floor(baseAmount * 10) : 50;
    case 'stake_loss':
      return 10;
    case 'daily_login':
      return 25;
    case 'prediction_correct':
      return 30;
    case 'tournament_reward':
      return baseAmount || 100;
    case 'manual_grant':
      return baseAmount || 0;
    case 'prestige_reset':
      return 0;
    default:
      return 0;
  }
}

// Check if NFT can prestige (must be max level)
export function canPrestige(level: number): boolean {
  return level >= MAX_LEVEL;
}

// Calculate new level info after prestige
export function calculatePrestigeReset(totalXP: number, currentPrestige: number): { 
  newXP: number; 
  newPrestige: number;
  bonusXP: number;
} {
  const bonusXP = Math.floor(totalXP * 0.1); // Keep 10% as bonus XP
  return {
    newXP: bonusXP,
    newPrestige: currentPrestige + 1,
    bonusXP,
  };
}

// Generate mock XP transactions for demo
export function generateMockXPTransactions(count: number = 20): XPTransaction[] {
  const reasons: XPReason[] = ['stake_win', 'stake_loss', 'daily_login', 'prediction_correct', 'tournament_reward'];
  const transactions: XPTransaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const xpAmount = calculateXPReward(reason, Math.floor(Math.random() * 10));
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    transactions.push({
      id: `xp_${Date.now()}_${i}`,
      date,
      xpAmount,
      reason,
      description: getXPDescription(reason, xpAmount),
    });
  }
  
  return transactions;
}

// Get human-readable description for XP transaction
function getXPDescription(reason: XPReason, amount: number): string {
  switch (reason) {
    case 'stake_win':
      return `Won stake: +${amount} XP`;
    case 'stake_loss':
      return `Stake loss: +${amount} XP`;
    case 'daily_login':
      return 'Daily login bonus';
    case 'prediction_correct':
      return 'Correct prediction';
    case 'tournament_reward':
      return `Tournament reward: +${amount} XP`;
    case 'manual_grant':
      return `Manual grant: +${amount} XP`;
    case 'prestige_reset':
      return 'Prestige reset';
    default:
      return `XP earned: +${amount}`;
  }
}
