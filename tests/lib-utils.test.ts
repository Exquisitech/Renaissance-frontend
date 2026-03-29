import { describe, expect, it } from "vitest";
import {
  createMatchUpdateNotification,
  createPlayerNewsNotification,
  createRewardNotification,
  createSocialInteractionNotification,
} from "@/lib/notification-service";
import { cn } from "@/lib/utils";

describe("library helpers", () => {
  it("merges class names", () => {
    expect(cn("px-2", undefined, "px-4", "font-bold")).toBe("px-4 font-bold");
  });

  it("builds notification payloads", () => {
    const playerNews = createPlayerNewsNotification("u1", "Rodri", "New story", {
      playerId: "p1",
      playerName: "Rodri",
      newsSource: "ESPN",
    });
    const social = createSocialInteractionNotification("u1", "Ada", "Great post", {
      postId: "post-1",
      interactionType: "comment",
      interactedByUser: "Ada",
      postTitle: "Great post",
    });
    const reward = createRewardNotification("u1", "staking_reward", {
      rewardType: "staking_reward",
      amount: "12",
    });
    const match = createMatchUpdateNotification("u1", "goal", "Arsenal vs Chelsea", {
      matchId: "m1",
      eventType: "goal",
      teams: "Arsenal vs Chelsea",
      score: "1-0",
    });

    expect(playerNews.title).toBe("Rodri News");
    expect(social.message).toContain("Ada commented on your post");
    expect(reward.message).toContain("12 XLM");
    expect(match.message).toBe("Arsenal vs Chelsea: 1-0");
  });
});