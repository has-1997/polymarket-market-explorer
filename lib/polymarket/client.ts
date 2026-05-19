import { normalizeEventsToMarkets, type MarketSummary } from "./normalizers";
import type { GammaEvent } from "./types";

const GAMMA_API_BASE_URL = "https://gamma-api.polymarket.com";

export type FetchActiveMarketsOptions = {
  limit?: number;
  offset?: number;
};

export async function fetchActiveMarkets(
  options: FetchActiveMarketsOptions = {},
): Promise<MarketSummary[]> {
  const params = new URLSearchParams({
    active: "true",
    closed: "false",
    limit: String(options.limit ?? 20),
    offset: String(options.offset ?? 0),
  });

  const response = await fetch(`${GAMMA_API_BASE_URL}/events?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Polymarket API request failed with status ${response.status}`);
  }

  const events = (await response.json()) as GammaEvent[];

  return normalizeEventsToMarkets(events);
}
