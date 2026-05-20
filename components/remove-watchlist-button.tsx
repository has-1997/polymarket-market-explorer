"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type RemoveWatchlistButtonProps = {
  marketId: string;
};

export function RemoveWatchlistButton({ marketId }: RemoveWatchlistButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  async function removeMarket() {
    setIsRemoving(true);

    const response = await fetch("/api/watchlist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ marketId }),
    });

    setIsRemoving(false);

    if (!response.ok) {
      alert("Something went wrong while removing this market.");
      return;
    }

    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={removeMarket}
      disabled={isRemoving}
    >
      <Trash2 className="h-4 w-4" />
      {isRemoving ? "Removing..." : "Remove"}
    </Button>
  );
}
