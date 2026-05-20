"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { MarketSummary } from "@/lib/polymarket/normalizers";

type WatchlistButtonProps = {
  market: MarketSummary;
  initiallySaved?: boolean;
};

export function WatchlistButton({
  market,
  initiallySaved = false,
}: WatchlistButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [isLoading, setIsLoading] = useState(false);

  async function toggleWatchlist() {
    setIsLoading(true);

    const response = await fetch("/api/watchlist", {
      method: isSaved ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        isSaved ? { marketId: market.id } : { market },
      ),
    });

    setIsLoading(false);

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok) {
      alert("Something went wrong while updating your watchlist.");
      return;
    }

    setIsSaved((currentValue) => !currentValue);
    router.refresh();
  }

  return (
    <Button onClick={toggleWatchlist} disabled={isLoading} variant="outline">
      {isSaved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {isLoading ? "Saving..." : isSaved ? "Saved" : "Save"}
    </Button>
  );
}
