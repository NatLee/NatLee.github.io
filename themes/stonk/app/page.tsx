"use client";

import { StockLayout } from "@/components/stock/StockLayout";
import { TopSkillsLeaderboard, RecentActivity } from "@/components/stock/MarketSummary";
import { MarketWelcome } from "@/components/stock/MarketWelcome";
import { SimulatedTradingSection } from "@/components/stock/SimulatedTradingSection";
import { Activity, Radio } from "lucide-react";

export default function Home() {
  return (
    <StockLayout>
      <div className="space-y-16">
        {/* Hero Section - Personal Introduction */}
        <section className="animate-fade-in-up">
          <MarketWelcome />
        </section>

        {/* Simulated Trading Section - Enhanced Container */}
        <section className="animate-fade-in-up delay-100">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-stock-green" />
              <h2 className="text-xl font-bold text-stock-text">Live Trading Terminal</h2>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-stock-green bg-stock-green/10 px-2 py-0.5 rounded-full border border-stock-green/20">
                <Radio size={10} className="animate-pulse" />
                SIMULATED
              </span>
            </div>
            <span className="hidden md:block text-[10px] font-mono text-stock-muted">
              INTERACTIVE DEMO
            </span>
          </div>

          {/* Trading Section with glow border */}
          <div className="relative">
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-stock-green/20 via-stock-accent/10 to-stock-green/20 rounded-2xl blur-xl opacity-50" />

            {/* Content */}
            <div className="relative rounded-xl border border-stock-green/20 overflow-hidden">
              <SimulatedTradingSection />
            </div>
          </div>
        </section>

        {/* Skills & Experience Overview */}
        <section className="animate-fade-in-up delay-200">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-stock-text">Market Data Feed</h2>
            <span className="h-px flex-1 bg-stock-border/30" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Skills */}
            <TopSkillsLeaderboard />

            {/* Recent Experience */}
            <RecentActivity />
          </div>
        </section>
      </div>
    </StockLayout>
  );
}
