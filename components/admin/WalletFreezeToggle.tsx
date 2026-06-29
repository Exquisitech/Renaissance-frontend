'use client';

import React, { useState } from 'react';
import { adminWalletApi } from '../../lib/api/admin/wallet';

interface WalletFreezeToggleProps {
  userId: string;
  isFrozen: boolean;
  onSuccess: () => void;
}

export default function WalletFreezeToggle({ userId, isFrozen, onSuccess }: WalletFreezeToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await adminWalletApi.freezeWallet(userId, !isFrozen);
      onSuccess();
    } catch (err) {
      console.error('Failed to toggle freeze status', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-3 py-1 text-sm font-medium rounded-full ${
        isFrozen 
          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
          : 'bg-green-100 text-green-800 hover:bg-green-200'
      } disabled:opacity-50`}
    >
      {isLoading ? 'Updating...' : isFrozen ? 'Unfreeze' : 'Freeze'}
    </button>
  );
}
