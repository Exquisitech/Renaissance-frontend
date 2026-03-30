import "server-only"
import axios, { AxiosError } from "axios"

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ""
const RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com"
const BASE_URL = `https://${RAPIDAPI_HOST}/v3`

if (!RAPIDAPI_KEY) {
  console.warn("[RapidAPIPlayerService] RAPIDAPI_KEY is not set")
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST,
  },
  timeout: 10_000,
})

export class PlayerServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = "PlayerServiceError"
  }
}

function validateQuery(query: string): void {
  if (!query || typeof query !== "string") {
    throw new PlayerServiceError("Search query is required", 400)
  }
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    throw new PlayerServiceError("Search query must be at least 2 characters", 400)
  }
  if (trimmed.length > 100) {
    throw new PlayerServiceError("Search query must not exceed 100 characters", 400)
  }
}

export async function searchPlayers(query: string) {
  validateQuery(query)

  if (!RAPIDAPI_KEY) {
    throw new PlayerServiceError("API key is not configured", 503)
  }

  try {
    const response = await client.get("/players", {
      params: { search: query.trim() },
    })

    const players = response.data?.response
    if (!Array.isArray(players)) {
      throw new PlayerServiceError("Unexpected response format from upstream API", 502)
    }

    return players
  } catch (err) {
    if (err instanceof PlayerServiceError) throw err

    const axiosErr = err as AxiosError
    if (axiosErr.response) {
      const status = axiosErr.response.status
      if (status === 401 || status === 403) {
        throw new PlayerServiceError("Invalid or unauthorized API key", 503)
      }
      if (status === 429) {
        throw new PlayerServiceError("Rate limit exceeded. Please try again later", 429)
      }
      throw new PlayerServiceError(`Upstream API error: ${status}`, 502)
    }
    if (axiosErr.code === "ECONNABORTED") {
      throw new PlayerServiceError("Request timed out", 504)
    }

    throw new PlayerServiceError("Failed to fetch player data", 500)
  }
}
