'use client';

import React, { useEffect, useState } from 'react';
import { adminWalletApi, WalletBalance } from '../../../lib/api/admin/wallet';
import WalletBalancesTable from '../../../components/admin/WalletBalancesTable';
import ReconciliationReport from '../../../components/admin/ReconciliationReport';

export default function WalletsManagementPage() {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'balances' | 'reconciliation'>('balances');

  const fetchBalances = async () => {
    setIsLoading(true);
    try {
      const data = await adminWalletApi.getBalances();
      setBalances(data);
    } catch (err) {
      console.error('Failed to fetch balances', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet Management Dashboard</h1>
          <button 
            onClick={fetchBalances}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh Data
          </button>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('balances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'balances'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Balances & Adjustments
            </button>
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reconciliation'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reconciliation Report
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'balances' ? (
            isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading wallet data...</div>
            ) : (
              <WalletBalancesTable balances={balances} onRefresh={fetchBalances} />
            )
          ) : (
            <ReconciliationReport />
          )}
        </div>
      </div>
    </div>
  );
}
