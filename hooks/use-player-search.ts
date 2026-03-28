"use client"

import useSWR from "swr"

export interface PlayerResult {
 player: {
 id: number
 name: string
 firstname: string
 lastname: string
 age: number
 nationality: string
 photo: string
 }
 statistics: Array<{
 team: {
 id: number
 name: string
 logo: string
 }
 league: {
 name: string
 season: number
 }
 games: {
 appearences: number
 position: string
 }
 goals: {
 total: number
 assists: number | null
 }
 passes: {
 total: number
 accuracy: string
 }
 tackles: {
 total: number
 }
 }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePlayerSearch(query: string) {
 const { data, error, isLoading } = useSWR<{ success: boolean; data: PlayerResult[] }>(
 query && query.length >= 2 ? `/api/players/search?q=${encodeURIComponent(query)}` : null,
 fetcher,
 {
 revalidateOnFocus: false,
 dedupingInterval: 5000,
 },
 )

 return {
 players: data?.data || [],
 isLoading: isLoading && !!query,
 isError: !!error,
 }
}