import type { GammaEvent, GammaMarket } from "./types";

export type MarketOutcome = {
  name: string;
  price: number | null;
  tokenId: string | null;
};

export type MarketSummary = {
  id: string;
  slug: string;
  eventSlug: string;
  question: string;
  eventTitle: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  outcomes: MarketOutcome[];
  volume: number;
  liquidity: number;
  endDate: string | null;
  active: boolean;
  closed: boolean;
};

function parseJsonStringArray(value?: string): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function toNumber(value: string | number | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeMarket(event: GammaEvent, market: GammaMarket): MarketSummary {
  const outcomes = parseJsonStringArray(market.outcomes);
  const prices = parseJsonStringArray(market.outcomePrices);
  const tokenIds = parseJsonStringArray(market.clobTokenIds);
  const tagLabels = event.tags?.map((tag) => tag.label) ?? [];

  return {
    id: market.id,
    slug: market.slug,
    eventSlug: event.slug,
    question: market.question,
    eventTitle: event.title,
    description: market.description ?? event.description ?? "",
    image: market.image ?? market.icon ?? event.image ?? event.icon ?? "",
    category: tagLabels[0] ?? "Uncategorized",
    tags: tagLabels,
    outcomes: outcomes.map((name, index) => ({
      name,
      price: prices[index] === undefined ? null : toNumber(prices[index]),
      tokenId: tokenIds[index] ?? null,
    })),
    volume: toNumber(market.volumeNum ?? market.volume ?? event.volume),
    liquidity: toNumber(market.liquidityNum ?? market.liquidity ?? event.liquidity),
    endDate: market.endDate ?? market.endDateIso ?? event.endDate ?? null,
    active: market.active,
    closed: market.closed,
  };
}

export function normalizeEventsToMarkets(events: GammaEvent[]): MarketSummary[] {
  return events.flatMap((event) =>
    (event.markets ?? [])
      .filter((market) => market.active && !market.closed)
      .map((market) => normalizeMarket(event, market)),
  );
}
