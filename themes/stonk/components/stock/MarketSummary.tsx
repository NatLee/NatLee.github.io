"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import {
    TrendingUp,
    TrendingDown,
    Award,
    Briefcase,
    Code2,
    Clock,
    BarChart3,
    Sparkles
} from "lucide-react";



// Top Skills Leaderboard component
export function TopSkillsLeaderboard() {
    const { skills: skillsData } = useSite();
    const topSkills = skillsData
        .flatMap(cat => cat.skills)
        .filter(skill => skill.level === "Expert" || skill.level === "Advanced")
        .slice(0, 5);

    return (
        <motion.div
            className="stock-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-stock-gold" />
                <h3 className="text-stock-text font-semibold">Top Performers</h3>
            </div>

            <div className="space-y-3">
                {topSkills.map((skill, index) => {
                    const performance = 85 + Math.random() * 15;
                    return (
                        <div
                            key={skill.name}
                            className="flex items-center gap-3 py-2 border-b border-stock-border/50 last:border-0"
                        >
                            <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-stock-gold/20 text-stock-gold" :
                                    index === 1 ? "bg-stock-muted/20 text-stock-muted" :
                                        index === 2 ? "bg-orange-500/20 text-orange-400" :
                                            "bg-stock-border text-stock-muted"
                                }`}>
                                {index + 1}
                            </span>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-stock-text text-sm font-medium">
                                        {skill.name}
                                    </span>
                                    <span className="text-stock-green text-xs font-mono">
                                        +{performance.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="skill-bar flex-1">
                                        <motion.div
                                            className="skill-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${performance}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-stock-muted font-mono">
                                        {skill.years}y
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// Recent Activity/News component
export function RecentActivity() {
    const { experience: experienceData } = useSite();
    const recentExperience = experienceData.slice(0, 3);

    return (
        <motion.div
            className="stock-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-stock-accent" />
                <h3 className="text-stock-text font-semibold">Recent Trades</h3>
            </div>

            <div className="space-y-3">
                {recentExperience.map((exp, index) => (
                    <div
                        key={exp.id}
                        className="flex items-start gap-3 py-2 border-b border-stock-border/50 last:border-0"
                    >
                        <div className={`mt-1 w-2 h-2 rounded-full ${index === 0 ? "bg-stock-green animate-pulse" : "bg-stock-muted"
                            }`} />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${index === 0
                                        ? "bg-stock-green/20 text-stock-green"
                                        : "bg-stock-muted/20 text-stock-muted"
                                    }`}>
                                    {index === 0 ? "ACTIVE" : "CLOSED"}
                                </span>
                                <span className="text-stock-muted text-[10px]">
                                    {exp.start}
                                </span>
                            </div>
                            <p className="text-stock-text text-sm font-medium truncate mt-1">
                                {exp.title}
                            </p>
                            <p className="text-stock-muted text-xs truncate">
                                {exp.company}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
