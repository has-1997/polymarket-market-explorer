import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Droplets, TrendingUp } from "lucide-react";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { WatchlistButton } from "@/components/watchlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { watchlistItems } from "@/db/schema";
import { formatCurrency, formatDate, formatProbability } from "@/lib/formatters";
import { fetchMarketBySlug } from "@/lib/polymarket/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MarketDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function MarketDetailPage({ params }: MarketDetailPageProps) {
  const { slug } = await params;
  const market = await fetchMarketBySlug(slug);

  if (!market) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const savedItems = user
    ? await db
        .select({ id: watchlistItems.id })
        .from(watchlistItems)
        .where(
          and(
            eq(watchlistItems.userId, user.id),
            eq(watchlistItems.marketId, market.id),
          ),
        )
        .limit(1)
    : [];

  const isSaved = savedItems.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
          <Button asChild variant="outline" className="w-fit">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to markets
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
              {market.image ? (
                <Image
                  src={market.image}
                  alt=""
                  fill
                  sizes="280px"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{market.category}</Badge>
                <Badge variant={market.closed ? "destructive" : "default"}>
                  {market.closed ? "Closed" : "Open"}
                </Badge>
                {market.active && <Badge variant="outline">Active</Badge>}
                <WatchlistButton market={market} initiallySaved={isSaved} />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {market.eventTitle}
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {market.question}
                </h1>
                {market.description && (
                  <p className="text-muted-foreground">{market.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {market.outcomes.map((outcome) => (
                <div
                  key={outcome.name}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{outcome.name}</p>
                    <p className="text-2xl font-semibold">
                      {formatProbability(outcome.price)}
                    </p>
                  </div>

                  {outcome.tokenId && (
                    <div className="mt-3 rounded-lg bg-muted p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        CLOB token ID
                      </p>
                      <p className="mt-1 break-all font-mono text-xs">
                        {outcome.tokenId}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {market.tags.length === 0 ? (
                <p className="text-muted-foreground">No tags available.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {market.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Volume
                </span>
                <span className="font-medium">{formatCurrency(market.volume)}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  Liquidity
                </span>
                <span className="font-medium">{formatCurrency(market.liquidity)}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  End date
                </span>
                <span className="font-medium">{formatDate(market.endDate)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identifiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Market ID</p>
                <p className="font-mono">{market.id}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Market slug</p>
                <p className="break-all font-mono text-xs">{market.slug}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Event slug</p>
                <p className="break-all font-mono text-xs">{market.eventSlug}</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
