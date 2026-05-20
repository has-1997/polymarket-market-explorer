import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { RemoveWatchlistButton } from "@/components/remove-watchlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/db";
import { watchlistItems } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
        <Badge variant="secondary">Login required</Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Save markets to your watchlist
        </h1>
        <p className="mt-3 text-muted-foreground">
          Create an account or log in to save Polymarket markets you want to revisit.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </main>
    );
  }

  const items = await db
    .select()
    .from(watchlistItems)
    .where(eq(watchlistItems.userId, user.id))
    .orderBy(desc(watchlistItems.createdAt));

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Badge variant="secondary">Personal watchlist</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Your saved markets
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Revisit markets you saved while browsing Polymarket data.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-xl font-semibold">No saved markets yet</h2>
            <p className="mt-2 text-muted-foreground">
              Browse markets and click Save on a detail page to build your watchlist.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Browse markets</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="flex h-full flex-col overflow-hidden">
                <Link href={`/markets/${item.marketSlug}`} className="block">
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                </Link>

                <CardHeader className="space-y-3">
                  <Badge variant="secondary" className="w-fit">
                    {item.category}
                  </Badge>
                  <Link href={`/markets/${item.marketSlug}`}>
                    <h2 className="line-clamp-3 text-base font-semibold leading-snug hover:underline">
                      {item.question}
                    </h2>
                  </Link>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span>Volume</span>
                    <span>{formatCurrency(Number(item.volume))}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>Liquidity</span>
                    <span>{formatCurrency(Number(item.liquidity))}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>Ends</span>
                    <span>{formatDate(item.endDate?.toISOString() ?? null)}</span>
                  </div>
                </CardContent>

                <CardFooter className="border-t">
                  <RemoveWatchlistButton marketId={item.marketId} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
