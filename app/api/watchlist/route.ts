import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { watchlistItems } from "@/db/schema";
import type { MarketSummary } from "@/lib/polymarket/normalizers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(watchlistItems)
    .where(eq(watchlistItems.userId, user.id))
    .orderBy(desc(watchlistItems.createdAt));

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as { market?: MarketSummary };
  const market = body.market;

  if (!market) {
    return NextResponse.json({ error: "Missing market" }, { status: 400 });
  }

  await db
    .insert(watchlistItems)
    .values({
      userId: user.id,
      marketId: market.id,
      marketSlug: market.slug,
      eventSlug: market.eventSlug,
      question: market.question,
      image: market.image || null,
      category: market.category,
      volume: String(market.volume),
      liquidity: String(market.liquidity),
      endDate: market.endDate ? new Date(market.endDate) : null,
    })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as { marketId?: string };

  if (!body.marketId) {
    return NextResponse.json({ error: "Missing marketId" }, { status: 400 });
  }

  await db
    .delete(watchlistItems)
    .where(
      and(
        eq(watchlistItems.userId, user.id),
        eq(watchlistItems.marketId, body.marketId),
      ),
    );

  return NextResponse.json({ ok: true });
}
