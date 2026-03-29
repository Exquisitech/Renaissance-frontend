import React from "react";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LiveScoresPage from "@/components/live-scores";

describe("live scores", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-28T12:00:00Z"));
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  it("renders loading state then followed matches", () => {
    const { container } = render(<LiveScoresPage />);

    expect(screen.getByText(/your followed teams/i)).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getAllByText(/Manchester United/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Barcelona/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/5 matches/i)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("auto-refreshes match minute progression", () => {
    render(<LiveScoresPage />);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText("67'")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(screen.getByText("68'")).toBeInTheDocument();
  });
});