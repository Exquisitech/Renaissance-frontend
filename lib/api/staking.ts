// Staking API Service

export type CompoundFrequency = 'daily' | 'weekly' | 'manual';

export interface StakeInput {
  matchId: number;
  team: 'home' | 'away';
  amount: number;
  compoundFrequency: CompoundFrequency;
  confidence: number;
}

export interface StakePosition {
  id: string;
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  team: 'home' | 'away';
  amount: number;
  odds: number;
  compoundFrequency: CompoundFrequency;
  currentBalance: number;
  potentialReward: number;
  createdAt: Date;
  nextCompoundDate?: Date;
  compoundSchedule: CompoundEvent[];
  status: 'active' | 'completed' | 'lost';
}

export interface CompoundEvent {
  date: Date;
  amount: number;
  interestEarned: number;
  status: 'pending' | 'completed';
}

export interface StakePrediction {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability: number;
  recommendedStake: number;
  confidenceScore: number;
}

// Mock API functions - replace with real API calls
export async function createStake(input: StakeInput): Promise<StakePosition> {
  // In a real app, this would call the backend API
  const now = new Date();
  const compoundSchedule = generateCompoundSchedule(input.amount, input.compoundFrequency, now);
  
  return {
    id: `stake_${Date.now()}`,
    matchId: input.matchId,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    team: input.team,
    amount: input.amount,
    odds: input.team === 'home' ? 1.85 : 3.25,
    compoundFrequency: input.compoundFrequency,
    currentBalance: input.amount,
    potentialReward: input.amount * (input.team === 'home' ? 1.85 : 3.25),
    createdAt: now,
    nextCompoundDate: compoundSchedule.length > 0 ? compoundSchedule[0].date : undefined,
    compoundSchedule,
    status: 'active',
  };
}

export async function getStakePosition(stakeId: string): Promise<StakePosition> {
  // Mock implementation - replace with real API call
  return {
    id: stakeId,
    matchId: 1,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    team: 'home',
    amount: 10,
    odds: 1.85,
    compoundFrequency: 'daily',
    currentBalance: 10.5,
    potentialReward: 19.425,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    nextCompoundDate: new Date(Date.now() + 86400000), // 1 day from now
    compoundSchedule: generateCompoundSchedule(10, 'daily', new Date(Date.now() - 86400000)),
    status: 'active',
  };
}

export async function getUserStakes(): Promise<StakePosition[]> {
  // Mock implementation - replace with real API call
  return [];
}

export async function compoundStake(stakeId: string): Promise<StakePosition> {
  // Mock implementation - replace with real API call
  return getStakePosition(stakeId);
}

// Helper function to generate compound schedule
function generateCompoundSchedule(
  principal: number,
  frequency: CompoundFrequency,
  startDate: Date
): CompoundEvent[] {
  const schedule: CompoundEvent[] = [];
  const annualRate = 0.05; // 5% annual interest rate (example)
  const periodsPerYear = frequency === 'daily' ? 365 : frequency === 'weekly' ? 52 : 0;
  
  if (periodsPerYear === 0) return schedule; // Manual compounding
  
  const ratePerPeriod = annualRate / periodsPerYear;
  const now = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3); // 3-month stake period
  
  let currentDate = new Date(startDate);
  let currentBalance = principal;
  
  while (currentDate < endDate) {
    if (frequency === 'daily') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    if (currentDate < endDate) {
      const interestEarned = currentBalance * ratePerPeriod;
      currentBalance += interestEarned;
      
      schedule.push({
        date: new Date(currentDate),
        amount: currentBalance,
        interestEarned,
        status: currentDate <= now ? 'completed' : 'pending',
      });
    }
  }
  
  return schedule;
}

// Calculate projected earnings with compound interest
export function calculateProjectedEarnings(
  principal: number,
  frequency: CompoundFrequency,
  days: number = 90,
  annualRate: number = 0.05
): { totalEarnings: number; finalBalance: number; schedule: CompoundEvent[] } {
  if (frequency === 'manual') {
    return {
      totalEarnings: 0,
      finalBalance: principal,
      schedule: [],
    };
  }
  
  const periodsPerYear = frequency === 'daily' ? 365 : 52;
  const ratePerPeriod = annualRate / periodsPerYear;
  const totalPeriods = frequency === 'daily' ? days : Math.floor(days / 7);
  
  let currentBalance = principal;
  const schedule: CompoundEvent[] = [];
  const startDate = new Date();
  
  for (let i = 0; i < totalPeriods; i++) {
    const interestEarned = currentBalance * ratePerPeriod;
    currentBalance += interestEarned;
    
    const periodDate = new Date(startDate);
    if (frequency === 'daily') {
      periodDate.setDate(periodDate.getDate() + i + 1);
    } else {
      periodDate.setDate(periodDate.getDate() + (i + 1) * 7);
    }
    
    schedule.push({
      date: periodDate,
      amount: currentBalance,
      interestEarned,
      status: 'pending',
    });
  }
  
  return {
    totalEarnings: currentBalance - principal,
    finalBalance: currentBalance,
    schedule,
  };
}
