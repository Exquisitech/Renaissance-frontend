import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LeagueFilter } from "@/components/league-filter";
import { TeamSelector } from "@/components/team-selector";

describe("league filter and team selector", () => {
  it("changes league through tabs and dropdown variants", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <LeagueFilter value="Premier League" onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button", { name: /filter by england/i }));
    expect(onValueChange).toHaveBeenCalledWith("England");

    rerender(
      <LeagueFilter
        value="Premier League"
        onValueChange={onValueChange}
        variant="dropdown"
      />,
    );

    await user.selectOptions(screen.getByRole("combobox"), "England");
    expect(onValueChange).toHaveBeenCalledWith("England");
  });

  it("filters, selects up to three teams, and allows removal", async () => {
    const user = userEvent.setup();
    const { container } = render(<TeamSelector />);

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();

    await user.click(screen.getByText("Arsenal"));
    await user.click(screen.getByText("Chelsea"));
    await user.click(screen.getByText("Liverpool"));
    await user.click(screen.getByText("Manchester City"));

    expect(screen.getByText("3/3 teams selected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();
    expect(screen.getByText("Manchester City")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(3);

    await user.click(screen.getAllByRole("button", { name: /remove/i })[0]);
    expect(screen.getByText("2/3 teams selected")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search teams/i), "zzz");
    expect(screen.getByText(/no teams found/i)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});