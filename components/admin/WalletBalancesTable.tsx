'use client';

import React, { useState } from 'react';
import { WalletBalance } from '../../lib/api/admin/wallet';
import WalletFreezeToggle from './WalletFreezeToggle';
import WalletAdjustmentModal from './WalletAdjustmentModal';
import WalletTransactionHistory from './WalletTransactionHistory';

interface WalletBalancesTableProps {
  balances: WalletBalance[];
  onRefresh: () => void;
}

export default function WalletBalancesTable({ balances, onRefresh }: WalletBalancesTableProps) {
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustingUserId, setAdjustingUserId] = useState<string | null>(null);

  const filteredBalances = balances.filter(b => 
    b.userId.toLowerCase().includes(filter.toLowerCase()) || 
    b.username.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdjustClick = (userId: string) => {
    setAdjustingUserId(userId);
    setIsAdjustmentModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Filter by User ID or Username..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-semibold text-gray-700">User ID</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Username</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Balance</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Last Updated</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBalances.map((balance) => (
              <React.Fragment key={balance.userId}>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-900">{balance.userId}</td>
                  <td className="p-4 text-sm text-gray-600">{balance.username}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {balance.balance.toFixed(2)} {balance.currency}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      balance.isFrozen ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {balance.isFrozen ? 'Frozen' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(balance.lastUpdated).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex space-x-2">
                      <WalletFreezeToggle 
                        userId={balance.userId} 
                        isFrozen={balance.isFrozen} 
                        onSuccess={onRefresh} 
                      />
                      <button
                        onClick={() => handleAdjustClick(balance.userId)}
                        className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => setSelectedUser(selectedUser === balance.userId ? null : balance.userId)}
                        className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200"
                      >
                        History
                      </button>
                    </div>
                  </td>
                </tr>
                {selectedUser === balance.userId && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="p-4 border-b border-gray-200">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-inner">
                        <h4 className="mb-3 font-semibold text-gray-700">Transaction History - {balance.username}</h4>
                        <WalletTransactionHistory userId={balance.userId} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {adjustingUserId && (
        <WalletAdjustmentModal
          userId={adjustingUserId}
          isOpen={isAdjustmentModalOpen}
          onClose={() => setIsAdjustmentModalOpen(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}
