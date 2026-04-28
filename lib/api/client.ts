export const CORRELATION_ID_HEADERS = [
  "x-correlation-id",
  "x-request-id",
  "x-trace-id",
  "traceparent",
] as const

export interface ApiRequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | null | undefined>
  authToken?: string
  parseAs?: "json" | "text" | "response"
}

export interface NormalizedApiError {
  message: string
  correlationId?: string
  status?: number
}

export class ApiClientError extends Error {
  status?: number
  correlationId?: string
  details?: unknown

  constructor(
    message: string,
    options?: {
      status?: number
      correlationId?: string
      details?: unknown
      cause?: unknown
    }
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined)
    this.name = "ApiClientError"
    this.status = options?.status
    this.correlationId = options?.correlationId
    this.details = options?.details
  }
}

function buildUrl(
  input: string,
  query?: Record<string, string | number | boolean | null | undefined>
) {
  if (!query) return input

  const base = typeof window === "undefined" ? "http://localhost" : window.location.origin
  const url = new URL(input, base)

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return
    }

    url.searchParams.set(key, String(value))
  })

  return input.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

function extractMessage(payload: unknown) {
  if (!payload) return undefined

  if (typeof payload === "string") {
    return payload
  }

  if (typeof payload === "object") {
    const candidate = payload as Record<string, unknown>
    const value = candidate.message ?? candidate.error ?? candidate.title

    if (typeof value === "string") {
      return value
    }
  }

  return undefined
}

export function extractCorrelationId(headers?: Headers | null) {
  if (!headers) return undefined

  for (const headerName of CORRELATION_ID_HEADERS) {
    const value = headers.get(headerName)

    if (value) {
      return value
    }
  }

  return undefined
}

export function normalizeApiError(
  error: unknown,
  fallbackMessage = "Something went wrong"
): NormalizedApiError {
  if (error instanceof ApiClientError) {
    return {
      message: error.message || fallbackMessage,
      correlationId: error.correlationId,
      status: error.status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || fallbackMessage,
    }
  }

  return { message: fallbackMessage }
}

export function buildErrorReport(error: NormalizedApiError) {
  return [
    "Renaissance error report",
    `Message: ${error.message}`,
    `Correlation ID: ${error.correlationId ?? "Unavailable"}`,
    `Status: ${error.status ?? "Unavailable"}`,
  ].join("\n")
}

export async function apiRequest<T>(
  input: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    authToken,
    headers,
    parseAs = "json",
    query,
    ...init
  } = options

  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has("Content-Type") && init.body) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`)
  }

  let response: Response

  try {
    response = await fetch(buildUrl(input, query), {
      ...init,
      headers: requestHeaders,
    })
  } catch (error) {
    throw new ApiClientError("Network request failed", {
      cause: error,
    })
  }

  if (!response.ok) {
    const payload = await parseResponseBody(response)
    throw new ApiClientError(
      extractMessage(payload) ?? `Request failed with status ${response.status}`,
      {
        status: response.status,
        correlationId: extractCorrelationId(response.headers),
        details: payload,
      }
    )
  }

  if (parseAs === "response") {
    return response as T
  }

  if (parseAs === "text") {
    return (await response.text()) as T
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await parseResponseBody(response)) as T
}