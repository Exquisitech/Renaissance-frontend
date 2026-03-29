import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotificationToast } from "@/hooks/use-notification-toast";
import { useNotifications } from "@/hooks/use-notifications";

const { toastCustom } = vi.hoisted(() => ({
  toastCustom: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    custom: toastCustom,
  },
}));

describe("interactive hooks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("tracks mobile breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
    const listenerStore: Array<() => void> = [];
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      onchange: null,
      addEventListener: (_event: string, callback: () => void) => {
        listenerStore.push(callback);
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    act(() => {
      listenerStore[0]?.();
    });

    expect(result.current).toBe(false);
  });

  it("shows notification toasts with mapped icons", () => {
    const { result } = renderHook(() => useNotificationToast());

    act(() => {
      result.current.showNotificationToast({
        id: "1",
        userId: "u1",
        type: "match_update",
        title: "Match update",
        message: "Goal!",
        data: {},
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    expect(toastCustom).toHaveBeenCalled();
  });

  it("fetches, polls, marks as read, deletes, and refreshes notifications", async () => {
    vi.useRealTimers();

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            notifications: [
              {
                id: "1",
                title: "Unread",
                message: "Message",
                type: "reward",
                userId: "u1",
                data: {},
                read: false,
                createdAt: new Date().toISOString(),
              },
            ],
            unreadCount: 1,
          },
        }),
      })
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() =>
      useNotifications({ userId: "u1", pollInterval: 20 }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 1000 });
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);

    await act(async () => {
      await result.current.markAsRead("1");
    });
    expect(result.current.unreadCount).toBe(0);

    await act(async () => {
      await result.current.deleteNotification("1");
    });
    expect(result.current.notifications).toHaveLength(0);

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(3), {
      timeout: 1000,
    });
  });
});