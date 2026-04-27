"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Trash2, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/notification-service";
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification as deleteNotificationApi,
} from "@/lib/api/notifications";

interface NotificationCenterProps {
  userId?: string;
  className?: string;
}

export function NotificationCenter({
  userId = "default-user",
  className,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(userId);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (e) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (n: Notification) => {
    await markNotificationRead(n.id, !n.read);
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x))
    );
    setUnreadCount((c) => (n.read ? c + 1 : Math.max(0, c - 1)));
  };

  const markAll = async () => {
    await Promise.all(
      notifications.filter((n) => !n.read).map((n) => markNotificationRead(n.id, true))
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const remove = async (id: string) => {
    await deleteNotificationApi(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div
      data-testid="notification-center"
      className={cn("flex flex-col rounded-xl border bg-card", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Mark all as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        )}
        {error && (
          <p className="p-4 text-sm text-destructive">{error}</p>
        )}
        {!loading && !error && notifications.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            No notifications yet.
          </p>
        )}
        {!loading &&
          notifications.map((n) => (
            <div
              key={n.id}
              data-testid="notification-item"
              className={cn(
                "flex items-start gap-3 border-b px-4 py-3 last:border-0 transition-colors",
                !n.read && "bg-primary/5"
              )}
            >
              {/* Unread dot */}
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  n.read ? "bg-transparent" : "bg-primary"
                )}
              />

              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", n.read && "text-muted-foreground")}>
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => toggleRead(n)}
                  aria-label={n.read ? "Mark as unread" : "Mark as read"}
                  className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => remove(n.id)}
                  aria-label="Delete notification"
                  className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
