import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/header";
import { DashboardNav } from "@/components/dashboard-nav";
import { setMockPathname } from "./next-mocks";

vi.mock("@/components/notification-bell", () => ({
  NotificationBell: () => <div>Notification bell</div>,
}));

vi.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <div>Theme toggle</div>,
}));

vi.mock("@/components/renaissance-logo", () => ({
  RenaissanceLogo: () => <svg aria-label="Renaissance logo" />, 
}));

describe("header and dashboard navigation", () => {
  beforeEach(() => {
    setMockPathname("/dashboard");
  });

  it("shows auth buttons when requested", () => {
    const { container } = render(<Header showAuthButtons />);

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("omits auth buttons by default", () => {
    render(<Header />);

    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    expect(screen.getByText("Notification bell")).toBeInTheDocument();
  });

  it("renders default dashboard nav with active route and team shortcuts", () => {
    render(<DashboardNav />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "data-variant",
      "secondary",
    );
    expect(screen.getByText("Your Teams")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Arsenal/i })).toBeInTheDocument();
  });

  it("renders community dashboard nav without team shortcuts", () => {
    setMockPathname("/dashboard/community-posts");
    render(<DashboardNav variant="community" />);

    expect(screen.getByRole("link", { name: /community posts/i })).toHaveAttribute(
      "data-variant",
      "secondary",
    );
    expect(screen.queryByText("Your Teams")).not.toBeInTheDocument();
  });
});