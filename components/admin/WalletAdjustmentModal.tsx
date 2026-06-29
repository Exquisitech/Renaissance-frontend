'use client';

import React, { useState } from 'react';
import { adminWalletApi } from '../../lib/api/admin/wallet';

interface WalletAdjustmentModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WalletAdjustmentModal({ userId, isOpen, onClose, onSuccess }: WalletAdjustmentModalProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === '' || !justification) {
      setError('Amount and justification are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await adminWalletApi.adjustBalance(userId, Number(amount), justification);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to adjust balance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Adjust Wallet Balance - {userId}</h2>
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Amount to Adjust</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 50.00 or -50.00"
            />
            <p className="mt-1 text-xs text-gray-500">Use negative values to deduct balance.</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Audit Justification</label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Reason for adjustment (required for audit trail)"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adjusting...' : 'Confirm Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
