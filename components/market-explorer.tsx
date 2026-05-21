"use client";

import { FormEvent, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";

import { MarketCard } from "@/components/market-card";
import { Button } from "@/components/ui/button";
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

type MarketsApiResponse = {
  markets: MarketSummary[];
  mode: "browse" | "search";
  query: string;
  fetchedAt: string;
};

type SortOption = "volume-desc" | "liquidity-desc" | "end-date-asc" | "category-asc";

export function MarketExplorer({ markets }: MarketExplorerProps) {
  const [displayMarkets, setDisplayMarkets] = useState(markets);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("volume-desc");
  const [isSearching, setIsSearching] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      displayMarkets.map((market) => market.category).filter(Boolean),
    );

    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
  }, [displayMarkets]);

  const filteredAndSortedMarkets = useMemo(() => {
    const filtered = displayMarkets.filter((market) => {
      return selectedCategory === "all" || market.category === selectedCategory;
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
  }, [displayMarkets, selectedCategory, sortOption]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();
    setIsSearching(true);
    setSelectedCategory("all");

    try {
      const url = query
        ? `/api/markets?q=${encodeURIComponent(query)}`
        : "/api/markets";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Market search failed");
      }

      const data = (await response.json()) as MarketsApiResponse;

      setDisplayMarkets(data.markets);
      setActiveSearchQuery(data.query);
    } catch {
      alert("Something went wrong while searching Polymarket.");
    } finally {
      setIsSearching(false);
    }
  }

  async function resetSearch() {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSelectedCategory("all");
    setDisplayMarkets(markets);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search all Polymarket markets..."
            className="pl-9"
          />
        </div>

        <Button type="submit" disabled={isSearching}>
          {isSearching && <RefreshCw className="h-4 w-4 animate-spin" />}
          {isSearching ? "Searching..." : "Search Polymarket"}
        </Button>

        <Button type="button" variant="outline" onClick={resetSearch}>
          Reset
        </Button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
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
        Showing {filteredAndSortedMarkets.length} of {displayMarkets.length} markets
        {activeSearchQuery ? ` for “${activeSearchQuery}”` : " from the default browse feed"}
      </p>

      {filteredAndSortedMarkets.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No markets matched your search or filters. Try a different keyword or category.
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
