'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification } from '@/lib/notification-service';

interface UseNotificationsOptions {
  userId?: string;
  pollInterval?: number;
  unreadOnly?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { userId = 'default-user', pollInterval = 7000, unreadOnly = false } = options;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        userId,
        ...(unreadOnly && { unreadOnly: 'true' }),
      });

      const response = await fetch(`/api/notifications?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result = await response.json();
      if (result.success) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId, unreadOnly]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up polling
  useEffect(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchNotifications, pollInterval]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(prev => {
          const notification = prev.find(n => n.id === notificationId);
          const wasUnread = notification && !notification.read;
          
          if (wasUnread) {
            setUnreadCount(count => Math.max(0, count - 1));
          }
          
          return prev.filter(n => n.id !== notificationId);
        });
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  }, [notifications, markAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
