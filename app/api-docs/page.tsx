"use client"

import { useMemo, useState } from "react"
import { FileCode2, Search, ShieldCheck, TableProperties } from "lucide-react"
import { Header } from "@/components/header"
import { EndpointCard } from "@/components/docs/EndpointCard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { apiDocTags, apiDocumentation } from "@/lib/api/docs"

export default function ApiDocsPage() {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [authToken, setAuthToken] = useState(apiDocumentation.authExample)

  const filteredEndpoints = useMemo(() => {
    const query = search.trim().toLowerCase()

    return apiDocumentation.endpoints.filter((endpoint) => {
      const matchesTag = selectedTag === "all" || endpoint.tags.includes(selectedTag)
      const matchesQuery = !query
        || endpoint.summary.toLowerCase().includes(query)
        || endpoint.path.toLowerCase().includes(query)
        || endpoint.description.toLowerCase().includes(query)

      return matchesTag && matchesQuery
    })
  }, [search, selectedTag])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(190,24,93,0.18),_transparent_30%),linear-gradient(180deg,#050a14_0%,#091524_100%)]">
      <Header showAuthButtons={false} />
      <main className="container space-y-8 px-4 py-10 md:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="border-white/10 bg-slate-950/70 text-white shadow-2xl">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-fit border-cyan-500/30 bg-cyan-500/10 text-cyan-100">
                {apiDocumentation.version}
              </Badge>
              <div className="space-y-3">
                <CardTitle className="text-4xl tracking-tight">{apiDocumentation.title}</CardTitle>
                <CardDescription className="max-w-2xl text-base text-slate-300">
                  Browse Swagger-style endpoint details, inspect request and response examples, and execute calls directly from the UI.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Endpoints</p>
                <p className="mt-3 text-3xl font-semibold">{apiDocumentation.endpoints.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tags</p>
                <p className="mt-3 text-3xl font-semibold">{apiDocTags.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Try-it-out</p>
                <p className="mt-3 text-lg font-semibold">Enabled</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-950/70 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                Authentication
              </CardTitle>
              <CardDescription className="text-slate-300">
                Protected endpoints expect a JWT bearer token. The token below is used by each endpoint card when you click try-it-out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={authToken} onChange={(event) => setAuthToken(event.target.value)} />
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">JWT example</p>
                <pre className="mt-3 overflow-auto text-xs text-cyan-100">Authorization: Bearer {apiDocumentation.authExample}</pre>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="border-border/60 bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableProperties className="h-5 w-5 text-primary" />
                Error codes
              </CardTitle>
              <CardDescription>Common platform-wide responses and what they mean.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiDocumentation.errorCodes.map((errorCode) => (
                <div key={errorCode.code} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{errorCode.code}</p>
                    <Badge variant="outline">{errorCode.title}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{errorCode.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-primary" />
                Find an endpoint
              </CardTitle>
              <CardDescription>Search by summary, path, or description, then narrow the result set by tag.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search endpoints" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <Select
                value={selectedTag}
                onValueChange={setSelectedTag}
                options={[{ value: "all", label: "All tags" }, ...apiDocTags.map((tag) => ({ value: tag, label: tag }))]}
              />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          {filteredEndpoints.length === 0 ? (
            <Card className="border-border/60 bg-card/85">
              <CardContent className="py-10 text-center text-muted-foreground">
                No endpoints matched the current filters.
              </CardContent>
            </Card>
          ) : (
            filteredEndpoints.map((endpoint) => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} authToken={authToken} />
            ))
          )}
        </section>
      </main>
    </div>
  )
}