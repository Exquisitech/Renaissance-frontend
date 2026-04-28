"use client"

import { useMemo, useState } from "react"
import { Play, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showApiErrorToast } from "@/hooks/use-toast"
import { apiRequest, extractCorrelationId, normalizeApiError } from "@/lib/api/client"
import { type ApiEndpointDoc } from "@/lib/api/docs"
import { cn } from "@/lib/utils"

interface EndpointCardProps {
  endpoint: ApiEndpointDoc
  authToken: string
}

const METHOD_STYLES: Record<ApiEndpointDoc["method"], string> = {
  GET: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  POST: "border-sky-500/40 bg-sky-500/10 text-sky-100",
  PATCH: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  DELETE: "border-rose-500/40 bg-rose-500/10 text-rose-100",
}

function buildResolvedPath(path: string, values: Record<string, string>) {
  return path.replace(/\{([^}]+)\}/g, (_, key: string) => values[key] ?? `{${key}}`)
}

function buildCodeSnippets(endpoint: ApiEndpointDoc, resolvedPath: string, authToken: string, bodyText: string) {
  const token = authToken || "<jwt-token>"
  const hasRequestBody = Boolean(endpoint.requestBody && endpoint.method !== "GET")
  const compactBodyText = bodyText.replace(/\n/g, "")
  const curlLines = [
    `curl -X ${endpoint.method} "${resolvedPath}" \\`,
    `  -H "Content-Type: application/json"${endpoint.authRequired || hasRequestBody ? " \\" : ""}`,
    endpoint.authRequired ? `  -H "Authorization: Bearer ${token}"${hasRequestBody ? " \\" : ""}` : null,
    hasRequestBody ? `  -d '${compactBodyText}'` : null,
  ].filter(Boolean)

  const javascriptHeaders = endpoint.authRequired
    ? `    "Content-Type": "application/json",\n    "Authorization": "Bearer ${token}",`
    : `    "Content-Type": "application/json",`
  const javascriptBody = hasRequestBody
    ? `,\n  body: JSON.stringify(${bodyText})`
    : ""

  const pythonHeaderEntries = endpoint.authRequired
    ? `    "Authorization": "Bearer ${token}",\n    "Content-Type": "application/json",`
    : `    "Content-Type": "application/json",`
  const pythonJsonBlock = hasRequestBody
    ? `,\n    json=${bodyText}`
    : ""

  return {
    curl: curlLines.join("\n"),
    javascript: `const response = await fetch("${resolvedPath}", {
  method: "${endpoint.method}",
  headers: {
${javascriptHeaders}
  }${javascriptBody}
})

const data = await response.json()`,
    python: `import requests

response = requests.request(
    "${endpoint.method}",
    "${resolvedPath}",
    headers={
${pythonHeaderEntries}
    }${pythonJsonBlock}
)

print(response.json())`,
  }
}

async function formatResponsePayload(response: Response) {
  const text = await response.text()

  if (!text) {
    return ""
  }

  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2)
    } catch {
      return text
    }
  }

  return text
}

export function EndpointCard({ endpoint, authToken }: EndpointCardProps) {
  const [parameterValues, setParameterValues] = useState<Record<string, string>>(() => {
    return Object.fromEntries(
      (endpoint.parameters ?? []).map((parameter) => [parameter.name, parameter.example ?? ""])
    )
  })
  const [requestBodyText, setRequestBodyText] = useState(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody.example, null, 2) : "{}"
  )
  const [result, setResult] = useState("")
  const [status, setStatus] = useState<number | null>(null)
  const [correlationId, setCorrelationId] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const resolvedPath = useMemo(() => buildResolvedPath(endpoint.path, parameterValues), [endpoint.path, parameterValues])
  const snippets = useMemo(
    () => buildCodeSnippets(endpoint, resolvedPath, authToken, requestBodyText),
    [authToken, endpoint, requestBodyText, resolvedPath]
  )

  const handleTryItOut = async () => {
    setLoading(true)
    try {
      const query = Object.fromEntries(
        (endpoint.parameters ?? [])
          .filter((parameter) => parameter.in === "query")
          .map((parameter) => [parameter.name, parameterValues[parameter.name]])
      )

      const body = endpoint.requestBody && endpoint.method !== "GET"
        ? JSON.stringify(JSON.parse(requestBodyText))
        : undefined

      const response = await apiRequest<Response>(resolvedPath, {
        method: endpoint.method,
        authToken: endpoint.authRequired ? authToken : undefined,
        query,
        body,
        parseAs: "response",
      })

      const payload = await formatResponsePayload(response)
      setStatus(response.status)
      setCorrelationId(extractCorrelationId(response.headers))
      setResult(payload)
    } catch (error) {
      const normalized = normalizeApiError(error, "Request failed")
      showApiErrorToast(error, endpoint.summary)
      setStatus(normalized.status ?? null)
      setCorrelationId(normalized.correlationId)
      setResult(JSON.stringify({ success: false, error: normalized.message }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={cn("font-mono", METHOD_STYLES[endpoint.method])}>
            {endpoint.method}
          </Badge>
          <code className="rounded-md bg-muted px-3 py-1 text-sm">{endpoint.path}</code>
          {endpoint.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div>
          <CardTitle>{endpoint.summary}</CardTitle>
          <CardDescription>{endpoint.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {endpoint.authRequired ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              JWT authentication required
            </p>
            <p className="mt-1 text-muted-foreground">Pass a bearer token to the Authorization header before calling this endpoint.</p>
          </div>
        ) : null}

        {(endpoint.parameters ?? []).length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Parameters</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {endpoint.parameters?.map((parameter) => (
                <div key={`${endpoint.id}-${parameter.name}`} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <Label htmlFor={`${endpoint.id}-${parameter.name}`}>{parameter.name}</Label>
                  <Input
                    id={`${endpoint.id}-${parameter.name}`}
                    value={parameterValues[parameter.name] ?? ""}
                    onChange={(event) => {
                      setParameterValues((current) => ({
                        ...current,
                        [parameter.name]: event.target.value,
                      }))
                    }}
                    placeholder={parameter.example}
                  />
                  <p className="text-xs text-muted-foreground">{parameter.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {endpoint.requestBody ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Request body</h3>
            <textarea
              value={requestBodyText}
              onChange={(event) => setRequestBodyText(event.target.value)}
              className="min-h-40 w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm"
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Responses</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {endpoint.responses.map((response) => (
              <div key={`${endpoint.id}-${response.status}`} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="font-semibold">{response.status}</p>
                <p className="mt-1 text-sm text-muted-foreground">{response.description}</p>
                <pre className="mt-3 overflow-auto rounded-lg bg-background p-3 text-xs">{JSON.stringify(response.example, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="curl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Code snippets</h3>
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="curl">
            <pre className="overflow-auto rounded-xl bg-[#06101f] p-4 text-xs text-slate-100">{snippets.curl}</pre>
          </TabsContent>
          <TabsContent value="javascript">
            <pre className="overflow-auto rounded-xl bg-[#06101f] p-4 text-xs text-slate-100">{snippets.javascript}</pre>
          </TabsContent>
          <TabsContent value="python">
            <pre className="overflow-auto rounded-xl bg-[#06101f] p-4 text-xs text-slate-100">{snippets.python}</pre>
          </TabsContent>
        </Tabs>

        <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Try it out</p>
              <p className="text-xs text-muted-foreground">Run the request directly from the UI using the current auth token and parameter values.</p>
            </div>
            <Button onClick={handleTryItOut} disabled={loading}>
              <Play className="h-4 w-4" />
              {loading ? "Running..." : "Send request"}
            </Button>
          </div>
          <div className="rounded-xl bg-background p-4">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Status: {status ?? "Not run"}</span>
              <span>Correlation ID: {correlationId ?? "Unavailable"}</span>
            </div>
            <pre className="mt-4 overflow-auto text-xs">{result || "Run the request to inspect the response body."}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
