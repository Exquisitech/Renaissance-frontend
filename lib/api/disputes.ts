"use client";

export type DisputeStatus = "open" | "investigating" | "resolved";

export interface SettledBet {
  id: string;
  matchLabel: string;
  market: string;
  stakeAmount: number;
  payoutAmount: number;
  settledResult: string;
  settledAt: string;
  eligibleForDispute: boolean;
}

export interface DisputeEvidence {
  screenshots: string[];
  links: string[];
}

export interface DisputeRecord {
  id: string;
  userId: string;
  betId: string;
  title: string;
  reason: string;
  requestedOutcome: string;
  status: DisputeStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
  evidence: DisputeEvidence;
}

const DISPUTE_STORAGE_KEY = "renaissance-disputes";
const BET_STORAGE_KEY = "renaissance-settled-bets";

const seededBets: SettledBet[] = [
  {
    id: "bet-2001",
    matchLabel: "Arsenal vs Chelsea",
    market: "Arsenal to win",
    stakeAmount: 25,
    payoutAmount: 0,
    settledResult: "Marked as loss after a 2-2 draw",
    settledAt: "2026-04-27T18:15:00.000Z",
    eligibleForDispute: true,
  },
  {
    id: "bet-2002",
    matchLabel: "Barcelona vs Real Madrid",
    market: "Over 2.5 goals",
    stakeAmount: 40,
    payoutAmount: 72,
    settledResult: "Marked as win and paid out",
    settledAt: "2026-04-26T20:40:00.000Z",
    eligibleForDispute: false,
  },
  {
    id: "bet-2003",
    matchLabel: "Bayern Munich vs Borussia Dortmund",
    market: "Bayern Munich to win",
    stakeAmount: 15,
    payoutAmount: 0,
    settledResult: "Marked as loss after result correction",
    settledAt: "2026-04-25T21:05:00.000Z",
    eligibleForDispute: true,
  },
];

const seededDisputes: DisputeRecord[] = [
  {
    id: "disp-1001",
    userId: "default-user",
    betId: "bet-2001",
    title: "Final score was corrected late",
    reason: "The match feed initially showed a draw, then the voided goal was reinstated.",
    requestedOutcome: "Recalculate the market using the final official result.",
    status: "investigating",
    createdAt: "2026-04-27T19:05:00.000Z",
    updatedAt: "2026-04-28T08:15:00.000Z",
    adminNote: "Reviewing official league report and feed correction timeline.",
    evidence: {
      screenshots: ["official-match-center.png"],
      links: ["https://example.com/match-report"],
    },
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

function publishDisputeUpdate() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("dispute-updated"));

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel("dispute-updates");
    channel.postMessage({ type: "updated" });
    channel.close();
  }
}

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 120));
}

export async function fetchSettledBets(userId: string) {
  await wait();
  void userId;
  return readStorage(BET_STORAGE_KEY, seededBets);
}

export async function fetchUserDisputes(userId: string) {
  await wait();
  return readStorage(DISPUTE_STORAGE_KEY, seededDisputes)
    .filter((item: DisputeRecord) => item.userId === userId)
    .sort(
      (a: DisputeRecord, b: DisputeRecord) =>
        +new Date(b.updatedAt) - +new Date(a.updatedAt),
    );
}

export async function fetchAdminDisputes() {
  await wait();
  return readStorage(DISPUTE_STORAGE_KEY, seededDisputes).sort(
    (a: DisputeRecord, b: DisputeRecord) =>
      +new Date(b.updatedAt) - +new Date(a.updatedAt),
  );
}

export async function createDispute(input: {
  userId: string;
  betId: string;
  title: string;
  reason: string;
  requestedOutcome: string;
  evidence: DisputeEvidence;
}) {
  await wait();
  const all = readStorage(DISPUTE_STORAGE_KEY, seededDisputes);
  const next: DisputeRecord = {
    id: `disp-${Date.now()}`,
    userId: input.userId,
    betId: input.betId,
    title: input.title,
    reason: input.reason,
    requestedOutcome: input.requestedOutcome,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evidence: input.evidence,
  };
  writeStorage(DISPUTE_STORAGE_KEY, [next, ...all]);
  publishDisputeUpdate();
  return next;
}

export async function reviewDispute(input: {
  id: string;
  status: DisputeStatus;
  adminNote?: string;
}) {
  await wait();
  const all = readStorage(DISPUTE_STORAGE_KEY, seededDisputes);
  const next = all.map((item: DisputeRecord) =>
    item.id === input.id
      ? {
          ...item,
          status: input.status,
          adminNote: input.adminNote,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );
  writeStorage(DISPUTE_STORAGE_KEY, next);
  publishDisputeUpdate();
  return next.find((item: DisputeRecord) => item.id === input.id) ?? null;
}
