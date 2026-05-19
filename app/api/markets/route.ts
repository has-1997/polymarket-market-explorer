import { NextResponse } from "next/server";

import { fetchActiveMarkets } from "@/lib/polymarket/client";

export async function GET() {
  try {
    const markets = await fetchActiveMarkets({ limit: 20 });

    return NextResponse.json({
      markets,
      fetchedAt: new Date().toISOString(),
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
