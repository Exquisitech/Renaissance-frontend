'use client';

import React, { useEffect, useState } from 'react';
import { adminWalletApi, ReconciliationDiscrepancy } from '../../lib/api/admin/wallet';

export default function ReconciliationReport() {
  const [discrepancies, setDiscrepancies] = useState<ReconciliationDiscrepancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReconciliation = async () => {
      try {
        const data = await adminWalletApi.getReconciliation();
        setDiscrepancies(data);
      } catch (err) {
        console.error('Failed to fetch reconciliation report', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReconciliation();
  }, []);

  if (isLoading) {
    return <div className="p-6 text-center bg-white rounded-lg shadow">Loading report...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">Reconciliation Report: DB vs Blockchain</h3>
      </div>
      
      {discrepancies.length === 0 ? (
        <div className="p-8 text-center text-green-600">
          <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          No discrepancies found. Systems are synchronized.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">User ID</th>
                <th className="p-4 text-sm font-semibold text-gray-700">DB Balance</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Blockchain Balance</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Difference</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-900">{item.userId}</td>
                  <td className="p-4 text-sm text-gray-600">{item.dbBalance.toFixed(2)} {item.currency}</td>
                  <td className="p-4 text-sm text-gray-600">{item.blockchainBalance.toFixed(2)} {item.currency}</td>
                  <td className="p-4 text-sm font-medium text-red-600">
                    {item.difference > 0 ? '+' : ''}{item.difference.toFixed(2)} {item.currency}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
