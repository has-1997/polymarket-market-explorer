import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Droplets, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency, formatDate, formatProbability } from "@/lib/formatters";
import type { MarketSummary } from "@/lib/polymarket/normalizers";

type MarketCardProps = {
  market: MarketSummary;
  imagePriority?: boolean;
};

export function MarketCard({ market, imagePriority = false }: MarketCardProps) {
  return (
    <Link href={`/markets/${market.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          {market.image ? (
            <Image
              src={market.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              loading={imagePriority ? "eager" : "lazy"}
              fetchPriority={imagePriority ? "high" : "auto"}
              className="object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{market.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {market.outcomes.length} outcomes
            </span>
          </div>

          <h2 className="line-clamp-3 text-base font-semibold leading-snug">
            {market.question}
          </h2>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="grid gap-2">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <div
                key={outcome.name}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span className="truncate">{outcome.name}</span>
                <span className="font-medium">
                  {formatProbability(outcome.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Volume
              </span>
              <span>{formatCurrency(market.volume)}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Liquidity
              </span>
              <span>{formatCurrency(market.liquidity)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Ends {formatDate(market.endDate)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
