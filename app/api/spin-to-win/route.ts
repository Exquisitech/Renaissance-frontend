import { NextResponse } from "next/server"
import { getSession, updateSession } from "@/app/api/spin/sessions/store"

const prizeTable = [
  { prize: "Player NFT", payout: 75 },
  { prize: "2 XLM", payout: 2 },
  { prize: "25 XLM", payout: 25 },
  { prize: "0 XLM", payout: 0 },
]

function withCorrelationId<T>(payload: T, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "x-correlation-id": crypto.randomUUID(),
    },
  })
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    sessionId?: string
    stakeAmount?: number
  }

  if (!body.sessionId || !body.stakeAmount) {
    return withCorrelationId(
      {
        success: false,
        error: "sessionId and stakeAmount are required",
      },
      { status: 400 }
    )
  }

  const session = getSession(body.sessionId)

  if (!session) {
    return withCorrelationId(
      {
        success: false,
        error: "Spin session not found",
      },
      { status: 404 }
    )
  }

  if (session.status !== "active") {
    return withCorrelationId(
      {
        success: false,
        error: "Spin session is no longer active",
      },
      { status: 409 }
    )
  }

  const prizeIndex = Math.floor(Date.now() / 1000) % prizeTable.length
  const selectedPrize = prizeTable[prizeIndex]
  const updatedSession = updateSession(session.sessionId, {
    status: "completed",
    prize: selectedPrize.prize,
  })

  return withCorrelationId({
    success: true,
    data: {
      prize: selectedPrize.prize,
      newBalance: 100 - body.stakeAmount + selectedPrize.payout,
      session: updatedSession,
    },
  })
}