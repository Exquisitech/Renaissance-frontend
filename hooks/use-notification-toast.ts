'use client';

import { toast } from 'sonner';
import { Notification } from '@/lib/notification-service';

export function useNotificationToast() {
  const showNotificationToast = (notification: Notification) => {
    const icon = getToastIcon(notification.type);
    
    toast.custom(
      (id) => (
        <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg shadow-lg">
          <div className="text-xl flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
          </div>
        </div>
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