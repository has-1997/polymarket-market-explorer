import { Activity, RefreshCw } from "lucide-react";

import { MarketExplorer } from "@/components/market-explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchActiveMarkets } from "@/lib/polymarket/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const markets = await fetchActiveMarkets({ limit: 20 });

    return (
      <main className="min-h-screen bg-background">
        <section className="border-b">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10">
            <Badge className="w-fit" variant="secondary">
              Live Polymarket data
            </Badge>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Polymarket Market Explorer
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Browse active prediction markets, inspect outcomes and prices,
                  and discover markets by volume, liquidity, and category.
                </p>
              </div>

              <Button variant="outline" disabled>
                <RefreshCw className="h-4 w-4" />
                Manual refresh coming soon
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Loaded markets</p>
                <p className="text-2xl font-semibold">{markets.length}</p>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Data source</p>
                <p className="text-2xl font-semibold">Gamma API</p>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="text-2xl font-semibold">Read only</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">Active markets</h2>
          </div>

          {markets.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              No active markets were found. Try refreshing later.
            </div>
          ) : (
            <MarketExplorer markets={markets} />
          )}
        </section>
      </main>
    );
  } catch {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-xl border p-8 text-center">
          <h1 className="text-2xl font-semibold">Could not load markets</h1>
          <p className="mt-3 text-muted-foreground">
            The Polymarket API request failed. Please try again in a moment.
          </p>
        </div>
      </main>
    );
  }
}
