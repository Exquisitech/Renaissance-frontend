"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { z } from "zod"

const playerSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().nullable(),
  nationality: z.string(),
  photo: z.string().nullable(),
})

const playerStatsSchema = z.object({
  team: z.object({
    name: z.string(),
  }),
  games: z
    .object({
      position: z.string().nullable().optional(),
      appearences: z.number().nullable().optional(),
    })
    .optional(),
  goals: z
    .object({
      total: z.number().nullable().optional(),
      assists: z.number().nullable().optional(),
    })
    .optional(),
  passes: z
    .object({
      accuracy: z.union([z.number(), z.string()]).nullable().optional(),
    })
    .optional(),
  tackles: z
    .object({
      total: z.number().nullable().optional(),
    })
    .optional(),
})

const playerSearchResultSchema = z.object({
  player: playerSchema,
  statistics: z.array(playerStatsSchema).default([]),
})

const playerSearchResponseSchema = z.object({
  players: z.array(playerSearchResultSchema),
})

type PlayerSearchResult = z.infer<typeof playerSearchResultSchema>

type PlayerSearchState = {
  players: PlayerSearchResult[]
  isLoading: boolean
  error: string | null
}

type UsePlayerSearchResult = PlayerSearchState & {
  isIdle: boolean
  refetch: () => Promise<void>
}

const MOCK_PLAYER_RESULTS: PlayerSearchResult[] = [
  {
    player: {
      id: 1,
      name: "Rodri",
      age: 29,
      nationality: "Spain",
      photo: null,
    },
    statistics: [
      {
        team: { name: "Manchester City" },
        games: { position: "Midfielder", appearences: 33 },
        goals: { total: 8, assists: 6 },
        passes: { accuracy: 92 },
        tackles: { total: 64 },
      },
    ],
  },
  {
    player: {
      id: 2,
      name: "Kevin De Bruyne",
      age: 34,
      nationality: "Belgium",
      photo: null,
    },
    statistics: [
      {
        team: { name: "Manchester City" },
        games: { position: "Midfielder", appearences: 31 },
        goals: { total: 10, assists: 14 },
        passes: { accuracy: 88 },
        tackles: { total: 34 },
      },
    ],
  },
  {
    player: {
      id: 3,
      name: "Lionel Messi",
      age: 38,
      nationality: "Argentina",
      photo: null,
    },
    statistics: [
      {
        team: { name: "Inter Miami" },
        games: { position: "Forward", appearences: 27 },
        goals: { total: 21, assists: 12 },
        passes: { accuracy: 84 },
        tackles: { total: 12 },
      },
    ],
  },
]

const PLAYER_SEARCH_ENDPOINT = "/api/search/players"

async function fetchPlayerSearch(query: string): Promise<PlayerSearchResult[]> {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  try {
    const response = await fetch(`${PLAYER_SEARCH_ENDPOINT}?query=${encodeURIComponent(trimmedQuery)}`)

    if (!response.ok) {
      throw new Error("Player search request failed")
    }

    const payload = await response.json()
    const parsedPayload = playerSearchResponseSchema.safeParse(payload)

    if (!parsedPayload.success) {
      throw new Error("Player search response shape is invalid")
    }

    return parsedPayload.data.players
  } catch {
    const normalizedQuery = trimmedQuery.toLowerCase()

    return MOCK_PLAYER_RESULTS.filter((result) =>
      result.player.name.toLowerCase().includes(normalizedQuery),
    )
  }
}

export function usePlayerSearch(query: string): UsePlayerSearchResult {
  const normalizedQuery = useMemo(() => query.trim(), [query])
  const [state, setState] = useState<PlayerSearchState>({
    players: [],
    isLoading: false,
    error: null,
  })

  const runSearch = useCallback(async () => {
    if (!normalizedQuery) {
      setState({
        players: [],
        isLoading: false,
        error: null,
      })
      return
    }

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }))

    try {
      const players = await fetchPlayerSearch(normalizedQuery)

      setState({
        players,
        isLoading: false,
        error: null,
      })
    } catch {
      setState({
        players: [],
        isLoading: false,
        error: "Unable to search players right now",
      })
    }
  }, [normalizedQuery])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void runSearch()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [runSearch])

  return {
    ...state,
    isIdle: normalizedQuery.length === 0,
    refetch: runSearch,
  }
}
