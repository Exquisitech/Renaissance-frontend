import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationBell } from "@/components/notification-bell";

const { markAsRead, deleteNotification, markAllAsRead, toastCustom } = vi.hoisted(() => ({
  markAsRead: vi.fn(),
  deleteNotification: vi.fn(),
  markAllAsRead: vi.fn(),
  toastCustom: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    custom: toastCustom,
  },
}));

vi.mock("@/hooks/use-notifications", () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: "1",
        userId: "default-user",
        type: "reward",
        title: "Reward unlocked",
        message: "You earned 5 XLM",
        data: {},
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "default-user",
        type: "player_news",
        title: "Player update",
        message: "Latest player story",
        data: {},
        read: true,
        createdAt: new Date().toISOString(),
      },
    ],
    unreadCount: 1,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  }),
}));

describe("notification bell", () => {
  beforeEach(() => {
    markAsRead.mockReset();
    deleteNotification.mockReset();
    markAllAsRead.mockReset();
    toastCustom.mockReset();
  });

  it("shows unread count, dropdown actions, and toast for new notifications", async () => {
    const user = userEvent.setup();
    const { container } = render(<NotificationBell />);

    expect(screen.getByText("1")).toBeInTheDocument();
    await waitFor(() => expect(toastCustom).toHaveBeenCalled());

    await user.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText("Reward unlocked")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /mark all as read/i }));
    expect(markAllAsRead).toHaveBeenCalled();

    await user.click(screen.getByTitle("Mark as read"));
    expect(markAsRead).toHaveBeenCalledWith("1");

    await user.click(screen.getAllByTitle("Delete")[0]);
    expect(deleteNotification).toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
  });
});