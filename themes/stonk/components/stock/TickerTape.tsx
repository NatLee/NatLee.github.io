"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSite } from "@/lib/site";

interface TickerItem {
    symbol: string;
    price: number;
    change: number;
    volume: string;
}

export function TickerTape() {
    const { skills: skillsData } = useSite();
    // Flatten all skills into ticker items
    const allSkills = skillsData.flatMap(category =>
        category.skills.map(skill => skill.name)
    );

    const [tickers, setTickers] = useState<TickerItem[]>(() =>
        allSkills.map(skill => ({
            symbol: skill.replace(/\s+/g, '').toUpperCase().slice(0, 6),
            price: 50 + Math.random() * 200,
            change: (Math.random() - 0.3) * 10, // Bias towards positive
            volume: ['HIGH', 'MED', 'LOW'][Math.floor(Math.random() * 3)]
        }))
    );

    // Update prices periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setTickers(prev => prev.map(ticker => ({
                ...ticker,
                price: Math.max(10, ticker.price + (Math.random() - 0.45) * 5),
                change: Math.max(-15, Math.min(20, ticker.change + (Math.random() - 0.45) * 2)),
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Duplicate for seamless loop
    const duplicatedTickers = [...tickers, ...tickers];

    return (
        <div className="w-full bg-stock-panel/90 backdrop-blur-sm border-b border-stock-border/50 overflow-hidden py-0.5">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex"
                    animate={{ x: "-50%" }}
                    transition={{
                        ease: "linear",
                        duration: 80,
                        repeat: Infinity,
                    }}
                >
                    {duplicatedTickers.map((ticker, index) => {
                        const isPositive = ticker.change >= 0;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-1.5 px-3 py-0.5 border-r border-stock-border/30 last:border-r-0"
                            >
                                {/* Symbol */}
                                <span className="text-[10px] font-mono font-semibold text-stock-text">{ticker.symbol}</span>

                                {/* Price */}
                                <span className="text-[10px] font-mono text-stock-muted tabular-nums">
                                    ${ticker.price.toFixed(2)}
                                </span>

                                {/* Change */}
                                <span className={`flex items-center gap-0.5 text-[9px] font-mono font-medium ${isPositive ? 'text-stock-green' : 'text-stock-red'
                                    }`}>
                                    <span className="text-[7px]">
                                        {isPositive ? '▲' : '▼'}
                                    </span>
                                    <span className="tabular-nums">
                                        {isPositive ? '+' : ''}{ticker.change.toFixed(1)}%
                                    </span>
                                </span>

                                {/* Volume indicator (desktop only) */}
                                <span className={`hidden lg:inline-block text-[8px] font-mono px-1 py-0 rounded ${ticker.volume === 'HIGH'
                                    ? 'bg-stock-green/15 text-stock-green'
                                    : ticker.volume === 'MED'
                                        ? 'bg-stock-gold/15 text-stock-gold'
                                        : 'bg-stock-muted/15 text-stock-muted'
                                    }`}>
                                    {ticker.volume}
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
