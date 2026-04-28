"use client";

export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "processed";

export interface WithdrawalNotificationPreferences {
  email: boolean;
  sms: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  createdAt: string;
  status: WithdrawalStatus;
  note?: string;
  reviewNote?: string;
  requiresAdminApproval: boolean;
  notificationPreferences: WithdrawalNotificationPreferences;
}

export interface WithdrawalLimits {
  dailyRemaining: number;
  weeklyRemaining: number;
  monthlyRemaining: number;
}

const STORAGE_KEY = "renaissance-withdrawals";

const initialWithdrawals: WithdrawalRequest[] = [
  {
    id: "wd-1001",
    userId: "default-user",
    amount: 80,
    walletAddress: "GDKW...7Q2P",
    createdAt: "2026-04-27T09:30:00.000Z",
    status: "pending",
    note: "Weekly winnings withdrawal",
    requiresAdminApproval: false,
    notificationPreferences: {
      email: true,
      sms: false,
    },
  },
  {
    id: "wd-1002",
    userId: "default-user",
    amount: 450,
    walletAddress: "GBRL...8KHM",
    createdAt: "2026-04-26T12:10:00.000Z",
    status: "approved",
    note: "Main treasury transfer",
    reviewNote: "Approved after balance verification.",
    requiresAdminApproval: true,
    notificationPreferences: {
      email: true,
      sms: true,
    },
  },
  {
    id: "wd-1003",
    userId: "vip-user",
    amount: 900,
    walletAddress: "GDVW...4AQP",
    createdAt: "2026-04-25T16:45:00.000Z",
    status: "pending",
    note: "High-value withdrawal request",
    requiresAdminApproval: true,
    notificationPreferences: {
      email: true,
      sms: true,
    },
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readWithdrawals() {
  if (!canUseStorage()) {
    return [...initialWithdrawals];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWithdrawals));
    return [...initialWithdrawals];
  }

  try {
    return JSON.parse(raw) as WithdrawalRequest[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWithdrawals));
    return [...initialWithdrawals];
  }
}

function writeWithdrawals(withdrawals: WithdrawalRequest[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withdrawals));
  }
}

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 120));
}

export async function fetchWithdrawalLimits(userId: string): Promise<WithdrawalLimits> {
  await wait();
  const withdrawals = readWithdrawals().filter((item) => item.userId === userId);

  const totalRequested = withdrawals.reduce((sum, item) => sum + item.amount, 0);

  return {
    dailyRemaining: Math.max(500 - totalRequested * 0.15, 0),
    weeklyRemaining: Math.max(1500 - totalRequested * 0.45, 0),
    monthlyRemaining: Math.max(5000 - totalRequested, 0),
  };
}

export async function fetchUserWithdrawals(userId: string) {
  await wait();
  return readWithdrawals()
    .filter((item) => item.userId === userId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function fetchAdminWithdrawals() {
  await wait();
  return readWithdrawals().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function createWithdrawalRequest(input: {
  userId: string;
  amount: number;
  walletAddress: string;
  note?: string;
  notificationPreferences: WithdrawalNotificationPreferences;
}) {
  await wait();
  const next: WithdrawalRequest = {
    id: `wd-${Date.now()}`,
    userId: input.userId,
    amount: input.amount,
    walletAddress: input.walletAddress,
    createdAt: new Date().toISOString(),
    status: "pending",
    note: input.note,
    requiresAdminApproval: input.amount >= 300,
    notificationPreferences: input.notificationPreferences,
  };

  const all = [next, ...readWithdrawals()];
  writeWithdrawals(all);
  return next;
}

export async function reviewWithdrawalRequest(input: {
  id: string;
  status: Exclude<WithdrawalStatus, "pending">;
  reviewNote?: string;
}) {
  await wait();
  const all = readWithdrawals();
  const next = all.map((item) =>
    item.id === input.id
      ? {
          ...item,
          status: input.status,
          reviewNote: input.reviewNote,
        }
      : item,
  );
  writeWithdrawals(next);
  return next.find((item) => item.id === input.id) ?? null;
}
