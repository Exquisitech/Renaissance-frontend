import { NextResponse } from "next/server"
import { searchPlayers, PlayerServiceError } from "@/lib/rapidapi-player-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  try {
    const data = await searchPlayers(query)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    if (err instanceof PlayerServiceError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: err.statusCode },
      )
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}
