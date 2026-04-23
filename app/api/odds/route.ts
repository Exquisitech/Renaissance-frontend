import { NextResponse } from "next/server"
import { oddsAPI, OddsServiceError, type DateFormat, type OddsFormat } from "@/lib/odds-api-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sportKey = searchParams.get("sportKey") ?? "soccer_epl"
  const region = searchParams.get("region") ?? "uk"
  const market = searchParams.get("market") ?? "h2h"
  const oddsFormat = (searchParams.get("oddsFormat") ?? undefined) as OddsFormat | undefined
  const dateFormat = (searchParams.get("dateFormat") ?? undefined) as DateFormat | undefined

  try {
    const data = await oddsAPI.getOdds({
      sportKey,
      regions: region,
      markets: market,
      oddsFormat,
      dateFormat,
    })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    if (err instanceof OddsServiceError) {
      return NextResponse.json(
        { success: false, error: err.message, data: [] },
        { status: err.statusCode },
      )
    }
    return NextResponse.json(
      { success: false, error: "Internal server error", data: [] },
      { status: 500 },
    )
  }
}
