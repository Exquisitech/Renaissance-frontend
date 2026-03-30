import "server-only"
import axios from "axios"

const ODDS_API_KEY = process.env.ODDS_API_KEY || ""
const ODDS_BASE_URL = "https://api.the-odds-api.com/v4"

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
    last_update: string
    markets: Array<{
      key: string
      outcomes: Array<{
        name: string
        price: number
      }>
    }>
  }>
}

class OddsAPIService {
  async getSoccerOdds(region = "uk", market = "h2h") {
    try {
      const response = await axios.get(
        `${ODDS_BASE_URL}/sports/soccer_epl/events?apiKey=${ODDS_API_KEY}&regions=${region}&markets=${market}`,
      )
      return response.data as OddsData[]
    } catch (error) {
      console.error("Error fetching odds:", error)
      return []
    }
  }

  async getMatchOdds(eventId: string, market = "h2h") {
    try {
      const response = await axios.get(
        `${ODDS_BASE_URL}/sports/soccer_epl/events/${eventId}?apiKey=${ODDS_API_KEY}&markets=${market}`,
      )
      return response.data as OddsData
    } catch (error) {
      console.error("Error fetching match odds:", error)
      return null
    }
  }
}

export const oddsAPI = new OddsAPIService()