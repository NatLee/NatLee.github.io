"use client";

import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Code2,
    ArrowRight,
    Mail,
    Zap,
    Calendar,
    Activity,
    TrendingUp,
    Radio
} from "lucide-react";
import { SocialGlyph } from "./SocialIcon";

export function MarketWelcome() {
    // Metrics derived from the bundle
    const { personal: personalInfo, stats } = useSite();
    const totalSkills = stats.skills;
    const totalProjects = stats.projects;
    const yearsExperience = stats.years;

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl min-h-[550px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background base with grid pattern */}
            <div className="absolute inset-0 bg-stock-panel" />

            {/* Animated grid overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Scanning line animation */}
            <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-stock-green/50 to-transparent"
                initial={{ top: 0, opacity: 0 }}
                animate={{
                    top: ["0%", "100%"],
                    opacity: [0, 1, 1, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Data stream particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-8 bg-gradient-to-b from-stock-green/30 to-transparent rounded-full"
                        style={{ left: `${15 + i * 15}%` }}
                        initial={{ top: -50, opacity: 0 }}
                        animate={{
                            top: ["0%", "120%"],
                            opacity: [0, 0.6, 0.6, 0]
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-stock-panel/95 via-stock-panel/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stock-panel/90 via-transparent to-stock-panel/40" />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
                {/* Top bar with status indicators */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-2 bg-stock-bg/50 backdrop-blur-sm border-b border-stock-border/30">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-[10px] font-mono text-stock-green">
                            <Radio size={10} className="animate-pulse" />
                            LIVE MARKET
                        </span>
                        <span className="text-stock-border/50">|</span>
                        <span className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-stock-muted">
                            <Activity size={10} />
                            SYSTEM ACTIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-stock-green bg-stock-green/10 px-2 py-0.5 rounded-full">
                            <TrendingUp size={10} />
                            +{yearsExperience} YRS GROWTH
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-center pt-10">
                    {/* Left: Large Avatar */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-3xl bg-stock-green/20 blur-2xl" />

                            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-3xl overflow-hidden border-2 border-stock-green/50 shadow-2xl shadow-stock-green/20">
                                <Image
                                    src={personalInfo.avatar}
                                    alt={personalInfo.name}
                                    width={256}
                                    height={256}
                                    className="object-cover w-full h-full"
                                />
                                {/* Scan line over avatar */}
                                <motion.div
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-stock-green/60 to-transparent"
                                    animate={{ top: ["0%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-stock-green rounded-xl p-2.5 border-4 border-stock-panel shadow-lg">
                                <Zap size={20} className="text-stock-bg" />
                            </div>
                            {/* Status indicator */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-stock-bg/90 backdrop-blur-sm px-2 py-1 rounded-full border border-stock-green/30">
                                <span className="w-2 h-2 bg-stock-green rounded-full animate-pulse" />
                                <span className="text-[10px] text-stock-green font-mono font-bold">ONLINE</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info & Actions */}
                    <div className="flex-1 text-center lg:text-left space-y-5">
                        {/* Name & Title */}
                        <div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                <span className="text-[10px] font-mono text-stock-accent bg-stock-accent/10 px-2 py-0.5 rounded border border-stock-accent/20">
                                    PORTFOLIO.EXE
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stock-text mb-2">
                                Hi, I'm <span className="text-stock-green">{personalInfo.name}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-stock-green font-medium font-mono">
                                {personalInfo.title}
                            </p>
                        </div>

                        {/* Location (no employer on the first screen) */}
                        {personalInfo.location && (
                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-stock-muted">
                                <span className="flex items-center gap-2">
                                    <MapPin size={16} className="text-stock-accent" />
                                    {personalInfo.location}
                                </span>
                            </div>
                        )}

                        {/* Bio */}
                        <p className="text-stock-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {personalInfo.bio}
                        </p>

                        {/* Stats - styled as terminal metrics */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            <StatBadge
                                value={`${yearsExperience}+`}
                                label="Years"
                                icon={<Calendar size={14} />}
                            />
                            <StatBadge
                                value={totalProjects.toString()}
                                label="Projects"
                                icon={<Code2 size={14} />}
                            />
                            <StatBadge
                                value={totalSkills.toString()}
                                label="Skills"
                                icon={<Zap size={14} />}
                            />
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                            <Link
                                href="/about"
                                className="flex items-center gap-2 px-6 py-3 bg-stock-green text-stock-bg font-semibold rounded-xl hover:bg-stock-green/90 transition-all hover:shadow-lg hover:shadow-stock-green/20 text-lg"
                            >
                                About Me
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/projects"
                                className="flex items-center gap-2 px-6 py-3 bg-stock-border/50 text-stock-text font-semibold rounded-xl hover:bg-stock-border transition-colors backdrop-blur-sm"
                            >
                                View Projects
                            </Link>
                            {personalInfo.email && (
                                <a
                                    href={`mailto:${personalInfo.email}`}
                                    className="flex items-center gap-2 px-6 py-3 border border-stock-border text-stock-muted font-semibold rounded-xl hover:border-stock-green hover:text-stock-green transition-colors backdrop-blur-sm"
                                >
                                    <Mail size={18} />
                                    Contact
                                </a>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 pt-2">
                            <span className="text-xs text-stock-muted font-mono">CONNECT:</span>
                            {personalInfo.socialLinks.map((social) => (
                                <SocialIcon key={social.url} href={social.url} label={social.name} icon={<SocialGlyph icon={social.icon} size={18} />} />
                            ))}
                            {personalInfo.email && (
                                <SocialIcon href={`mailto:${personalInfo.email}`} label="Email" icon={<Mail size={18} />} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StatBadge({
    value,
    label,
    icon
}: {
    value: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 bg-stock-bg/70 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-stock-border/50 hover:border-stock-green/30 transition-colors">
            <span className="text-stock-green">{icon}</span>
            <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-stock-text font-mono">{value}</span>
                <span className="text-xs text-stock-muted uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            aria-label={label}
            className="p-2.5 bg-stock-bg/50 backdrop-blur-sm rounded-lg border border-stock-border/50 text-stock-muted hover:text-stock-green hover:border-stock-green/50 hover:bg-stock-green/10 transition-all"
        >
            {icon}
        </a>
    );
}
