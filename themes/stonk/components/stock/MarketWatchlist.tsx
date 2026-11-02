"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAllCategories } from "@/data/projects";
import { useSite } from "@/lib/site";
import Link from "next/link";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Search,
    ArrowUpDown,
    Star,
    Github,
    Filter,
    Eye,
    BarChart3,
    Clock,
} from "lucide-react";

type SortKey = "symbol" | "price" | "change" | "volume" | "sector";
type SortOrder = "asc" | "desc";

// Generate consistent "stock" data for each project
function generateStockData(projectId: string) {
    const seed = projectId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    return {
        price: 50 + random(1) * 200,
        change: (random(2) - 0.3) * 30,
        volume: Math.floor(1000 + random(3) * 50000),
    };
}

export function MarketWatchlist() {
    const { projects: projectsData } = useSite();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState<string>("all");
    const [sortKey, setSortKey] = useState<SortKey>("change");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [liveData, setLiveData] = useState<Record<string, { price: number; change: number; flash?: 'up' | 'down' | null }>>({});
    const prevDataRef = useRef<Record<string, { price: number; change: number }>>({});

    const sectors = getAllCategories(projectsData);

    // Initialize and simulate live data
    useEffect(() => {
        const initial: Record<string, { price: number; change: number; flash?: 'up' | 'down' | null }> = {};
        projectsData.forEach((project) => {
            const data = generateStockData(project.id);
            initial[project.id] = { price: data.price, change: data.change, flash: null };
        });
        setLiveData(initial);
        prevDataRef.current = initial;

        // Simulate price updates
        const interval = setInterval(() => {
            setLiveData((prev) => {
                const updated = { ...prev };
                // Update 1-3 random projects
                const updateCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < updateCount && projectsData.length > 0; i++) {
                    const randomId = projectsData[Math.floor(Math.random() * projectsData.length)].id;
                    if (updated[randomId]) {
                        const delta = (Math.random() - 0.5) * 3;
                        const newPrice = Math.max(10, updated[randomId].price + delta);
                        const flash = delta > 0 ? 'up' : delta < 0 ? 'down' : null;
                        updated[randomId] = {
                            price: newPrice,
                            change: updated[randomId].change + delta * 0.05,
                            flash,
                        };
                    }
                }
                return updated;
            });

            // Clear flash after animation
            setTimeout(() => {
                setLiveData((prev) => {
                    const cleared = { ...prev };
                    Object.keys(cleared).forEach((key) => {
                        if (cleared[key].flash) {
                            cleared[key] = { ...cleared[key], flash: null };
                        }
                    });
                    return cleared;
                });
            }, 500);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    // Filter and sort projects
    const displayedProjects = useMemo(() => {
        return projectsData
            .filter((project) => {
                const matchesSearch =
                    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesSector = selectedSector === "all" || project.category === selectedSector;
                return matchesSearch && matchesSector;
            })
            .sort((a, b) => {
                const aData = liveData[a.id] || { price: 0, change: 0 };
                const bData = liveData[b.id] || { price: 0, change: 0 };

                let comparison = 0;
                switch (sortKey) {
                    case "change":
                        comparison = aData.change - bData.change;
                        break;
                    case "price":
                        comparison = aData.price - bData.price;
                        break;
                    case "volume":
                        comparison = a.technologies.length - b.technologies.length;
                        break;
                    default:
                        comparison = a.title.localeCompare(b.title);
                }
                return sortOrder === "desc" ? -comparison : comparison;
            });
    }, [searchQuery, selectedSector, sortKey, sortOrder, liveData]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    };

    // Market summary stats
    const advancers = Object.values(liveData).filter((d) => d.change >= 0).length;
    const decliners = Object.values(liveData).filter((d) => d.change < 0).length;
    const totalVolume = projectsData.reduce((sum, p) => sum + p.technologies.length * 1000, 0);

    return (
        <div className="space-y-4">
            {/* Market Header */}
            <motion.div
                className="glass-card p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center">
                            <Activity className="text-stock-green" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-stock-text flex items-center gap-2">
                                MARKET WATCHLIST
                                <span className="flex items-center gap-1 text-[10px] font-normal text-stock-green bg-stock-green/20 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-stock-green rounded-full animate-pulse" />
                                    LIVE
                                </span>
                            </h1>
                            <p className="text-stock-muted text-sm">Portfolio Holdings • Real-time Simulation</p>
                        </div>
                    </div>

                    {/* Market Summary */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 glass-subtle px-3 py-2 rounded-lg">
                            <TrendingUp size={14} className="text-stock-green" />
                            <span className="text-stock-green font-mono font-bold">{advancers}</span>
                            <span className="text-stock-muted text-xs">Advancers</span>
                        </div>
                        <div className="flex items-center gap-2 glass-subtle px-3 py-2 rounded-lg">
                            <TrendingDown size={14} className="text-stock-red" />
                            <span className="text-stock-red font-mono font-bold">{decliners}</span>
                            <span className="text-stock-muted text-xs">Decliners</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 glass-subtle px-3 py-2 rounded-lg">
                            <BarChart3 size={14} className="text-stock-accent" />
                            <span className="text-stock-text font-mono font-bold">{totalVolume.toLocaleString()}</span>
                            <span className="text-stock-muted text-xs">Volume</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mt-4 pt-4 border-t border-stock-border/30">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stock-muted" />
                        <input
                            type="text"
                            placeholder="Search symbols, technologies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-stock-bg/50 border border-stock-border rounded-lg text-stock-text text-sm placeholder:text-stock-muted focus:outline-none focus:border-stock-accent transition-colors"
                        />
                    </div>

                    {/* Sector Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-stock-muted" />
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="bg-stock-bg/50 border border-stock-border rounded-lg px-3 py-2.5 text-sm text-stock-text focus:outline-none focus:border-stock-accent cursor-pointer transition-colors"
                        >
                            <option value="all">All Sectors</option>
                            {sectors.map((sector) => (
                                <option key={sector} value={sector}>
                                    {sector}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Watchlist Table */}
            <motion.div
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-stock-border/50 bg-stock-bg/30">
                    <button
                        onClick={() => handleSort("symbol")}
                        className="col-span-5 md:col-span-4 flex items-center gap-1 text-[10px] text-stock-muted uppercase tracking-wider hover:text-stock-text transition-colors"
                    >
                        Symbol <ArrowUpDown size={10} className={sortKey === "symbol" ? "text-stock-accent" : ""} />
                    </button>
                    <button
                        onClick={() => handleSort("price")}
                        className="col-span-3 md:col-span-2 text-right flex items-center justify-end gap-1 text-[10px] text-stock-muted uppercase tracking-wider hover:text-stock-text transition-colors"
                    >
                        Last <ArrowUpDown size={10} className={sortKey === "price" ? "text-stock-accent" : ""} />
                    </button>
                    <button
                        onClick={() => handleSort("change")}
                        className="col-span-4 md:col-span-2 text-right flex items-center justify-end gap-1 text-[10px] text-stock-muted uppercase tracking-wider hover:text-stock-text transition-colors"
                    >
                        Change <ArrowUpDown size={10} className={sortKey === "change" ? "text-stock-accent" : ""} />
                    </button>
                    <div className="col-span-2 text-right hidden md:block text-[10px] text-stock-muted uppercase tracking-wider">
                        Volume
                    </div>
                    <div className="col-span-2 text-right hidden lg:block text-[10px] text-stock-muted uppercase tracking-wider">
                        Sector
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-stock-border/20">
                    {displayedProjects.map((project, index) => {
                        const data = liveData[project.id] || { price: 100, change: 0, flash: null };
                        const isPositive = data.change >= 0;
                        const symbol = project.title.replace(/\s+/g, "").slice(0, 6).toUpperCase();
                        const volume = project.technologies.length * 1000;

                        return (
                            <Link key={project.id} href={`/projects/view/?id=${encodeURIComponent(project.id)}`}>
                                <motion.div
                                    className={`grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-stock-border/20 ${project.status === "In Progress" ? "border-l-2 border-l-stock-green" : ""
                                        }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    {/* Symbol & Name */}
                                    <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg glass-subtle flex items-center justify-center text-xs font-mono font-bold text-stock-accent">
                                            {symbol.slice(0, 2)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-semibold text-stock-text truncate">{symbol}</span>
                                                {project.featured && <Star size={10} className="text-stock-gold fill-stock-gold flex-shrink-0" />}
                                                {project.opensource && <Github size={10} className="text-stock-muted flex-shrink-0" />}
                                            </div>
                                            <p className="text-[10px] text-stock-muted truncate">{project.title}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                                        <span
                                            className={`font-mono text-stock-text price-cell px-2 py-0.5 rounded ${data.flash === 'up' ? 'price-flash-up' : data.flash === 'down' ? 'price-flash-down' : ''
                                                }`}
                                        >
                                            ${data.price.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Change */}
                                    <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                                        <span
                                            className={`font-mono text-sm flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive
                                                    ? "text-stock-green bg-stock-green/10"
                                                    : "text-stock-red bg-stock-red/10"
                                                }`}
                                        >
                                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {isPositive ? "+" : ""}
                                            {data.change.toFixed(2)}%
                                        </span>
                                    </div>

                                    {/* Volume */}
                                    <div className="col-span-2 hidden md:flex items-center justify-end">
                                        <span className="font-mono text-stock-muted text-sm">
                                            {volume.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Sector */}
                                    <div className="col-span-2 hidden lg:flex items-center justify-end">
                                        <span className="text-[10px] px-2 py-1 rounded glass-subtle text-stock-muted truncate max-w-full">
                                            {project.category}
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Empty State */}
                {displayedProjects.length === 0 && (
                    <div className="py-16 text-center">
                        <Eye size={48} className="mx-auto text-stock-muted/50 mb-4" />
                        <h3 className="text-stock-text font-semibold mb-2">No Holdings Found</h3>
                        <p className="text-stock-muted text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </motion.div>

            {/* Market Stats Footer */}
            <motion.div
                className="glass-subtle rounded-xl p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MarketStat
                        icon={<BarChart3 size={16} />}
                        label="Total Holdings"
                        value={projectsData.length.toString()}
                    />
                    <MarketStat
                        icon={<Activity size={16} />}
                        label="Active Projects"
                        value={projectsData.filter((p) => p.status === "In Progress").length.toString()}
                        highlight
                    />
                    <MarketStat
                        icon={<Clock size={16} />}
                        label="Technologies"
                        value={`${new Set(projectsData.flatMap((p) => p.technologies)).size}+`}
                    />
                    <MarketStat
                        icon={<Github size={16} />}
                        label="Open Source"
                        value={projectsData.filter((p) => p.opensource).length.toString()}
                    />
                </div>
            </motion.div>
        </div>
    );
}

function MarketStat({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="text-center p-3 glass-subtle rounded-lg">
            <div className={`flex justify-center mb-2 ${highlight ? "text-stock-green" : "text-stock-muted"}`}>
                {icon}
            </div>
            <div className="text-[10px] text-stock-muted uppercase tracking-wider mb-1">{label}</div>
            <div className={`font-mono text-xl font-bold ${highlight ? "text-stock-green" : "text-stock-text"}`}>
                {value}
            </div>
        </div>
    );
}
