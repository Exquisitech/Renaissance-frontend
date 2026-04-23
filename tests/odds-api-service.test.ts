import { describe, expect, it, vi } from "vitest"
import { OddsAPIService, OddsServiceError } from "@/lib/odds-api-service"

describe("OddsAPIService", () => {
  it("requests sport odds with expected path and params", async () => {
    const get = vi.fn().mockResolvedValue({ data: [] })
    const service = new OddsAPIService("test-key", { get } as never)

    await service.getOdds({
      sportKey: "soccer_epl",
      regions: "uk",
      markets: "h2h",
      oddsFormat: "decimal",
      dateFormat: "iso",
    })

    expect(get).toHaveBeenCalledTimes(1)
    const [path, config] = get.mock.calls[0]

    expect(path).toBe("/sports/soccer_epl/odds/")
    expect(config?.params).toMatchObject({
      apiKey: "test-key",
      regions: "uk",
      markets: "h2h",
      oddsFormat: "decimal",
      dateFormat: "iso",
    })
  })

  it("requests single event odds with expected path and params", async () => {
    const get = vi.fn().mockResolvedValue({ data: { id: "evt1" } })
    const service = new OddsAPIService("test-key", { get } as never)

    await service.getEventOdds({
      sportKey: "soccer_epl",
      eventId: "evt1",
      regions: "uk",
      markets: "h2h",
    })

    expect(get).toHaveBeenCalledTimes(1)
    const [path, config] = get.mock.calls[0]

    expect(path).toBe("/sports/soccer_epl/events/evt1/odds")
    expect(config?.params).toMatchObject({
      apiKey: "test-key",
      regions: "uk",
      markets: "h2h",
    })
  })

  it("throws a 503 error when API key is missing", async () => {
    const get = vi.fn()
    const service = new OddsAPIService("", { get } as never)

    await expect(
      service.getOdds({ sportKey: "soccer_epl", regions: "uk", markets: "h2h" }),
    ).rejects.toMatchObject<Partial<OddsServiceError>>({
      statusCode: 503,
    })
  })
})

