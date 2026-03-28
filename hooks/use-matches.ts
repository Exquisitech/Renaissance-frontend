"use client"

import useSWR from "swr"

export interface Match {
  id: number
  homeTeam: {
    id: number
    name: string
    crest?: string
    tla: string
  }
  awayTeam: {
    id: number
    name: string
    crest?: string
    tla: string
  }
  utcDate: string
  status: string
  score?: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
  competition: {
    id: number
    name: string
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useMatches(status: "LIVE" | "SCHEDULED" = "SCHEDULED", limit = 10) {
  const { data, error, isLoading } = useSWR<{ success: boolean; data: Match[] }>(
    /api/matches?status=${status}&limit=${limit},
    fetcher,
    {
      revalidateOnFocus: false,
      // Refresh live matches every 5 seconds, scheduled matches every 30 seconds
      refreshInterval: status === "LIVE" ? 5000 : 30000,
      // Keep stale data while revalidating
      dedupingInterval: 5000,
    },
  )

  return {
    matches: data?.data || [],
    isLoading,
    isError: !!error,
  }
}