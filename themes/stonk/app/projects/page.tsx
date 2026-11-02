"use client";

import { StockLayout } from "@/components/stock/StockLayout";
import { MarketWatchlist } from "@/components/stock/MarketWatchlist";

export default function ProjectsPage() {
  return (
    <StockLayout>
      <section className="animate-fade-in-up">
        <MarketWatchlist />
      </section>
    </StockLayout>
  );
}
