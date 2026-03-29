'use client';

import React from 'react';
import { toast } from 'sonner';
import { Notification } from '@/lib/notification-service';

export function useNotificationToast() {
  const showNotificationToast = (notification: Notification) => {
    const icon = getToastIcon(notification.type);
    
    toast.custom(
      () =>
        React.createElement(
          'div',
          { className: 'flex items-start gap-3 p-4 bg-background border border-border rounded-lg shadow-lg' },
          React.createElement('div', { className: 'text-xl flex-shrink-0' }, icon),
          React.createElement(
            'div',
            { className: 'flex-1' },
            React.createElement(
              'h4',
              { className: 'font-semibold text-sm' },
              notification.title,
            ),
            React.createElement(
              'p',
              { className: 'text-xs text-muted-foreground mt-1' },
              notification.message,
            ),
          ),
        ),
      {
        duration: 5000,
        position: 'bottom-right',
      }
    );
  };

  return { showNotificationToast };
}

function getToastIcon(type: Notification['type']): string {
  switch (type) {
    case 'player_news':
      return '📰';
    case 'social_interaction':
      return '👍';
    case 'reward':
      return '🏆';
    case 'match_update':
      return '⚽';
    default:
      return '📢';
  }
}