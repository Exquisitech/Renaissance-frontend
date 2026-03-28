"use client"

import { useEffect, useMemo, useState } from "react"

type TeamSearchResult = {
  id: number
  name: string
  crest: string | null
}

type UseTeamSearchResult = {
  teams: TeamSearchResult[]
  isLoading: boolean
}

const MOCK_TEAMS: TeamSearchResult[] = [
  { id: 1, name: "Manchester City", crest: null },
  { id: 2, name: "Real Madrid", crest: null },
  { id: 3, name: "Arsenal", crest: null },
]

export function useTeamSearch(query: string): UseTeamSearchResult {
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query])
  const [isLoading, setIsLoading] = useState(false)
  const [teams, setTeams] = useState<TeamSearchResult[]>([])

  useEffect(() => {
    if (!normalizedQuery) {
      setTeams([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      const filteredTeams = MOCK_TEAMS.filter((team) =>
        team.name.toLowerCase().includes(normalizedQuery),
      )

      setTeams(filteredTeams)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [normalizedQuery])

  return {
    teams,
    isLoading,
  }
}
