# Polymarket Market Explorer

A full-stack Next.js app for browsing live Polymarket prediction markets, searching across markets, opening detailed market pages, and saving markets to a personal watchlist.

This project is read-only for market data. It does **not** connect wallets, place trades, or handle user funds.

## Live Demo

https://polymarket-market-explorer.vercel.app/

## Features

- Browse active Polymarket markets
- Search Polymarket markets using the Gamma public search endpoint
- Filter loaded/search results by category
- Sort by volume, liquidity, end date, or category
- Open market detail pages by slug
- View outcomes, probabilities, CLOB token IDs, volume, liquidity, expiry, tags, and identifiers
- Create an account and log in with Supabase Auth
- Save markets to a personal Supabase-backed watchlist
- Remove markets from the watchlist
- Manual market data refresh
- Optional 60-second auto-refresh toggle
- Responsive UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Drizzle ORM
- Polymarket Gamma API
- Vercel-ready deployment

## Project Structure

```txt
app/
  api/
    markets/
    watchlist/
  login/
  markets/[slug]/
  signup/
  watchlist/
components/
db/
lib/
  polymarket/
  supabase/
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
DATABASE_URL=your_supabase_postgres_connection_string
```

The repo includes `.env.example` with the same variable names.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

This project uses Drizzle ORM with Supabase Postgres.

Push the schema to Supabase:

```bash
npm run db:push
```

The main table is `watchlist_items`. It stores saved market references for each authenticated user.

## Useful Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to the database |
| `npm run db:studio` | Open Drizzle Studio |

## Demo Flow

1. Open the homepage.
2. Browse the default active market feed.
3. Search for a topic like bitcoin, ukraine, or champions league.
4. Filter by category or sort by volume, liquidity, or end date.
5. Open a market detail page.
6. Review outcomes, probabilities, liquidity, volume, expiry, and token IDs.
7. Sign up or log in.
8. Save a market.
9. Open the watchlist page.
10. Remove a saved market.
11. Use manual refresh or enable auto-refresh.

## Notes

Polymarket market data is fetched from public Gamma API endpoints. Supabase is used only for authentication and storing user watchlist rows.

This app is intended as a portfolio-ready market discovery dashboard, not a trading client.

## Deployment

Deploy with Vercel:

1. Push the repo to GitHub.
2. Import the GitHub repo in Vercel.
3. Add the environment variables from `.env.local`.
4. Deploy.
5. In Supabase Auth settings, add your deployed Vercel URL to the allowed redirect URLs if needed.

## Screenshots

Add screenshots here after deployment:

- `public/screenshots/homepage.png`
- `public/screenshots/market-detail.png`
- `public/screenshots/watchlist.png`
