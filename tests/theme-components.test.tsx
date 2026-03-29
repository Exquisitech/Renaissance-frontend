import React from "react";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

describe("theme components", () => {
  it("throws when useTheme is used outside provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });

  it("hydrates theme from localStorage and applies document class", () => {
    localStorage.setItem("renaissance-theme", "dark");

    render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("cycles theme through light, dark, and system", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole("button", {
      name: /current theme: light mode/i,
    });

    await user.click(toggle);
    expect(document.documentElement).toHaveClass("dark");

    await user.click(screen.getByRole("button", { name: /dark mode/i }));
    expect(localStorage.getItem("renaissance-theme")).toBe("system");

    await user.click(screen.getByRole("button", { name: /system mode/i }));
    expect(localStorage.getItem("renaissance-theme")).toBe("light");
  });
});