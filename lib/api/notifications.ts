import type { NotificationType, Notification } from "@/lib/notification-service";
import { apiRequest } from "@/lib/api/client";

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
  const data = await apiRequest<NotificationPreferencesResponse>(
    "/api/notifications/preferences",
    { query: { userId } }
  );
  return data.preferences ?? DEFAULT_PREFERENCES;
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreference[]
): Promise<void> {
  await apiRequest("/api/notifications/preferences", {
    method: "PUT",
    body: JSON.stringify({ userId, preferences }),
  });
}

export async function sendTestNotification(
  userId: string,
  type: NotificationType
): Promise<void> {
  await apiRequest("/api/notifications/test", {
    method: "POST",
    body: JSON.stringify({ userId, type }),
  });
}

export async function fetchNotifications(
  userId: string,
  opts: { unreadOnly?: boolean; limit?: number } = {}
): Promise<NotificationsListResponse> {
  const data = await apiRequest<{ data?: NotificationsListResponse }>("/api/notifications", {
    query: {
      userId,
      unreadOnly: opts.unreadOnly,
      limit: opts.limit,
    },
  });
  return data.data ?? { notifications: [], unreadCount: 0, total: 0 };
}

export async function markNotificationRead(
  notificationId: string,
  read: boolean
): Promise<void> {
  await apiRequest(`/api/notifications/${notificationId}`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  });
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  await apiRequest(`/api/notifications/${notificationId}`, {
    method: "DELETE",
  });
}
