import { NextResponse } from "next/server"
import { createSession, getCurrentSession } from "./store"

function withCorrelationId<T>(payload: T, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "x-correlation-id": crypto.randomUUID(),
    },
  })
}

export async function GET() {
  return withCorrelationId({
    success: true,
    data: getCurrentSession(),
  })
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    stakeAmount?: number
    idempotencyKey?: string
  }

  if (!body.stakeAmount || body.stakeAmount < 10) {
    return withCorrelationId(
      {
        success: false,
        error: "Minimum stake is 10 XLM",
      },
      { status: 400 }
    )
  }

  if (!body.idempotencyKey) {
    return withCorrelationId(
      {
        success: false,
        error: "Missing idempotency key",
      },
      { status: 400 }
    )
  }

  const session = createSession(body.stakeAmount, body.idempotencyKey)

  return withCorrelationId(
    {
      success: true,
      data: session,
    },
    { status: session.idempotencyKey === body.idempotencyKey ? 201 : 200 }
  )
}