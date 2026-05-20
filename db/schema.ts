import { relations } from "drizzle-orm";
import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    marketId: text("market_id").notNull(),
    marketSlug: text("market_slug").notNull(),
    eventSlug: text("event_slug").notNull(),
    question: text("question").notNull(),
    image: text("image"),
    category: text("category").notNull(),
    volume: numeric("volume").notNull(),
    liquidity: numeric("liquidity").notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("watchlist_items_user_id_idx").on(table.userId),
    uniqueIndex("watchlist_items_user_market_unique").on(
      table.userId,
      table.marketId,
    ),
  ],
);

export const watchlistRelations = relations(watchlistItems, () => ({}));
