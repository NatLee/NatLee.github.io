'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useSite } from '@/lib/site';
import { transformExperienceToStockData, StockDataPoint } from '@/utils/experienceTransform';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FaBuilding, FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';
import { CompanyLogoSimple } from './CompanyLogo';

// Helper for MA calculation
const calculateSMA = (data: StockDataPoint[], period: number, index: number) => {
    if (index < period - 1) return null;
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[index - i].close;
    }
    return sum / period;
};

export function ExperienceChart() {
    const { experience: experienceData, personal } = useSite();
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoverInfo, setHoverInfo] = useState<{ x: number, y: number, data: StockDataPoint } | null>(null);

    // Transform data once
    const data = useMemo(() => transformExperienceToStockData(experienceData), [experienceData]);

    // Find the selected job details
    const selectedJob = useMemo(() => {
        return experienceData.find(exp => exp.id === selectedJobId) || experienceData[0];
    }, [selectedJobId, experienceData]);

    const handleListClick = (id: string) => {
        setSelectedJobId(id);
        const detailsElement = document.getElementById('job-details');
        if (detailsElement) detailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Canvas Drawing Logic
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        // Use canvas's own rect to match CSS dimensions correctly
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Scale context
        ctx.scale(dpr, dpr);

        // Logic Dimensions
        const width = rect.width;
        const height = rect.height;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Chart Area Margins - Responsive padding for mobile
        const isMobile = width < 480;
        const padding = {
            top: isMobile ? 30 : 40,
            right: isMobile ? 40 : 60,
            bottom: isMobile ? 25 : 30,
            left: 10
        };
        // Add minimum size protection to prevent negative dimensions
        const chartWidth = Math.max(width - padding.left - padding.right, 50);
        const chartHeight = Math.max(height - padding.top - padding.bottom, 50); // Main chart area height (including volume)

        // Calculate Scale
        const allHighs = data.map(d => d.high);
        const allLows = data.map(d => d.low);
        let minPrice = Math.min(...allLows);
        let maxPrice = Math.max(...allHighs);

        // Add padding to price range
        const pricePadding = (maxPrice - minPrice) * 0.1;
        minPrice -= pricePadding;
        maxPrice += pricePadding;
        const priceRange = maxPrice - minPrice || 1;

        // X-Axis layout
        const candleWidth = (chartWidth / data.length) * 0.7;
        const candleGap = (chartWidth / data.length) * 0.3;
        const step = candleWidth + candleGap;

        // Helper: Get Coordinates
        const getX = (index: number) => padding.left + (index * step) + (candleWidth / 2);
        const getY = (price: number) => padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

        // 1. Draw Grid
        ctx.strokeStyle = '#1e293b'; // slate-800
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Horizontal Grid Lines & Price Labels
        const gridLines = 6;
        ctx.fillStyle = '#64748b'; // slate-500
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);

            // Price Label
            const priceLabel = maxPrice - (i * (maxPrice - minPrice) / gridLines);
            ctx.fillText(priceLabel.toFixed(0), width - padding.right + 5, y);
        }
        ctx.stroke();

        // 2. Moving Average
        const maPeriod = 7;
        ctx.strokeStyle = '#f59e0b'; // amber-500
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        let maStarted = false;

        data.forEach((_, i) => {
            const ma = calculateSMA(data, maPeriod, i);
            if (ma !== null) {
                const x = getX(i);
                const y = getY(ma);
                if (!maStarted) {
                    ctx.moveTo(x, y);
                    maStarted = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        });
        ctx.stroke();


        // 3. Draw Candles
        data.forEach((d, i) => {
            const x = getX(i);
            const openY = getY(d.open);
            const closeY = getY(d.close);
            const highY = getY(d.high);
            const lowY = getY(d.low);

            const isBullish = d.close >= d.open;
            const color = isBullish ? '#10b981' : '#ef4444'; // emerald-500 : red-500

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;

            // Wick
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();

            // Body
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(Math.abs(openY - closeY), 1);

            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

            // Volume (at bottom of chart area)
            const maxVol = 50000; // Arbitrary max for scaling
            // Volume height should be roughly bottom 15% of chart
            const volumeMaxHeight = chartHeight * 0.15;
            const volHeight = Math.min((d.volume / maxVol) * volumeMaxHeight * 5, volumeMaxHeight);

            ctx.globalAlpha = 0.3;
            ctx.fillRect(x - candleWidth / 2, padding.top + chartHeight - volHeight, candleWidth, volHeight);
            ctx.globalAlpha = 1.0;

            // Event Markers ('E')
            if (d.annotated) {
                const markerY = highY - 15;
                ctx.fillStyle = '#fbbf24'; // amber-400
                ctx.beginPath();
                ctx.arc(x, markerY, 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#000';
                ctx.font = 'bold 8px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('E', x, markerY);
            }
        });

        // 4. Time Axis Labels (Simplified)
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labelInterval = Math.ceil(data.length / 6);

        data.forEach((d, i) => {
            if (i % labelInterval === 0) {
                const x = getX(i);
                ctx.fillText(d.date.slice(2), x, padding.top + chartHeight + 10);
            }
        });

    }, [data]);

    // Setup Canvas and Redraw on Resize
    useEffect(() => {
        draw();

        const handleResize = () => requestAnimationFrame(draw);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    // Interactivity: Mouse Move
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Use canvas's own rect to match draw function
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top; // Relative to canvas

        const width = rect.width;
        // Chart Area Metrics (must match draw function) - Responsive padding
        const isMobile = width < 480;
        const padding = {
            top: isMobile ? 30 : 40,
            right: isMobile ? 40 : 60,
            bottom: isMobile ? 25 : 30,
            left: 10
        };
        const chartWidth = Math.max(width - padding.left - padding.right, 50);
        const step = (chartWidth / data.length); // Approximate step per candle

        // Find Index
        // x = padding.left + index * step + (step/2 approx)
        // index = (x - padding.left) / step
        let index = Math.floor((x - padding.left) / step);

        if (index >= 0 && index < data.length) {
            const d = data[index];
            // Provide Tooltip Data
            setHoverInfo({
                x: e.clientX, // Screen coords for tooltip
                y: e.clientY,
                data: d
            });
        } else {
            setHoverInfo(null);
        }
    };

    const handleMouseLeave = () => {
        setHoverInfo(null);
    };

    // Interactivity: Click
    const handleClick = () => {
        if (hoverInfo && hoverInfo.data.event) {
            setSelectedJobId(hoverInfo.data.event.id);
            const detailsElement = document.getElementById('job-details');
            if (detailsElement) detailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Chart Section */}
            <div className="chart-container">
                {/* Terminal-style Header Bar */}
                <div className="chart-header-bar flex-col sm:flex-row gap-3 sm:gap-0">
                    <div className="chart-symbol flex-wrap">
                        <h2 className="chart-symbol-name text-base sm:text-xl">CAREER.{personal.firstName}</h2>
                        <span className="chart-symbol-badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            BULLISH
                        </span>
                        <span className="chart-symbol-badge bg-slate-800 text-slate-400 border-slate-700 hidden sm:inline-block">
                            EXPERIENCE
                        </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Time Range Controls - Responsive */}
                        <div className="time-range-controls flex-wrap">
                            <button className="time-range-btn min-h-[44px] min-w-[40px] sm:min-h-0 sm:min-w-0">1Y</button>
                            <button className="time-range-btn min-h-[44px] min-w-[40px] sm:min-h-0 sm:min-w-0">3Y</button>
                            <button className="time-range-btn min-h-[44px] min-w-[40px] sm:min-h-0 sm:min-w-0">5Y</button>
                            <button className="time-range-btn min-h-[44px] min-w-[40px] sm:min-h-0 sm:min-w-0 active">ALL</button>
                        </div>
                        {/* Indicator Toggles */}
                        <div className="indicator-toggles hidden md:flex">
                            <span className="indicator-tag on">MA7 ✓</span>
                            <span className="indicator-tag on">VOL ✓</span>
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div
                    ref={containerRef}
                    className="h-[420px] w-full p-4 relative overflow-hidden group"
                >
                    {/* OHLC Overlay */}
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        {data.length > 0 && (
                            <div className="flex items-center gap-4 text-xs font-mono bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-slate-500">O: <span className="text-slate-300">{data[data.length - 1].open}</span></span>
                                <span className="text-slate-500">H: <span className="text-emerald-400">{data[data.length - 1].high}</span></span>
                                <span className="text-slate-500">L: <span className="text-red-400">{data[data.length - 1].low}</span></span>
                                <span className="text-slate-500">C: <span className={data[data.length - 1].close >= data[data.length - 1].open ? 'text-emerald-400' : 'text-red-400'}>{data[data.length - 1].close}</span></span>
                            </div>
                        )}
                    </div>

                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                    />

                    {/* Tooltip Overlay */}
                    <AnimatePresence>
                        {hoverInfo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="fixed z-50 bg-slate-900/90 border border-slate-700 p-3 rounded shadow-xl backdrop-blur-sm pointer-events-none"
                                style={{
                                    left: hoverInfo.x + 15,
                                    top: hoverInfo.y + 15
                                }}
                            >
                                <p className="text-slate-400 text-xs mb-1 font-mono">{hoverInfo.data.date}</p>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 w-8">Prev</span>
                                        <span className="font-mono text-slate-300">{hoverInfo.data.open}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 w-8">Last</span>
                                        <span className={cn("font-mono font-bold", hoverInfo.data.close >= hoverInfo.data.open ? "text-green-500" : "text-red-500")}>
                                            {hoverInfo.data.close}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-800">
                                        <span>H: {hoverInfo.data.high}</span>
                                        <span>L: {hoverInfo.data.low}</span>
                                    </div>
                                </div>
                                {hoverInfo.data.event && (
                                    <div className="mt-2 pt-2 border-t border-slate-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                            <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider">Major Event</p>
                                        </div>
                                        <p className="text-white text-sm font-bold">
                                            {hoverInfo.data.event.title}
                                        </p>
                                        <p className="text-slate-400 text-xs">
                                            {hoverInfo.data.event.company}
                                        </p>
                                        <p className="text-[10px] text-green-400 mt-1 uppercase tracking-widest">
                                            Click to View
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Recent History List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <FaHistory className="text-emerald-500" />
                        Trade History
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                        {experienceData.length} POSITIONS
                    </span>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {experienceData.map((exp) => (
                        <div
                            key={exp.id}
                            className={cn(
                                "trade-history-card p-4 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer",
                                selectedJobId === exp.id ? "bg-slate-800/80 border-emerald-500/50" : "bg-slate-900/50"
                            )}
                            onClick={() => handleListClick(exp.id)}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                                    {exp.start} - {exp.end}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded border border-emerald-500/30">
                                    VIEW
                                </span>
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-1">{exp.company}</h4>
                            <p className="text-xs text-slate-400">{exp.title}</p>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="trade-history-table max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hidden md:block">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 font-mono uppercase text-xs sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Period</th>
                                <th className="px-6 py-3">Company</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {experienceData.map((exp) => (
                                <tr
                                    key={exp.id}
                                    className={cn(
                                        "hover:bg-slate-800/50 transition-colors cursor-pointer group",
                                        selectedJobId === exp.id ? "bg-slate-800/80" : ""
                                    )}
                                    onClick={() => handleListClick(exp.id)}
                                >
                                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                                        {exp.start} - {exp.end}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-white group-hover:text-green-400 transition-colors">
                                        {exp.company}
                                    </td>
                                    <td className="px-6 py-4">
                                        {exp.title}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded text-slate-500 group-hover:bg-green-900/30 group-hover:text-green-400 border border-transparent group-hover:border-green-500/30 transition-all">
                                            VIEW
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Card */}
            <div id="job-details" className="min-h-[300px] scroll-mt-6">
                <AnimatePresence mode="wait">
                    {selectedJob && (
                        <motion.div
                            key={selectedJob.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="job-details-card p-6 md:p-8"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="flex flex-col md:flex-row gap-6 md:items-start relative z-10">
                                <div className="flex-shrink-0">
                                    <CompanyLogoSimple
                                        src={selectedJob.companyLogo}
                                        companyName={selectedJob.company}
                                        size="lg"
                                    />
                                </div>

                                <div className="flex-grow space-y-4">
                                    <div>
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white tracking-tight">{selectedJob.title}</h3>
                                                <div className="flex items-center gap-2 text-green-400 font-medium mt-1">
                                                    <FaBuilding className="text-sm" />
                                                    {selectedJob.company}
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
                                                <FaCalendarAlt />
                                                {selectedJob.start} - {selectedJob.end}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-slate-500 text-sm mt-3 pb-4 border-b border-slate-800/50">
                                            <span className="flex items-center gap-1.5"><FaBriefcase /> {selectedJob.department}</span>
                                            <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {selectedJob.location}</span>
                                        </div>
                                    </div>

                                    <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                                        <p className="leading-relaxed text-slate-300 bg-slate-800/30 p-4 rounded-lg border-l-2 border-slate-600">
                                            {selectedJob.summary}
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-8 mt-6">
                                            <div>
                                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                                    Key Responsibilities
                                                </h4>
                                                <ul className="space-y-2">
                                                    {selectedJob.responsibilities.map((resp, i) => (
                                                        <li key={i} className="text-slate-400 flex items-start gap-3 group">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors flex-shrink-0"></span>
                                                            <span className="leading-snug">{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                {selectedJob.achievements && (
                                                    <>
                                                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                                            Key Achievements
                                                        </h4>
                                                        <ul className="space-y-2 mb-6">
                                                            {selectedJob.achievements.map((ach, i) => (
                                                                <li key={i} className="text-slate-400 flex items-start gap-3 group">
                                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-yellow-500 transition-colors flex-shrink-0"></span>
                                                                    <span className="leading-snug">{ach}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}

                                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                                    Tech Stack
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedJob.techStack.map((tech, i) => (
                                                        <span key={i} className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 hover:border-slate-500 hover:text-white transition-all cursor-default">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
