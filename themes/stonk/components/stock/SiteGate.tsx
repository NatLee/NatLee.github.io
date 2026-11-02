"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Radio, RefreshCw } from "lucide-react";
import { loadSite, SiteContext, type SiteData } from "@/lib/site";

const THEME_TITLE = "Stonk theme";

type GateState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; site: SiteData };

/** Loads /content/site.json once, then renders the app. Shows a market-style loading / error screen meanwhile. */
export function SiteGate({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<GateState>({ status: "loading" });
    const pathname = usePathname();

    const connect = useCallback(() => {
        setState({ status: "loading" });
        loadSite()
            .then((site) => setState({ status: "ready", site }))
            .catch((err: unknown) => setState({ status: "error", message: err instanceof Error ? err.message : String(err) }));
    }, []);

    useEffect(connect, [connect]);

    const name = state.status === "ready" ? state.site.personal.name : "";
    useEffect(() => {
        document.title = name ? `${name} · ${THEME_TITLE}` : THEME_TITLE;
    }, [name, pathname]);

    if (state.status === "ready") {
        return <SiteContext.Provider value={state.site}>{children}</SiteContext.Provider>;
    }
    return (
        <div className="min-h-screen bg-stock-bg text-stock-text flex items-center justify-center p-6 relative overflow-hidden">
            {/* Grid backdrop, same as the hero card */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />
            {state.status === "loading" ? <Connecting /> : <Offline message={state.message} onRetry={connect} />}
        </div>
    );
}

function Connecting() {
    return (
        <div className="relative w-full max-w-sm rounded-2xl border border-stock-border bg-stock-panel/90 backdrop-blur-sm p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-2 text-[10px] font-mono text-stock-green">
                    <Radio size={10} className="animate-pulse" />
                    MARKET FEED
                </span>
                <span className="text-[10px] font-mono text-stock-muted">PRE-MARKET</span>
            </div>

            {/* Candles warming up */}
            <div className="h-20 flex items-end gap-1.5 mb-5" aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={`flex-1 rounded-sm ${i % 3 === 1 ? "bg-stock-red/60" : "bg-stock-green/60"}`}
                        initial={{ height: "15%" }}
                        animate={{ height: ["15%", `${30 + ((i * 37) % 60)}%`, "15%"] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Activity size={18} className="text-stock-green animate-pulse" />
                <div>
                    <div className="font-mono text-sm font-bold text-stock-text tracking-wide">CONNECTING TO MARKET…</div>
                    <div className="text-[10px] font-mono text-stock-muted mt-0.5">Streaming portfolio data</div>
                </div>
            </div>
        </div>
    );
}

function Offline({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="relative w-full max-w-sm rounded-2xl border border-stock-red/40 bg-stock-panel/90 backdrop-blur-sm p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-2 text-[10px] font-mono text-stock-red">
                    <span className="w-1.5 h-1.5 rounded-full bg-stock-red" />
                    TRADING HALTED
                </span>
                <span className="text-[10px] font-mono text-stock-muted">ERR</span>
            </div>
            <div className="flex items-start gap-3 mb-5">
                <AlertTriangle size={20} className="text-stock-red flex-shrink-0 mt-0.5" />
                <div>
                    <div className="font-mono text-sm font-bold text-stock-text tracking-wide">MARKET DATA FEED OFFLINE</div>
                    <p className="text-xs text-stock-muted mt-1">The portfolio data could not be loaded.</p>
                    <p className="text-[10px] font-mono text-stock-red/80 mt-2 break-all">{message}</p>
                </div>
            </div>
            <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-stock-border text-stock-text text-sm font-mono hover:border-stock-green hover:text-stock-green transition-colors"
            >
                <RefreshCw size={14} />
                RECONNECT
            </button>
        </div>
    );
}
