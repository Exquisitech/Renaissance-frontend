"use client"

import useSWR from "swr"
import type { OddsData } from "@/lib/odds-api-service"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useOdds(region = "uk", market = "h2h") {
  const { data, error, isLoading } = useSWR<{ success: boolean; data: OddsData[] }>(
    `/api/odds?region=${region}&market=${market}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
      dedupingInterval: 30000,
    },
  )

  return {
    odds: data?.data ?? [],
    isLoading,
    isError: !!error,
  }
}
