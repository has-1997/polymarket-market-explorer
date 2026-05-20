import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AppHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function signOut() {
    "use server";

    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();

    redirect("/");
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Polymarket Explorer
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/">Markets</Link>
          </Button>

          <Button asChild variant="ghost">
            <Link href="/watchlist">Watchlist</Link>
          </Button>

          {user ? (
            <form action={signOut} className="flex items-center gap-3">
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button type="submit" variant="outline">
                Log out
              </Button>
            </form>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
