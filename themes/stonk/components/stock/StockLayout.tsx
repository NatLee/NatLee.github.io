"use client";

import { useSite } from "@/lib/site";
import { Header } from "./Header";
import StockBackground from "./StockBackground";

interface StockLayoutProps {
    children: React.ReactNode;
    showTicker?: boolean;
}

export function StockLayout({
    children,
    showTicker = true
}: StockLayoutProps) {
    const { personal } = useSite();
    // "City, Country" → "CITY": the exchange label in the footer.
    const exchange = personal.location.split(",")[0].trim().toUpperCase();

    return (
        <div className="min-h-screen bg-stock-bg text-stock-text font-sans relative">
            {/* Animated Background */}
            <StockBackground />

            {/* Header with Navigation */}
            <Header showTicker={showTicker} />

            {/* Main Content - Full Width */}
            <main className="pt-32 relative z-10">

                {/* Content Area */}
                <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-stock-border bg-stock-panel/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-stock-muted text-sm">
                            <span className="text-stock-green font-mono">{personal.initials}.TECH</span>
                            <span className="mx-2">•</span>
                            <span>© {new Date().getFullYear()} {personal.name}. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-stock-muted font-mono">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-stock-green rounded-full animate-pulse" />
                                ONLINE
                            </span>
                            {exchange && <span>{exchange}</span>}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
