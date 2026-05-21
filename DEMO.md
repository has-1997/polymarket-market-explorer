# Polymarket Market Explorer Demo Script

Use this script to demo the project in 2–4 minutes.

## 1. Open the live app

Start at [https://polymarket-market-explorer.vercel.app/](https://polymarket-market-explorer.vercel.app/).

Say:

> This is a read-only Polymarket market discovery dashboard. It lets users browse live prediction markets, search across Polymarket, inspect market details, and save markets to a personal watchlist.

## 2. Show the browse page

Point out:

- Live Polymarket data
- Loaded market count
- Read-only mode
- Market cards
- Volume, liquidity, outcomes, prices, and expiry

Say:

> The homepage fetches active Polymarket event data from the Gamma API, normalizes nested markets, and renders them as clean cards.

## 3. Search Polymarket

Search for:

```txt
bitcoin
```

Then try:

```txt
champions league
```

Say:

> Search is server-backed. It calls my local Next.js API route, which queries Polymarket's public search endpoint and returns normalized market results.

## 4. Filter and sort

Try:

- Category filter
- Highest volume
- Highest liquidity
- Ending soonest
- Category A–Z

Say:

> After search results load, users can filter and sort the result set client-side for fast exploration.

## 5. Open a market detail page

Click any market.

Point out:

- Question
- Description
- Outcomes and probabilities
- CLOB token IDs
- Volume
- Liquidity
- End date
- Market ID and slug

Say:

> Detail pages load directly by market slug, so they work for markets found through search as well as the default browse feed.

## 6. Show auth

Log in or sign up.

Say:

> Authentication is powered by Supabase Auth. The app uses Supabase SSR helpers and a Next.js proxy to keep sessions fresh.

## 7. Save a market

Click **Save** on a market detail page.

Say:

> Saved markets are stored in Supabase Postgres using a Drizzle-defined watchlist table. Each saved row belongs to the logged-in user.

## 8. Show the watchlist

Open [/watchlist](https://polymarket-market-explorer.vercel.app/watchlist).

Point out:

- Saved markets
- Market images
- Volume and liquidity
- End dates
- Remove button

Say:

> The watchlist is the personalized part of the app. Users can save markets, revisit them later, and remove them.

## 9. Show refresh controls

Return to the homepage.

Click:

- **Refresh data**
- **Auto-refresh** off/on

Say:

> The app supports manual refresh and an optional 60-second auto-refresh toggle for live market browsing.

## 10. Close with the stack

Say:

> The project is built with Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase Auth, Supabase Postgres, Drizzle ORM, and Polymarket's public Gamma API. It is deployed on Vercel and connected to GitHub.
