import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCommunityPosts, usePostRewards } from "@/hooks/use-community-post .ts";
import { useMatches } from "@/hooks/use-matches";
import { usePlayerSearch } from "@/hooks/use-player-search";

const useSWRMock = vi.fn();

vi.mock("swr", () => ({
  default: (...args: unknown[]) => useSWRMock(...args),
}));

describe("SWR-backed hooks", () => {
  beforeEach(() => {
    useSWRMock.mockReset();
  });

  it("maps community posts response data", () => {
    useSWRMock.mockReturnValue({
      data: {
        data: [{ id: "1", title: "Post" }],
        total: 1,
        page: 2,
        pages: 4,
      },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useCommunityPosts("player", 2, 5));
    expect(useSWRMock.mock.calls[0][0]).toContain("category=player&page=2&limit=5");
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.total).toBe(1);
  });

  it("omits reward lookup when identifiers are missing", () => {
    useSWRMock.mockReturnValue({ data: null, error: undefined, isLoading: false });

    renderHook(() => usePostRewards("", ""));
    expect(useSWRMock.mock.calls[0][0]).toBeNull();
  });

  it("builds matches and player search keys and maps errors", () => {
    useSWRMock.mockReturnValueOnce({
      data: { success: true, data: [{ id: 1 }] },
      error: undefined,
      isLoading: false,
    });
    useSWRMock.mockReturnValueOnce({
      data: { success: true, data: [{ player: { id: 1, name: "Rodri" } }] },
      error: new Error("boom"),
      isLoading: true,
    });

    const { result: matchesResult } = renderHook(() => useMatches("LIVE", 4));
    const { result: searchResult } = renderHook(() => usePlayerSearch("Ro"));

    expect(useSWRMock.mock.calls[0][0]).toContain("status=LIVE&limit=4");
    expect(useSWRMock.mock.calls[1][0]).toContain("/api/players/search?q=Ro");
    expect(matchesResult.current.matches).toHaveLength(1);
    expect(searchResult.current.isError).toBe(true);
  });
});