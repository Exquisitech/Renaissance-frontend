import { NextRequest, NextResponse } from "next/server"
import { deleteSession, getSession, updateSession } from "../store"

function withCorrelationId<T>(payload: T, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "x-correlation-id": crypto.randomUUID(),
    },
  })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const session = getSession(sessionId)

  if (!session) {
    return withCorrelationId(
      {
        success: false,
        error: "Spin session not found",
      },
      { status: 404 }
    )
  }

  return withCorrelationId({ success: true, data: session })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const body = (await request.json()) as {
    status?: "active" | "completed" | "expired"
    prize?: string
  }

  const session = updateSession(sessionId, body)

  if (!session) {
    return withCorrelationId(
      {
        success: false,
        error: "Spin session not found",
      },
      { status: 404 }
    )
  }

  return withCorrelationId({ success: true, data: session })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  deleteSession(sessionId)

  return new Response(null, {
    status: 204,
    headers: {
      "x-correlation-id": crypto.randomUUID(),
    },
  })
}