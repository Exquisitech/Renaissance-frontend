import "server-only"
import axios, { AxiosError } from "axios"

const ODDS_API_KEY = process.env.ODDS_API_KEY || ""
const ODDS_BASE_URL = process.env.ODDS_BASE_URL || "https://api.the-odds-api.com/v4"

if (!ODDS_API_KEY) {
  console.warn("[OddsAPIService] ODDS_API_KEY is not set")
}

const client = axios.create({
  baseURL: ODDS_BASE_URL,
  timeout: 10_000,
})

export type OddsFormat = "decimal" | "american"
export type DateFormat = "iso" | "unix"

export interface OddsData {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Array<{
    key: string
    title: string
    last_update?: string
    markets: Array<{
      key: string
      last_update?: string
      outcomes: Array<{
        name: string
        price: number
        point?: number
        description?: string
      }>
    }>
  }>
}

export class OddsServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = "OddsServiceError"
  }
}

type HttpClient = Pick<typeof client, "get">

function requireApiKey(apiKey: string): void {
  if (!apiKey) {
    throw new OddsServiceError("API key is not configured", 503)
  }
}

function toServiceError(err: unknown): OddsServiceError {
  if (err instanceof OddsServiceError) return err

  const axiosErr = err as AxiosError
  if (axiosErr.response) {
    const status = axiosErr.response.status
    if (status === 401 || status === 403) {
      return new OddsServiceError("Invalid or unauthorized API key", 503)
    }
    if (status === 429) {
      return new OddsServiceError("Rate limit exceeded. Please try again later", 429)
    }
    if (status === 404) {
      return new OddsServiceError("Event not found", 404)
    }
    return new OddsServiceError(`Upstream API error: ${status}`, 502)
  }
  if (axiosErr.code === "ECONNABORTED") {
    return new OddsServiceError("Request timed out", 504)
  }

  return new OddsServiceError("Failed to fetch odds data", 500)
}

export class OddsAPIService {
  constructor(
    private readonly apiKey: string = ODDS_API_KEY,
    private readonly httpClient: HttpClient = client,
  ) {}

  async getOdds(options: {
    sportKey: string
    regions?: string
    markets?: string
    oddsFormat?: OddsFormat
    dateFormat?: DateFormat
    bookmakers?: string
    eventIds?: string
    commenceTimeFrom?: string
    commenceTimeTo?: string
  }): Promise<OddsData[]> {
    requireApiKey(this.apiKey)
    if (!options.sportKey) {
      throw new OddsServiceError("sportKey is required", 400)
    }

    try {
      const response = await this.httpClient.get(`/sports/${options.sportKey}/odds/`, {
        params: {
          apiKey: this.apiKey,
          regions: options.regions,
          markets: options.markets,
          oddsFormat: options.oddsFormat,
          dateFormat: options.dateFormat,
          bookmakers: options.bookmakers,
          eventIds: options.eventIds,
          commenceTimeFrom: options.commenceTimeFrom,
          commenceTimeTo: options.commenceTimeTo,
        },
      })
      return response.data as OddsData[]
    } catch (err) {
      throw toServiceError(err)
    }
  }

  async getEventOdds(options: {
    sportKey: string
    eventId: string
    regions?: string
    markets?: string
    oddsFormat?: OddsFormat
    dateFormat?: DateFormat
    bookmakers?: string
    includeMultipliers?: boolean
  }): Promise<OddsData> {
    requireApiKey(this.apiKey)
    if (!options.sportKey) {
      throw new OddsServiceError("sportKey is required", 400)
    }
    if (!options.eventId) {
      throw new OddsServiceError("eventId is required", 400)
    }

    try {
      const response = await this.httpClient.get(
        `/sports/${options.sportKey}/events/${options.eventId}/odds`,
        {
          params: {
            apiKey: this.apiKey,
            regions: options.regions,
            markets: options.markets,
            oddsFormat: options.oddsFormat,
            dateFormat: options.dateFormat,
            bookmakers: options.bookmakers,
            includeMultipliers: options.includeMultipliers,
          },
        },
      )
      return response.data as OddsData
    } catch (err) {
      throw toServiceError(err)
    }
  }

  async getSoccerOdds(region = "uk", market = "h2h"): Promise<OddsData[]> {
    try {
      return await this.getOdds({
        sportKey: "soccer_epl",
        regions: region,
        markets: market,
      })
    } catch (err) {
      console.error("Error fetching odds:", err)
      return []
    }
  }

  async getMatchOdds(
    eventId: string,
    market = "h2h",
    region = "uk",
  ): Promise<OddsData | null> {
    try {
      return await this.getEventOdds({
        sportKey: "soccer_epl",
        eventId,
        regions: region,
        markets: market,
      })
    } catch (err) {
      console.error("Error fetching match odds:", err)
      return null
    }
  }
}

export const oddsAPI = new OddsAPIService()
