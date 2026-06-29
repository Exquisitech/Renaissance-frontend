// Mock API implementation for Admin Wallets

export interface WalletBalance {
  userId: string;
  username: string;
  balance: number;
  currency: string;
  isFrozen: boolean;
  lastUpdated: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'adjustment' | 'transfer';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  reference: string;
  description?: string;
}

export interface ReconciliationDiscrepancy {
  userId: string;
  dbBalance: number;
  blockchainBalance: number;
  currency: string;
  difference: number;
  status: 'resolved' | 'unresolved';
}

// Mock Data
const mockBalances: WalletBalance[] = [
  { userId: 'USR-001', username: 'alice_smith', balance: 1500.50, currency: 'USD', isFrozen: false, lastUpdated: '2023-10-25T10:00:00Z' },
  { userId: 'USR-002', username: 'bob_jones', balance: 250.00, currency: 'USD', isFrozen: true, lastUpdated: '2023-10-24T14:30:00Z' },
  { userId: 'USR-003', username: 'charlie_brown', balance: 0.00, currency: 'USD', isFrozen: false, lastUpdated: '2023-10-20T09:15:00Z' },
];

const mockTransactions: Record<string, WalletTransaction[]> = {
  'USR-001': [
    { id: 'TX-1001', userId: 'USR-001', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', timestamp: '2023-10-25T09:00:00Z', reference: 'REF-001' },
    { id: 'TX-1002', userId: 'USR-001', type: 'adjustment', amount: 1000.50, currency: 'USD', status: 'completed', timestamp: '2023-10-20T11:00:00Z', reference: 'REF-002', description: 'Initial balance' },
  ],
  'USR-002': [
    { id: 'TX-1003', userId: 'USR-002', type: 'withdrawal', amount: -50, currency: 'USD', status: 'completed', timestamp: '2023-10-24T14:00:00Z', reference: 'REF-003' },
  ]
};

const mockReconciliation: ReconciliationDiscrepancy[] = [
  { userId: 'USR-004', dbBalance: 500, blockchainBalance: 450, currency: 'USD', difference: 50, status: 'unresolved' },
];

export const adminWalletApi = {
  getBalances: async (): Promise<WalletBalance[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockBalances]), 500));
  },

  adjustBalance: async (userId: string, amount: number, justification: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockBalances.find(b => b.userId === userId);
        if (user) {
          user.balance += amount;
          user.lastUpdated = new Date().toISOString();
          
          if (!mockTransactions[userId]) mockTransactions[userId] = [];
          mockTransactions[userId].unshift({
            id: `TX-${Date.now()}`,
            userId,
            type: 'adjustment',
            amount,
            currency: user.currency,
            status: 'completed',
            timestamp: user.lastUpdated,
            reference: `ADJ-${Date.now()}`,
            description: justification
          });
        }
        resolve(true);
      }, 500);
    });
  },

  getTransactions: async (userId: string): Promise<WalletTransaction[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockTransactions[userId] || []), 500));
  },

  freezeWallet: async (userId: string, isFrozen: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockBalances.find(b => b.userId === userId);
        if (user) {
          user.isFrozen = isFrozen;
        }
        resolve(true);
      }, 500);
    });
  },

  getReconciliation: async (): Promise<ReconciliationDiscrepancy[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockReconciliation]), 500));
  }
};
