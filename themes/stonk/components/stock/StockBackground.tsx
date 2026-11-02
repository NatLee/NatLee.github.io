"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useSite, toSymbol } from "@/lib/site";

interface FloatingTicker {
    id: number;
    symbol: string;
    price: number;
    change: number;
    x: number;
    y: number;
    speed: number;
    opacity: number;
    size: "sm" | "md" | "lg";
    row: number;
}

interface CandleData {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    x: number;
    targetX: number;
}

// Floating symbols: the house brand plus tickers derived from skill and technology names.
function useSymbols(): string[] {
    const { personal, skills, projects } = useSite();
    return useMemo(() => {
        const names = [
            ...skills.flatMap((c) => c.skills.map((s) => s.name)),
            ...projects.flatMap((p) => p.technologies),
        ];
        const symbols = Array.from(new Set(names.map((n) => toSymbol(n, 5)))).slice(0, 29);
        return [`${personal.initials}.TECH`, ...symbols];
    }, [personal.initials, skills, projects]);
}

export default function StockBackground() {
    const SYMBOLS = useSymbols();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const candleDataRef = useRef<CandleData[]>([]);
    const animationRef = useRef<number>(0);
    const scrollOffsetRef = useRef<number>(0);
    const [tickers, setTickers] = useState<FloatingTicker[]>([]);

    // Initialize floating tickers - MORE TICKERS, spread across rows
    useEffect(() => {
        const tickerCount = 24; // Increased from 12 to 24
        const rows = 6; // Spread across 6 rows
        
        const initialTickers: FloatingTicker[] = Array.from({ length: tickerCount }, (_, i) => {
            const row = i % rows;
            const rowOffset = (100 / rows) * row;
            
            return {
                id: i,
                symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                price: Math.random() * 500 + 50,
                change: (Math.random() - 0.3) * 15,
                x: (i / tickerCount) * 120 - 10, // Spread out initially
                y: rowOffset + 3 + Math.random() * (100 / rows - 6),
                speed: 0.012 + Math.random() * 0.018,
                opacity: 0.4 + Math.random() * 0.35,
                size: ["sm", "md", "lg"][Math.floor(Math.random() * 3)] as "sm" | "md" | "lg",
                row
            };
        });
        setTickers(initialTickers);
    }, []);

    // Update ticker positions - smoother movement
    useEffect(() => {
        const interval = setInterval(() => {
            setTickers(prev => prev.map(ticker => {
                let newX = ticker.x + ticker.speed;
                
                // Reset position when off-screen
                if (newX > 105) {
                    newX = -15;
                    return {
                        ...ticker,
                        x: newX,
                        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                        price: Math.random() * 500 + 50,
                        change: (Math.random() - 0.3) * 15,
                        speed: 0.012 + Math.random() * 0.018,
                    };
                }
                
                return {
                    ...ticker,
                    x: newX,
                    price: Math.max(20, ticker.price + (Math.random() - 0.48) * 2),
                    change: ticker.change + (Math.random() - 0.48) * 0.15,
                };
            }));
        }, 40); // Faster updates for smoother movement

        return () => clearInterval(interval);
    }, []);

    // Draw function with smooth scrolling candlesticks
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = "rgba(39, 39, 42, 0.5)";
        ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Candlestick settings
        const candleWidth = 20;
        const candleGap = 24;
        const maxCandles = Math.ceil(width / candleGap) + 10;
        const chartTop = height * 0.5;
        const chartHeight = height * 0.45;
        const volumeHeight = 40;

        // Initialize candle data
        if (candleDataRef.current.length === 0) {
            let price = 50;
            for (let i = 0; i < maxCandles; i++) {
                const open = price;
                const change = (Math.random() - 0.35) * 5;
                const close = open + change;
                const high = Math.max(open, close) + Math.random() * 2.5;
                const low = Math.min(open, close) - Math.random() * 2.5;
                const volume = 30 + Math.random() * 70;
                const x = i * candleGap;
                
                candleDataRef.current.push({ open, close, high, low, volume, x, targetX: x });
                price = close * 0.7 + price * 0.3 + 0.25;
            }
        }

        // Smooth scroll
        scrollOffsetRef.current += 0.25;

        // Update candle positions
        candleDataRef.current.forEach(candle => {
            candle.x = candle.targetX - scrollOffsetRef.current;
        });

        // Remove off-screen candles
        while (candleDataRef.current.length > 0 && candleDataRef.current[0].x < -candleGap) {
            candleDataRef.current.shift();
        }

        // Add new candles
        const lastCandle = candleDataRef.current[candleDataRef.current.length - 1];
        if (lastCandle && lastCandle.x < width + candleGap) {
            const newOpen = lastCandle.close;
            const change = (Math.random() - 0.35) * 4;
            const newClose = newOpen + change;
            const newX = lastCandle.targetX + candleGap;
            
            candleDataRef.current.push({ 
                open: newOpen, 
                close: newClose, 
                high: Math.max(newOpen, newClose) + Math.random() * 2,
                low: Math.min(newOpen, newClose) - Math.random() * 2,
                volume: 30 + Math.random() * 70,
                x: newX - scrollOffsetRef.current,
                targetX: newX
            });
        }

        // Calculate scale from visible candles
        const visibleCandles = candleDataRef.current.filter(c => c.x >= -candleGap && c.x <= width + candleGap);
        if (visibleCandles.length === 0) return;

        const allPrices = visibleCandles.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...allPrices) - 3;
        const maxPrice = Math.max(...allPrices) + 3;
        const priceRange = maxPrice - minPrice || 1;

        const scaleY = (price: number) => {
            return chartTop + (chartHeight - volumeHeight) - ((price - minPrice) / priceRange) * (chartHeight - volumeHeight);
        };

        // Draw candlesticks
        visibleCandles.forEach((candle) => {
            const x = candle.x + candleWidth / 2;
            const isGreen = candle.close >= candle.open;

            // Wick
            ctx.strokeStyle = isGreen 
                ? "rgba(34, 197, 94, 0.65)" 
                : "rgba(239, 68, 68, 0.55)";
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x, scaleY(candle.high));
            ctx.lineTo(x, scaleY(candle.low));
            ctx.stroke();

            // Body
            const bodyTop = scaleY(Math.max(candle.open, candle.close));
            const bodyBottom = scaleY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(bodyBottom - bodyTop, 2);

            ctx.fillStyle = isGreen 
                ? "rgba(34, 197, 94, 0.45)" 
                : "rgba(239, 68, 68, 0.35)";
            ctx.fillRect(x - candleWidth * 0.35, bodyTop, candleWidth * 0.7, bodyHeight);

            ctx.strokeStyle = isGreen 
                ? "rgba(34, 197, 94, 0.8)" 
                : "rgba(239, 68, 68, 0.7)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x - candleWidth * 0.35, bodyTop, candleWidth * 0.7, bodyHeight);

            // Volume bars
            const volumeBarHeight = (candle.volume / 100) * volumeHeight;
            const volumeY = height - volumeBarHeight - 10;
            
            ctx.fillStyle = isGreen 
                ? "rgba(34, 197, 94, 0.2)" 
                : "rgba(239, 68, 68, 0.15)";
            ctx.fillRect(x - candleWidth * 0.25, volumeY, candleWidth * 0.5, volumeBarHeight);
        });

        // Draw MA line with smooth curve
        if (visibleCandles.length >= 7) {
            const maWindow = 7;
            const maPoints: { x: number; y: number }[] = [];
            
            for (let i = maWindow - 1; i < visibleCandles.length; i++) {
                let sum = 0;
                for (let j = 0; j < maWindow; j++) {
                    sum += visibleCandles[i - j].close;
                }
                maPoints.push({
                    x: visibleCandles[i].x + candleWidth / 2,
                    y: scaleY(sum / maWindow)
                });
            }

            if (maPoints.length > 1) {
                // Glow
                ctx.strokeStyle = "rgba(59, 130, 246, 0.12)";
                ctx.lineWidth = 8;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.moveTo(maPoints[0].x, maPoints[0].y);
                for (let i = 1; i < maPoints.length - 1; i++) {
                    const xc = (maPoints[i].x + maPoints[i + 1].x) / 2;
                    const yc = (maPoints[i].y + maPoints[i + 1].y) / 2;
                    ctx.quadraticCurveTo(maPoints[i].x, maPoints[i].y, xc, yc);
                }
                ctx.lineTo(maPoints[maPoints.length - 1].x, maPoints[maPoints.length - 1].y);
                ctx.stroke();

                // Line
                ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(maPoints[0].x, maPoints[0].y);
                for (let i = 1; i < maPoints.length - 1; i++) {
                    const xc = (maPoints[i].x + maPoints[i + 1].x) / 2;
                    const yc = (maPoints[i].y + maPoints[i + 1].y) / 2;
                    ctx.quadraticCurveTo(maPoints[i].x, maPoints[i].y, xc, yc);
                }
                ctx.lineTo(maPoints[maPoints.length - 1].x, maPoints[maPoints.length - 1].y);
                ctx.stroke();
            }
        }

    }, []);

    // Animation loop
    useEffect(() => {
        const animate = () => {
            draw();
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            scrollOffsetRef.current = 0;
            candleDataRef.current = [];
            draw();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", handleResize);
        };
    }, [draw]);

    const getSizeClass = (size: "sm" | "md" | "lg") => {
        switch (size) {
            case "sm": return "text-[9px]";
            case "md": return "text-[10px]";
            case "lg": return "text-xs";
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Candlestick Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0" />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-stock-bg/60 via-stock-bg/20 to-stock-bg/40" />
            
            {/* Floating Tickers - MORE */}
            {tickers.map((ticker) => (
                <motion.div
                    key={ticker.id}
                    className={`absolute font-mono whitespace-nowrap ${getSizeClass(ticker.size)}`}
                    style={{
                        left: `${ticker.x}%`,
                        top: `${ticker.y}%`,
                        opacity: ticker.opacity,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: ticker.opacity,
                        scale: [1, 1.01, 1],
                    }}
                    transition={{
                        opacity: { duration: 0.5 },
                        scale: {
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <div className="flex items-center gap-1.5 bg-stock-panel/50 backdrop-blur-sm px-2 py-1 rounded border border-stock-border/40 shadow-sm">
                        <span className="text-stock-text font-semibold">{ticker.symbol}</span>
                        <span className="text-stock-muted">${ticker.price.toFixed(2)}</span>
                        <span className={`flex items-center gap-0.5 font-semibold ${ticker.change >= 0 ? "text-stock-green" : "text-stock-red"}`}>
                            <span className="text-[7px]">{ticker.change >= 0 ? "▲" : "▼"}</span>
                            {ticker.change >= 0 ? "+" : ""}{ticker.change.toFixed(2)}%
                        </span>
                    </div>
                </motion.div>
            ))}

            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-radial-vignette opacity-30" />
        </div>
    );
}
