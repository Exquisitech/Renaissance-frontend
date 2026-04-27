export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

export interface ApiParameter {
  name: string
  in: "path" | "query" | "header"
  required?: boolean
  description: string
  example?: string
}

export interface ApiRequestBody {
  description: string
  example: Record<string, unknown>
}

export interface ApiResponseDoc {
  status: number
  description: string
  example: Record<string, unknown>
}

export interface ApiEndpointDoc {
  id: string
  method: HttpMethod
  path: string
  summary: string
  description: string
  tags: string[]
  authRequired?: boolean
  parameters?: ApiParameter[]
  requestBody?: ApiRequestBody
  responses: ApiResponseDoc[]
}

export interface ErrorCodeDoc {
  code: number
  title: string
  description: string
}

export const apiDocumentation = {
  title: "Renaissance API",
  version: "v1",
  authExample: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.signature",
  endpoints: [
    {
      id: "players-search",
      method: "GET",
      path: "/api/players/search",
      summary: "Search players by keyword",
      description:
        "Returns player suggestions and profile fragments for the global search experience.",
      tags: ["Players", "Search"],
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Search text for player or club lookup.",
          example: "messi",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Player search results.",
          example: {
            success: true,
            data: [{ id: 10, name: "Lionel Messi", team: "Inter Miami" }],
          },
        },
      ],
    },
    {
      id: "odds-list",
      method: "GET",
      path: "/api/odds",
      summary: "Fetch market odds",
      description:
        "Returns market odds for a sport, region, and market combination.",
      tags: ["Odds"],
      parameters: [
        {
          name: "sportKey",
          in: "query",
          description: "Odds API sport key.",
          example: "soccer_epl",
        },
        {
          name: "region",
          in: "query",
          description: "Betting region.",
          example: "uk",
        },
        {
          name: "market",
          in: "query",
          description: "Market type.",
          example: "h2h",
        },
      ],
      responses: [
        {
          status: 200,
          description: "List of event odds.",
          example: { success: true, data: [{ id: "evt_001", home_team: "Arsenal" }] },
        },
      ],
    },
    {
      id: "odds-event",
      method: "GET",
      path: "/api/odds/{eventId}",
      summary: "Fetch odds for a single event",
      description:
        "Returns detailed odds for a specific event, including books and lines.",
      tags: ["Odds"],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          description: "The event identifier returned by /api/odds.",
          example: "evt_001",
        },
        {
          name: "sportKey",
          in: "query",
          description: "Odds API sport key.",
          example: "soccer_epl",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Detailed odds for the selected event.",
          example: { success: true, data: { id: "evt_001", bookmakers: [] } },
        },
      ],
    },
    {
      id: "database-health",
      method: "GET",
      path: "/health/database",
      summary: "Read database pool health",
      description:
        "Returns real-time connection pool health, utilization, queue pressure, and slow query metrics for admin monitoring.",
      tags: ["Admin", "Health"],
      authRequired: true,
      responses: [
        {
          status: 200,
          description: "Current database health snapshot.",
          example: {
            success: true,
            data: {
              activeConnections: 58,
              idleConnections: 17,
              waitQueueSize: 4,
              slowQueryCount: 3,
              lastQueryAt: "2026-04-27T11:24:00.000Z",
              lastQueryTimeMs: 148,
              maxConnections: 80,
              utilizationPct: 72.5,
              status: "healthy",
            },
          },
        },
      ],
    },
    {
      id: "spin-session-start",
      method: "POST",
      path: "/api/spin/sessions",
      summary: "Start a spin session",
      description:
        "Creates an idempotent spin session that can later be used to submit a spin result.",
      tags: ["Spin"],
      authRequired: true,
      requestBody: {
        description: "Session creation payload.",
        example: { stakeAmount: 25, idempotencyKey: "spin-1745751445000" },
      },
      responses: [
        {
          status: 201,
          description: "Spin session started.",
          example: {
            success: true,
            data: {
              sessionId: "spin_12345",
              status: "active",
              stakeAmount: 25,
              expiresAt: "2026-04-27T11:29:00.000Z",
            },
          },
        },
      ],
    },
    {
      id: "spin-session-status",
      method: "GET",
      path: "/api/spin/sessions/{sessionId}",
      summary: "Get spin session status",
      description:
        "Retrieves the status of an existing spin session so clients can track active, completed, or expired sessions.",
      tags: ["Spin"],
      authRequired: true,
      parameters: [
        {
          name: "sessionId",
          in: "path",
          required: true,
          description: "The active spin session identifier.",
          example: "spin_12345",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Current session status.",
          example: {
            success: true,
            data: {
              sessionId: "spin_12345",
              status: "completed",
              prize: "25 XLM",
            },
          },
        },
      ],
    },
    {
      id: "spin-submit",
      method: "POST",
      path: "/api/spin-to-win",
      summary: "Submit a spin outcome",
      description:
        "Consumes an active spin session, resolves a prize, and completes the lifecycle for the current spin.",
      tags: ["Spin"],
      authRequired: true,
      requestBody: {
        description: "Spin execution payload.",
        example: { sessionId: "spin_12345", stakeAmount: 25 },
      },
      responses: [
        {
          status: 200,
          description: "Spin completed.",
          example: {
            success: true,
            data: {
              prize: "Player NFT",
              newBalance: 125,
              session: { sessionId: "spin_12345", status: "completed" },
            },
          },
        },
      ],
    },
  ] satisfies ApiEndpointDoc[],
  errorCodes: [
    {
      code: 400,
      title: "Bad Request",
      description: "The payload or query parameters were invalid.",
    },
    {
      code: 401,
      title: "Unauthorized",
      description: "The provided JWT token was missing, expired, or invalid.",
    },
    {
      code: 404,
      title: "Not Found",
      description: "The requested resource could not be located.",
    },
    {
      code: 409,
      title: "Conflict",
      description: "The request conflicts with current state, such as duplicate spin submission.",
    },
    {
      code: 429,
      title: "Rate Limited",
      description: "The caller exceeded an endpoint-specific request threshold.",
    },
    {
      code: 500,
      title: "Internal Server Error",
      description: "The server failed to process the request.",
    },
    {
      code: 503,
      title: "Service Unavailable",
      description: "An upstream provider or dependent service was unavailable.",
    },
  ] satisfies ErrorCodeDoc[],
}

export const apiDocTags = Array.from(
  new Set(apiDocumentation.endpoints.flatMap((endpoint) => endpoint.tags))
).sort()