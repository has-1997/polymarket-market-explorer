import { NextResponse } from "next/server";

import { fetchActiveMarkets, searchMarkets } from "@/lib/polymarket/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() ?? "";

    const markets = query
      ? await searchMarkets({ query, limitPerType: 20 })
      : await fetchActiveMarkets({ limit: 20 });

    return NextResponse.json({
      markets,
      fetchedAt: new Date().toISOString(),
      mode: query ? "search" : "browse",
      query,
    });
  } catch (error) {
    console.error("Failed to fetch Polymarket markets", error);

    return NextResponse.json(
      {
        error: "Failed to fetch Polymarket markets",
      },
      {
        status: 500,
      },
    );
  }
}
