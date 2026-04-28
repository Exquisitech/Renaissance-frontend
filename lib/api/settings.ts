import { apiRequest } from "./client";

export interface PrivacySettings {
  profileVisibility: "public" | "private";
  showBettingHistory: boolean;
  showHoldings: boolean;
  activityFeedVisibility: "everyone" | "followers" | "nobody";
  allowMessages: "everyone" | "followers" | "nobody";
  allowFollows: "everyone" | "nobody";
}

export async function fetchPrivacySettings(): Promise<PrivacySettings> {
  return apiRequest<PrivacySettings>("/api/settings/privacy");
}

export async function updatePrivacySettings(
  settings: Partial<PrivacySettings>
): Promise<PrivacySettings> {
  return apiRequest<PrivacySettings>("/api/settings/privacy", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
}
