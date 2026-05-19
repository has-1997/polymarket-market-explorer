"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { MarketCard } from "@/components/market-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MarketSummary } from "@/lib/polymarket/normalizers";

type MarketExplorerProps = {
  markets: MarketSummary[];
};

type SortOption = "volume-desc" | "liquidity-desc" | "end-date-asc" | "category-asc";

export function MarketExplorer({ markets }: MarketExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("volume-desc");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      markets.map((market) => market.category).filter(Boolean),
    );

    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
  }, [markets]);

  const filteredAndSortedMarkets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = markets.filter((market) => {
      const matchesCategory =
        selectedCategory === "all" || market.category === selectedCategory;

      const searchableText = [
        market.question,
        market.eventTitle,
        market.category,
        ...market.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((firstMarket, secondMarket) => {
      if (sortOption === "volume-desc") {
        return secondMarket.volume - firstMarket.volume;
      }

      if (sortOption === "liquidity-desc") {
        return secondMarket.liquidity - firstMarket.liquidity;
      }

      if (sortOption === "end-date-asc") {
        const firstTime = firstMarket.endDate
          ? new Date(firstMarket.endDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        const secondTime = secondMarket.endDate
          ? new Date(secondMarket.endDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        return firstTime - secondTime;
      }

      return firstMarket.category.localeCompare(secondMarket.category);
    });
  }, [markets, searchQuery, selectedCategory, sortOption]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search markets, events, or tags..."
            className="pl-9"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort markets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume-desc">Highest volume</SelectItem>
            <SelectItem value="liquidity-desc">Highest liquidity</SelectItem>
            <SelectItem value="end-date-asc">Ending soonest</SelectItem>
            <SelectItem value="category-asc">Category A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredAndSortedMarkets.length} of {markets.length} markets
      </p>

      {filteredAndSortedMarkets.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No markets matched your filters. Try a different keyword or category.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedMarkets.map((market, index) => (
            <MarketCard
              key={market.id}
              market={market}
              imagePriority={index < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
