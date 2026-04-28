import { NextResponse } from "next/server"
import { searchPlayers, PlayerServiceError } from "@/lib/rapidapi-player-service"

function withCorrelationId(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "x-correlation-id": crypto.randomUUID(),
    },
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  try {
    const data = await searchPlayers(query)
    return withCorrelationId({ success: true, data })
  } catch (err) {
    if (err instanceof PlayerServiceError) {
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
