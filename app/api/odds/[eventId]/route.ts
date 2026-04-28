import { NextResponse } from "next/server"
import { oddsAPI, OddsServiceError, type DateFormat, type OddsFormat } from "@/lib/odds-api-service"

function withCorrelationId(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "x-correlation-id": crypto.randomUUID(),
    },
  })
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } },
) {
  const { eventId } = params
  const { searchParams } = new URL(request.url)
  const sportKey = searchParams.get("sportKey") ?? "soccer_epl"
  const region = searchParams.get("region") ?? "uk"
  const market = searchParams.get("market") ?? "h2h"
  const oddsFormat = (searchParams.get("oddsFormat") ?? undefined) as OddsFormat | undefined
  const dateFormat = (searchParams.get("dateFormat") ?? undefined) as DateFormat | undefined

  try {
    const data = await oddsAPI.getEventOdds({
      sportKey,
      eventId,
      regions: region,
      markets: market,
      oddsFormat,
      dateFormat,
    })
    return withCorrelationId({ success: true, data })
  } catch (err) {
    if (err instanceof OddsServiceError) {
      return withCorrelationId(
        { success: false, error: err.message },
        err.statusCode,
      )
    }
    return withCorrelationId(
      { success: false, error: "Internal server error" },
      500,
    )
  }
}
