"use client";

import { StockLayout } from "@/components/stock/StockLayout";
import { ExperienceChart } from "@/components/stock/ExperienceChart";
import { useSite } from "@/lib/site";
import { TrendingUp, Activity, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperiencePage() {
  const { experience: experienceData, stats } = useSite();
  const currentPosition = experienceData[0];
  const yearsExperience = stats.years;

  return (
    <StockLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Terminal-Style Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Title & Status */}
            <div className="flex items-center gap-4">
              <div className="p-3 glass-subtle rounded-xl">
                <TrendingUp size={24} className="text-stock-green" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-stock-text">Career Timeline</h1>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-stock-green/15 text-stock-green rounded border border-stock-green/30">
                    BULLISH
                  </span>
                </div>
                <p className="text-sm text-stock-muted">
                  Analyzing performance and career growth over time
                </p>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 glass-subtle rounded-lg">
                <Activity size={14} className="text-stock-green" />
                <div>
                  <div className="text-[10px] text-stock-muted uppercase">Current</div>
                  <div className="text-xs font-medium text-stock-text">{currentPosition?.company}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 glass-subtle rounded-lg">
                <BarChart2 size={14} className="text-stock-accent" />
                <div>
                  <div className="text-[10px] text-stock-muted uppercase">Experience</div>
                  <div className="text-xs font-medium text-stock-text">{yearsExperience}+ Years</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Component */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ExperienceChart />
        </motion.div>
      </div>
    </StockLayout>
  );
}
