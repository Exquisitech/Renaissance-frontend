'use client';

import React, { useEffect, useState } from 'react';
import { adminWalletApi, WalletTransaction } from '../../lib/api/admin/wallet';

interface WalletTransactionHistoryProps {
  userId: string;
}

export default function WalletTransactionHistory({ userId }: WalletTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await adminWalletApi.getTransactions(userId);
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  if (isLoading) {
    return <div className="py-4 text-center">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="py-4 text-center text-gray-500">No transactions found for this user.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="p-3 text-sm font-semibold text-gray-700">Date</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Type</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Amount</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Reference</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-600">{new Date(tx.timestamp).toLocaleString()}</td>
              <td className="p-3 text-sm text-gray-600 capitalize">{tx.type}</td>
              <td className={`p-3 text-sm font-medium ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency}
              </td>
              <td className="p-3 text-sm text-gray-600 capitalize">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  tx.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-500">{tx.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
