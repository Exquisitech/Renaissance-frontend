'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNotifications } from '@/hooks/use-notifications';
import { Notification } from '@/lib/notification-service';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead } = useNotifications({
    userId: 'default-user',
    pollInterval: 7000,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > previousNotificationCount) {
      const newNotifications = notifications.slice(0, notifications.length - previousNotificationCount);
      
      newNotifications.forEach(notification => {
        toast.custom(
          () => (
            <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg shadow-lg">
              <div className="text-xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
              </div>
            </div>
          ),
          {
            duration: 5000,
            position: 'bottom-right',
          }
        );
      });
    }
    
    setPreviousNotificationCount(notifications.length);
  }, [notifications, previousNotificationCount]);

  const getNotificationIcon = (type: Notification['type']) => {
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
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'player_news':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800';
      case 'social_interaction':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800';
      case 'reward':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800';
      case 'match_update':
        return 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800';
    }
  };

  const visibleNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg border bg-background shadow-lg z-50">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b bg-background/95 backdrop-blur p-4">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {visibleNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 transition-colors hover:bg-accent/50 cursor-pointer ${getNotificationColor(notification.type)}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="text-xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-semibold text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="border-t p-3 text-center">
              <p className="text-xs text-muted-foreground">
                +{notifications.length - 10} more notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}