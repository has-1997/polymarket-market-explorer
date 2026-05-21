import {
  normalizeEventsToMarkets,
  normalizeSingleMarket,
  type MarketSummary,
} from "./normalizers";
import type { GammaEvent, GammaMarket, GammaSearchResponse } from "./types";

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


export async function fetchMarketBySlug(slug: string): Promise<MarketSummary | null> {
  const response = await fetch(
    `${GAMMA_API_BASE_URL}/markets/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Polymarket market lookup failed with status ${response.status}`);
  }

  const market = (await response.json()) as GammaMarket;

  return normalizeSingleMarket(market);
}


export type SearchMarketsOptions = {
  query: string;
  limitPerType?: number;
  page?: number;
};

export async function searchMarkets(
  options: SearchMarketsOptions,
): Promise<MarketSummary[]> {
  const query = options.query.trim();

  if (!query) {
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    limit_per_type: String(options.limitPerType ?? 20),
    page: String(options.page ?? 1),
    events_status: "active",
    keep_closed_markets: "0",
    search_profiles: "false",
  });

  const response = await fetch(`${GAMMA_API_BASE_URL}/public-search?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Polymarket search request failed with status ${response.status}`);
  }

  const searchResponse = (await response.json()) as GammaSearchResponse;

  return normalizeEventsToMarkets(searchResponse.events ?? []);
}
