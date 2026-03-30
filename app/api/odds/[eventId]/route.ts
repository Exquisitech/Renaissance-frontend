import { NextResponse } from "next/server"
import { oddsAPI } from "@/lib/odds-api-service"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params
  const { searchParams } = new URL(request.url)
  const market = searchParams.get("market") ?? "h2h"

  const data = await oddsAPI.getMatchOdds(eventId, market)
  if (!data) {
    return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, data })
}
