"use client";

import { StockLayout } from '@/components/stock/StockLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Target,
    Shield,
    Crosshair,
    CheckCircle2,
    ExternalLink,
    Github,
    Clock,
    Building2,
    Star,
    BarChart3,
    Zap,
    Calendar,
    Users,
    Code2,
    Lightbulb,
    Award,
    Play,
    Pause,
    Activity,
    Layers,
    FileText,
    LineChart
} from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import type { ProjectDetail } from '@/data/projects';
import { useSite } from '@/lib/site';

interface ProjectDetailClientProps {
    id: string | null;
}

export default function ProjectDetailClient({ id }: ProjectDetailClientProps) {
    const { projects } = useSite();
    const project = id ? projects.find((p) => p.id === id) : undefined;

    return (
        <StockLayout>
            {project ? <ProjectContent key={project.id} project={project} /> : <SymbolNotFound id={id} />}
        </StockLayout>
    );
}

function SymbolNotFound({ id }: { id: string | null }) {
    return (
        <div className="space-y-6 pb-8">
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-stock-muted hover:text-stock-green transition-colors text-sm group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Watchlist
            </Link>
            <div className="glass-card p-8 text-center">
                <Activity size={40} className="mx-auto text-stock-red/70 mb-4" />
                <h1 className="text-xl font-bold text-stock-text font-mono mb-2">SYMBOL NOT FOUND</h1>
                <p className="text-stock-muted text-sm">
                    {id ? <>No listing matches <span className="font-mono text-stock-text">{id}</span>. It may have been delisted.</> : "No symbol was given."}
                </p>
            </div>
        </div>
    );
}

function ProjectContent({ project }: { project: ProjectDetail }) {
    const [price, setPrice] = useState(100);
    const [change, setChange] = useState(() => (Math.random() - 0.3) * 30);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const dataRef = useRef<number[]>([]);
    const [dayHigh, setDayHigh] = useState(0);
    const [dayLow, setDayLow] = useState(0);

    const isPositive = change >= 0;
    const symbol = project.title.replace(/\s+/g, '').toUpperCase().slice(0, 6);

    // Initialize price data
    useEffect(() => {
        const basePrice = 50 + Math.random() * 150;
        setPrice(basePrice);
        setDayHigh(basePrice * 1.05);
        setDayLow(basePrice * 0.95);
    }, []);

    // Simulate price changes
    useEffect(() => {
        const interval = setInterval(() => {
            setPrice(prev => {
                const newPrice = Math.max(50, prev + (Math.random() - 0.45) * 5);
                setDayHigh(h => Math.max(h, newPrice));
                setDayLow(l => Math.min(l, newPrice));
                return newPrice;
            });
            setChange(prev => Math.max(-20, Math.min(40, prev + (Math.random() - 0.45) * 2)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Mini chart animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (dataRef.current.length === 0) {
            let value = 100;
            for (let i = 0; i < 80; i++) {
                value *= (1 + (Math.random() - 0.45) * 0.03);
                value = Math.max(50, Math.min(150, value));
                dataRef.current.push(value);
            }
        }

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Draw grid lines
            ctx.strokeStyle = 'rgba(39, 39, 42, 0.5)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            const data = dataRef.current;
            const min = Math.min(...data) * 0.98;
            const max = Math.max(...data) * 1.02;

            // Draw area
            ctx.beginPath();
            ctx.moveTo(0, height);
            data.forEach((val, i) => {
                const x = (i / (data.length - 1)) * width;
                const y = height - ((val - min) / (max - min)) * height;
                ctx.lineTo(x, y);
            });
            ctx.lineTo(width, height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, isPositive ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw line
            ctx.beginPath();
            data.forEach((val, i) => {
                const x = (i / (data.length - 1)) * width;
                const y = height - ((val - min) / (max - min)) * height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = isPositive ? "#22c55e" : "#ef4444";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Draw current price dot
            const lastY = height - ((data[data.length - 1] - min) / (max - min)) * height;
            ctx.beginPath();
            ctx.arc(width - 2, lastY, 4, 0, Math.PI * 2);
            ctx.fillStyle = isPositive ? "#22c55e" : "#ef4444";
            ctx.fill();

            if (isPlaying) {
                const lastVal = data[data.length - 1];
                const newVal = lastVal * (1 + (Math.random() - 0.45) * 0.02);
                dataRef.current.push(Math.max(50, Math.min(150, newVal)));
                if (dataRef.current.length > 120) {
                    dataRef.current.shift();
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationRef.current);
    }, [isPositive, isPlaying]);

    const statusConfig: Record<string, { color: string, bg: string, border: string, label: string, icon: React.ReactNode }> = {
        "In Progress": { color: "text-stock-green", bg: "bg-stock-green/20", border: "border-stock-green/30", label: "ACTIVE", icon: <Activity size={10} /> },
        "Completed": { color: "text-stock-accent", bg: "bg-stock-accent/20", border: "border-stock-accent/30", label: "COMPLETED", icon: <CheckCircle2 size={10} /> },
        "Archived": { color: "text-stock-muted", bg: "bg-stock-muted/20", border: "border-stock-muted/30", label: "ARCHIVED", icon: <Clock size={10} /> },
    };

    const status = statusConfig[project.status] || statusConfig["Archived"];

    return (
        <div className="space-y-6 pb-8">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-stock-muted hover:text-stock-green transition-colors text-sm group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Watchlist
                </Link>
            </motion.div>

            {/* Stock Quote Header */}
            <motion.div
                className="quote-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Background Chart */}
                <div className="absolute inset-0 opacity-30">
                    <canvas
                        ref={canvasRef}
                        width={1000}
                        height={300}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stock-panel via-transparent to-stock-panel" />
                </div>

                <div className="relative">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        {/* Left: Symbol & Info */}
                        <div className="flex-1 space-y-4">
                            {/* Symbol Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl glass-subtle flex items-center justify-center">
                                    <span className="text-2xl font-mono font-bold text-stock-green">{symbol.slice(0, 2)}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-stock-green font-mono font-bold text-xl">{symbol}</span>
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.bg} ${status.color} ${status.border}`}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                        {project.featured && (
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-stock-gold/20 text-stock-gold border-stock-gold/30 flex items-center gap-1">
                                                <Star size={10} fill="currentColor" />
                                                FEATURED
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-stock-text">
                                        {project.title}
                                    </h1>
                                </div>
                            </div>

                            <p className="text-stock-muted text-lg max-w-2xl">
                                {project.subtitle}
                            </p>

                            {/* Quick Stats Bar */}
                            <div className="flex flex-wrap items-center gap-3">
                                <QuickStat icon={<Clock size={12} />} label="Duration" value={project.timeline.duration} />
                                {project.company && (
                                    <QuickStat icon={<Building2 size={12} />} label="Company" value={project.company} />
                                )}
                                <QuickStat icon={<BarChart3 size={12} />} label="Role" value={project.role} />
                                <QuickStat icon={<Layers size={12} />} label="Tech Stack" value={`${project.technologies.length} tools`} />
                            </div>
                        </div>

                        {/* Right: Price Display */}
                        <div className="glass-card p-5 min-w-[220px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-stock-muted text-xs font-mono uppercase tracking-wider">Project Value</span>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-1.5 glass-subtle rounded-lg hover:bg-stock-border transition-colors"
                                >
                                    {isPlaying ? <Pause size={12} className="text-stock-muted" /> : <Play size={12} className="text-stock-green" />}
                                </button>
                            </div>
                            <div className={`text-4xl font-bold font-mono ${isPositive ? 'text-stock-green' : 'text-stock-red'}`}>
                                ${price.toFixed(2)}
                            </div>
                            <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-stock-green' : 'text-stock-red'}`}>
                                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span className="font-mono">{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
                                <span className="text-stock-muted text-xs">Today</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-stock-border/30 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div className="text-stock-muted">Day High</div>
                                    <div className="text-stock-green font-mono">${dayHigh.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-stock-muted">Day Low</div>
                                    <div className="text-stock-red font-mono">${dayLow.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Links */}
                    {(project.links.github || project.links.demo) && (
                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-stock-border/30">
                            {project.links.github && (
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 glass-subtle rounded-xl text-stock-text hover:border-stock-green hover:text-stock-green transition-colors border border-transparent"
                                >
                                    <Github size={16} />
                                    View Source
                                    <ExternalLink size={12} className="opacity-50" />
                                </a>
                            )}
                            {project.links.demo && (
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-stock-green text-stock-bg rounded-xl font-semibold hover:bg-stock-green/90 transition-colors"
                                >
                                    Live Demo
                                    <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Fundamentals Grid */}
            <motion.div
                className="fundamentals-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <FundamentalItem
                    icon={<Calendar size={16} />}
                    label="Started"
                    value={project.timeline.start || "N/A"}
                />
                <FundamentalItem
                    icon={<Clock size={16} />}
                    label="Duration"
                    value={project.timeline.duration}
                    highlight
                />
                <FundamentalItem
                    icon={<Code2 size={16} />}
                    label="Tech Count"
                    value={project.technologies.length.toString()}
                />
                <FundamentalItem
                    icon={<Target size={16} />}
                    label="Features"
                    value={project.features.length.toString()}
                />
            </motion.div>

            {/* Fundamental Analysis Section */}
            <motion.div
                className="analysis-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="analysis-header">
                    <FileText size={18} className="text-stock-accent" />
                    <h2 className="analysis-title">Fundamental Analysis</h2>
                    <span className="text-[10px] text-stock-muted font-mono ml-auto">OVERVIEW</span>
                </div>
                <p className="analysis-content text-base">
                    {project.longDescription}
                </p>
            </motion.div>

            {/* Order Book Style: Features vs Challenges */}
            <motion.div
                className="orderbook-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Buy Side - Features */}
                <div className="orderbook-side buy">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-stock-green" />
                        <h3 className="font-bold text-stock-text">Key Features</h3>
                        <span className="text-[10px] text-stock-green font-mono ml-auto">BUY SIGNALS</span>
                    </div>
                    <div className="space-y-1">
                        {project.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.03 }}
                                className="orderbook-item"
                            >
                                <div className="w-6 h-6 rounded-md bg-stock-green/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={12} className="text-stock-green" />
                                </div>
                                <p className="text-stock-text text-sm flex-1">{feature}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sell Side - Challenges */}
                <div className="orderbook-side sell">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={16} className="text-stock-red" />
                        <h3 className="font-bold text-stock-text">Challenges</h3>
                        <span className="text-[10px] text-stock-red font-mono ml-auto">RISK FACTORS</span>
                    </div>
                    <div className="space-y-1">
                        {project.challenges.map((challenge, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.03 }}
                                className="orderbook-item"
                            >
                                <div className="w-6 h-6 rounded-md bg-stock-red/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-stock-red font-mono text-xs font-bold">!</span>
                                </div>
                                <p className="text-stock-text text-sm flex-1">{challenge}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Solutions & Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Solutions */}
                <motion.div
                    className="analysis-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="analysis-header">
                        <Crosshair size={18} className="text-stock-accent" />
                        <h2 className="analysis-title">Strategic Solutions</h2>
                    </div>
                    <div className="space-y-3">
                        {project.solutions.map((solution, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 + i * 0.03 }}
                                className="flex items-start gap-3 p-3 glass-subtle rounded-lg"
                            >
                                <div className="w-6 h-6 rounded-md bg-stock-accent/20 flex items-center justify-center flex-shrink-0">
                                    <Zap size={12} className="text-stock-accent" />
                                </div>
                                <p className="text-stock-text text-sm">{solution}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Results */}
                <motion.div
                    className="analysis-section glass-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="analysis-header">
                        <Award size={18} className="text-stock-green" />
                        <h2 className="analysis-title">Performance Results</h2>
                        <span className="text-[10px] text-stock-green font-mono ml-auto">OUTPERFORM</span>
                    </div>
                    <div className="space-y-3">
                        {project.results.map((result, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.03 }}
                                className="flex items-start gap-3 p-3 bg-stock-green/10 rounded-lg border border-stock-green/20"
                            >
                                <div className="w-6 h-6 rounded-md bg-stock-green/20 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp size={12} className="text-stock-green" />
                                </div>
                                <p className="text-stock-green text-sm">{result}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Technologies */}
            <motion.div
                className="analysis-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <div className="analysis-header">
                    <Code2 size={18} className="text-stock-cyan" />
                    <h2 className="analysis-title">Tech Stack Holdings</h2>
                    <span className="text-[10px] text-stock-muted font-mono ml-auto">{project.technologies.length} POSITIONS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                        <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.35 + i * 0.02 }}
                            className="px-3 py-2 glass-subtle text-stock-cyan text-sm rounded-lg font-mono border border-stock-cyan/20 hover:bg-stock-cyan/10 transition-colors cursor-default"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* Timeline & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timeline */}
                <motion.div
                    className="glass-card p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <LineChart size={18} className="text-stock-accent" />
                        <h2 className="text-lg font-bold text-stock-text">Project Timeline</h2>
                    </div>
                    <div className="space-y-3">
                        <TimelineRow label="Entry Date" value={project.timeline.start || "N/A"} />
                        {project.timeline.end && (
                            <TimelineRow label="Exit Date" value={project.timeline.end} />
                        )}
                        <TimelineRow label="Holding Period" value={project.timeline.duration} highlight />
                    </div>
                </motion.div>

                {/* Team */}
                {project.team && project.team.length > 0 && (
                    <motion.div
                        className="glass-card p-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={18} className="text-stock-accent" />
                            <h2 className="text-lg font-bold text-stock-text">Team Composition</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.team.map((member, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-2 glass-subtle text-stock-text text-sm rounded-lg"
                                >
                                    {member}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 glass-subtle px-3 py-2 rounded-lg text-sm">
            <span className="text-stock-accent">{icon}</span>
            <span className="text-stock-muted">{label}:</span>
            <span className="text-stock-text font-medium">{value}</span>
        </div>
    );
}

function FundamentalItem({
    icon,
    label,
    value,
    highlight
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="fundamental-item">
            <div className={`flex justify-center mb-2 ${highlight ? "text-stock-green" : "text-stock-muted"}`}>
                {icon}
            </div>
            <div className="fundamental-label">{label}</div>
            <div className={`fundamental-value ${highlight ? "positive" : ""}`}>{value}</div>
        </div>
    );
}

function TimelineRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`flex justify-between items-center p-3 rounded-lg ${highlight ? 'bg-stock-green/10 border border-stock-green/20' : 'glass-subtle'}`}>
            <span className="text-stock-muted text-sm">{label}</span>
            <span className={`font-mono ${highlight ? 'text-stock-green font-bold' : 'text-stock-text'}`}>{value}</span>
        </div>
    );
}
