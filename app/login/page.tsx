import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground underline">
            Back to markets
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Log in to save Polymarket markets to your watchlist.
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </main>
  );
}
