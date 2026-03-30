import { NextResponse } from "next/server"
import { oddsAPI } from "@/lib/odds-api-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region") ?? "uk"
  const market = searchParams.get("market") ?? "h2h"

  const data = await oddsAPI.getSoccerOdds(region, market)
  return NextResponse.json({ success: true, data })
}
