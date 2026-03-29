"use client";

import useSWR from "swr";

export interface TeamSearchResult {
  id: number;
  name: string;
  crest?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTeamSearch(query: string) {
  const { data, error, isLoading } = useSWR<{ success: boolean; data: TeamSearchResult[] }>(
    query && query.length >= 2 ? `/api/teams/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  return {
    teams: data?.data || [],
    isLoading: isLoading && !!query,
    isError: !!error,
  };
}