"use client";

import { useEffect, useState } from "react";
import { TimerReset } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AutoRefreshToggle() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      router.refresh();
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, router]);

  return (
    <Button
      type="button"
      variant={isEnabled ? "default" : "outline"}
      onClick={() => setIsEnabled((currentValue) => !currentValue)}
    >
      <TimerReset className="h-4 w-4" />
      {isEnabled ? "Auto-refresh on" : "Auto-refresh off"}
    </Button>
  );
}
