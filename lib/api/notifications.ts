import type { NotificationType, Notification } from "@/lib/notification-service";

// ── Types ──────────────────────────────────────────────────────────────────────

export type NotificationChannel = "in_app" | "email" | "sms";

export interface NotificationPreference {
  type: NotificationType;
  label: string;
  description: string;
  channels: Record<NotificationChannel, boolean>;
}

export interface NotificationPreferencesResponse {
  userId: string;
  preferences: NotificationPreference[];
}

export interface NotificationsListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

export const DEFAULT_PREFERENCES: NotificationPreference[] = [
  {
    type: "player_news",
    label: "Player News",
    description: "Breaking news and updates about your followed players",
    channels: { in_app: true, email: true, sms: false },
  },
  {
    type: "social_interaction",
    label: "Social Interactions",
    description: "Upvotes, comments and replies on your posts",
    channels: { in_app: true, email: false, sms: false },
  },
  {
    type: "reward",
    label: "Rewards",
    description: "Staking rewards, spin wins and rank-up alerts",
    channels: { in_app: true, email: true, sms: true },
  },
  {
    type: "match_update",
    label: "Match Updates",
    description: "Goals, cards, and match-end events for live games",
    channels: { in_app: true, email: false, sms: false },
  },
];

// ── API helpers ────────────────────────────────────────────────────────────────

export async function fetchNotificationPreferences(
  userId: string
): Promise<NotificationPreference[]> {
  const res = await fetch(`/api/notifications/preferences?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch notification preferences");
  const data = await res.json();
  return data.preferences ?? DEFAULT_PREFERENCES;
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreference[]
): Promise<void> {
  const res = await fetch("/api/notifications/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, preferences }),
  });
  if (!res.ok) throw new Error("Failed to update notification preferences");
}

export async function sendTestNotification(
  userId: string,
  type: NotificationType
): Promise<void> {
  const res = await fetch("/api/notifications/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, type }),
  });
  if (!res.ok) throw new Error("Failed to send test notification");
}

export async function fetchNotifications(
  userId: string,
  opts: { unreadOnly?: boolean; limit?: number } = {}
): Promise<NotificationsListResponse> {
  const params = new URLSearchParams({ userId });
  if (opts.unreadOnly) params.set("unreadOnly", "true");
  if (opts.limit) params.set("limit", String(opts.limit));
  const res = await fetch(`/api/notifications?${params}`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  const data = await res.json();
  return data.data ?? { notifications: [], unreadCount: 0, total: 0 };
}

export async function markNotificationRead(
  notificationId: string,
  read: boolean
): Promise<void> {
  const res = await fetch(`/api/notifications/${notificationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read }),
  });
  if (!res.ok) throw new Error("Failed to update notification");
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const res = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete notification");
}
