"use client";

export type BetStatus = "active" | "pending" | "won" | "lost" | "cancelled";

export interface ActiveBet {
  id: string;
  userId: string;
  matchLabel: string;
  market: string;
  selection: string;
  stakeAmount: number;
  odds: number;
  potentialPayout: number;
  /** Full refund shown in the cancel modal (may exclude a small fee). */
  refundAmount: number;
  /** Human-readable refund timeline, e.g. "Within 15 minutes". */
  refundTimeline: string;
  status: BetStatus;
  placedAt: string;
  kickoffAt: string;
  /** Whether the user may cancel this bet right now. */
  cancellable: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface CancelBetResult {
  bet: ActiveBet;
  refundAmount: number;
  refundTimeline: string;
}

export interface BetHistoryItem {
  id: string;
  date: string;
  type: string;
  matchLabel: string;
  stake: number;
  odds: number;
  result: "win" | "loss" | "pending" | "cancelled";
  profit: number;
  status: string;
  cancellationReason?: string;
}

const BET_STORAGE_KEY = "renaissance-active-bets";
const BET_UPDATED_EVENT = "bet-updated";

const seededBets: ActiveBet[] = [
  {
    id: "bet-active-1001",
    userId: "default-user",
    matchLabel: "Arsenal vs Chelsea",
    market: "Match Winner",
    selection: "Arsenal",
    stakeAmount: 25,
    odds: 1.85,
    potentialPayout: 46.25,
    refundAmount: 25,
    refundTimeline: "Within 15 minutes",
    status: "active",
    placedAt: "2026-07-20T14:30:00.000Z",
    kickoffAt: "2026-07-25T15:00:00.000Z",
    cancellable: true,
  },
  {
    id: "bet-active-1002",
    userId: "default-user",
    matchLabel: "Barcelona vs Real Madrid",
    market: "Over/Under 2.5",
    selection: "Over 2.5",
    stakeAmount: 40,
    odds: 1.95,
    potentialPayout: 78,
    refundAmount: 38,
    refundTimeline: "Within 15 minutes (2 XLM cancellation fee)",
    status: "pending",
    placedAt: "2026-07-21T09:10:00.000Z",
    kickoffAt: "2026-07-26T20:00:00.000Z",
    cancellable: true,
  },
  {
    id: "bet-active-1003",
    userId: "default-user",
    matchLabel: "Bayern Munich vs Borussia Dortmund",
    market: "Both Teams to Score",
    selection: "Yes",
    stakeAmount: 15,
    odds: 1.72,
    potentialPayout: 25.8,
    refundAmount: 15,
    refundTimeline: "Instant credit to wallet",
    status: "active",
    placedAt: "2026-07-18T11:00:00.000Z",
    kickoffAt: "2026-07-19T18:30:00.000Z",
    cancellable: false,
  },
  {
    id: "bet-cancelled-1004",
    userId: "default-user",
    matchLabel: "Liverpool vs Manchester City",
    market: "Match Winner",
    selection: "Draw",
    stakeAmount: 20,
    odds: 3.4,
    potentialPayout: 68,
    refundAmount: 20,
    refundTimeline: "Credited",
    status: "cancelled",
    placedAt: "2026-07-15T16:45:00.000Z",
    kickoffAt: "2026-07-22T12:30:00.000Z",
    cancellable: false,
    cancellationReason: "Changed mind before kickoff",
    cancelledAt: "2026-07-16T08:20:00.000Z",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function publishBetUpdate() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(BET_UPDATED_EVENT));

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel("bet-updates");
    channel.postMessage({ type: "updated" });
    channel.close();
  }
}

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 120));
}

function toHistoryItem(bet: ActiveBet): BetHistoryItem {
  if (bet.status === "cancelled") {
    return {
      id: bet.id,
      date: (bet.cancelledAt ?? bet.placedAt).slice(0, 10),
      type: "sports",
      matchLabel: bet.matchLabel,
      stake: bet.stakeAmount,
      odds: bet.odds,
      result: "cancelled",
      profit: 0,
      status: "Cancelled",
      cancellationReason: bet.cancellationReason,
    };
  }

  if (bet.status === "won") {
    return {
      id: bet.id,
      date: bet.placedAt.slice(0, 10),
      type: "sports",
      matchLabel: bet.matchLabel,
      stake: bet.stakeAmount,
      odds: bet.odds,
      result: "win",
      profit: Number((bet.potentialPayout - bet.stakeAmount).toFixed(2)),
      status: "Settled",
    };
  }

  if (bet.status === "lost") {
    return {
      id: bet.id,
      date: bet.placedAt.slice(0, 10),
      type: "sports",
      matchLabel: bet.matchLabel,
      stake: bet.stakeAmount,
      odds: bet.odds,
      result: "loss",
      profit: -bet.stakeAmount,
      status: "Settled",
    };
  }

  return {
    id: bet.id,
    date: bet.placedAt.slice(0, 10),
    type: "sports",
    matchLabel: bet.matchLabel,
    stake: bet.stakeAmount,
    odds: bet.odds,
    result: "pending",
    profit: 0,
    status: bet.status === "active" ? "Active" : "Pending",
  };
}

/** Open (cancellable or still live) bets for the user. */
export async function fetchActiveBets(userId: string): Promise<ActiveBet[]> {
  await wait();
  return readStorage(BET_STORAGE_KEY, seededBets)
    .filter(
      (bet: ActiveBet) =>
        bet.userId === userId &&
        (bet.status === "active" || bet.status === "pending"),
    )
    .sort(
      (left: ActiveBet, right: ActiveBet) =>
        +new Date(right.placedAt) - +new Date(left.placedAt),
    );
}

/** Full bet list including cancelled entries for history UIs. */
export async function fetchBetHistory(userId: string): Promise<BetHistoryItem[]> {
  await wait();
  return readStorage(BET_STORAGE_KEY, seededBets)
    .filter((bet: ActiveBet) => bet.userId === userId)
    .map(toHistoryItem)
    .sort(
      (left: BetHistoryItem, right: BetHistoryItem) =>
        +new Date(right.date) - +new Date(left.date),
    );
}

/**
 * Cancel an eligible bet and queue the refund.
 * Rejects if the bet is missing, already cancelled, or not cancellable.
 */
export async function cancelBet(
  betId: string,
  reason: string,
): Promise<CancelBetResult> {
  await wait();

  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    throw new Error("A cancellation reason is required.");
  }

  const all = readStorage(BET_STORAGE_KEY, seededBets);
  const target = all.find((bet: ActiveBet) => bet.id === betId);

  if (!target) {
    throw new Error("Bet not found.");
  }

  if (target.status === "cancelled") {
    throw new Error("This bet is already cancelled.");
  }

  if (!target.cancellable) {
    throw new Error("This bet can no longer be cancelled.");
  }

  const cancelled: ActiveBet = {
    ...target,
    status: "cancelled",
    cancellable: false,
    cancellationReason: trimmedReason,
    cancelledAt: new Date().toISOString(),
  };

  const next = all.map((bet: ActiveBet) =>
    bet.id === betId ? cancelled : bet,
  );
  writeStorage(BET_STORAGE_KEY, next);
  publishBetUpdate();

  return {
    bet: cancelled,
    refundAmount: cancelled.refundAmount,
    refundTimeline: cancelled.refundTimeline,
  };
}

export function subscribeToBetUpdates(onUpdate: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleEvent = () => onUpdate();
  window.addEventListener(BET_UPDATED_EVENT, handleEvent);

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel("bet-updates");
    channel.onmessage = () => onUpdate();
  }

  return () => {
    window.removeEventListener(BET_UPDATED_EVENT, handleEvent);
    channel?.close();
  };
}
