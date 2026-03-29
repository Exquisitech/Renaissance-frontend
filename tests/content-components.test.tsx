import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommunityPosts } from "@/components/community-posts";
import { PlayerLifestyleNews } from "@/components/player-lifestyle-new";

describe("content components", () => {
  it("renders community posts with premium CTA", () => {
    const { container } = render(<CommunityPosts />);

    expect(
      screen.getByRole("heading", { name: /community posts/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upgrade now/i })).toBeInTheDocument();
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("honors player lifestyle props for limit, header, and premium state", () => {
    const { rerender } = render(
      <PlayerLifestyleNews limit={2} showHeader={false} isPremiumUser={false} />,
    );

    expect(screen.queryByRole("heading", { name: /player lifestyle/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/upgrade to view/i)).toHaveLength(2);
    expect(screen.getAllByText("Premium").length).toBeGreaterThan(0);

    rerender(<PlayerLifestyleNews limit={1} isPremiumUser />);
    expect(screen.getByRole("heading", { name: /player lifestyle/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /upgrade to premium/i })).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt");
  });
});