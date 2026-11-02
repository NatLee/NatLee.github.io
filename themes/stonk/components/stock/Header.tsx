"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "@/lib/site";
import {
    Menu,
    X,
    Home,
    User,
    Briefcase,
    FolderKanban,
    ChevronRight,
    Activity
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TickerTape } from "./TickerTape";
import { SocialGlyph } from "./SocialIcon";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: User, label: "About", href: "/about" },
    { icon: Briefcase, label: "Experience", href: "/experience" },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
];

export function Header({ showTicker = false }: { showTicker?: boolean }) {
    // trailingSlash: true can report "/about/"; compare without it.
    const pathname = usePathname().replace(/(.)\/+$/, "$1");
    const { personal: personalInfo } = useSite();
    // The header keeps its compact look: only the first two profile links.
    const headerSocials = personalInfo.socialLinks.slice(0, 2);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeHover, setActiveHover] = useState<string | null>(null);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500",
            isScrolled
                ? "bg-stock-bg/95 backdrop-blur-2xl border-b border-stock-border/60 shadow-lg shadow-black/20"
                : "bg-stock-bg/80 backdrop-blur-xl border-b border-stock-border/30"
        )}>
            {/* Animated top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-stock-green to-transparent"
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
                <div className={cn(
                    "flex items-center justify-between transition-all duration-300",
                    isScrolled ? "py-3" : "py-4"
                )}>
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <motion.div
                                className={cn(
                                    "w-11 h-11 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                    isScrolled ? "border-stock-green/40" : "border-stock-green/60"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Image
                                    src={personalInfo.avatar}
                                    alt={personalInfo.name}
                                    width={44}
                                    height={44}
                                    className="object-cover w-full h-full"
                                />
                            </motion.div>
                            <motion.div
                                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-stock-green rounded-full border-2 border-stock-bg"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.8, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>

                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <span className="text-stock-text font-bold text-lg group-hover:text-stock-green transition-colors">
                                    {personalInfo.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Activity size={10} className="text-stock-green" />
                                <span className="text-stock-muted text-xs font-mono">
                                    {personalInfo.title.split(' ').slice(0, 2).join(' ')}
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Enhanced Design */}
                    <nav className="hidden md:flex items-center">
                        <div className={cn(
                            "relative flex items-center gap-1 p-1.5 rounded-2xl transition-all duration-300",
                            isScrolled
                                ? "bg-stock-panel/80 border border-stock-border/50"
                                : "bg-stock-panel/40 backdrop-blur-sm border border-stock-border/30"
                        )}>
                            {/* Animated background for active item */}
                            <AnimatePresence>
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    if (isActive) {
                                        return (
                                            <motion.div
                                                key={`bg-${item.href}`}
                                                className="absolute bg-stock-green rounded-xl"
                                                layoutId="activeNavBg"
                                                initial={false}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 30
                                                }}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </AnimatePresence>

                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const isHovered = activeHover === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 z-10",
                                            isActive
                                                ? "text-stock-bg"
                                                : "text-stock-muted hover:text-stock-text"
                                        )}
                                        onMouseEnter={() => setActiveHover(item.href)}
                                        onMouseLeave={() => setActiveHover(null)}
                                    >
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 bg-stock-green rounded-xl"
                                                layoutId="activeNavBg"
                                                initial={false}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 30
                                                }}
                                            />
                                        )}

                                        {/* Hover effect */}
                                        {!isActive && isHovered && (
                                            <motion.div
                                                className="absolute inset-0 bg-stock-border/50 rounded-xl"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}

                                        <span className="relative z-10 flex items-center gap-2">
                                            <item.icon size={16} />
                                            <span>{item.label}</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Right Section - Social & Actions */}
                    <div className="flex items-center gap-2">
                        {/* Social Links - Enhanced */}
                        <div className={cn(
                            "hidden md:flex items-center gap-1 p-1 rounded-xl transition-all duration-300",
                            isScrolled
                                ? "bg-stock-panel/50"
                                : "bg-stock-panel/30 backdrop-blur-sm"
                        )}>
                            {headerSocials.map((social) => (
                                <SocialButton
                                    key={social.url}
                                    href={social.url}
                                    icon={<SocialGlyph icon={social.icon} size={18} />}
                                    label={social.name}
                                />
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className={cn(
                                "md:hidden p-2.5 rounded-xl transition-colors",
                                isMenuOpen
                                    ? "bg-stock-green text-stock-bg"
                                    : "text-stock-muted hover:text-stock-text hover:bg-stock-border/50"
                            )}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Enhanced */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden absolute top-full left-0 right-0 bg-stock-panel border-b-2 border-stock-green/40 shadow-2xl shadow-black/50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 space-y-2">
                            {navItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-200",
                                                isActive
                                                    ? "bg-stock-green text-stock-bg"
                                                    : "text-stock-text hover:bg-stock-border/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    isActive ? "bg-stock-bg/20" : "bg-stock-border/50"
                                                )}>
                                                    <item.icon size={18} />
                                                </div>
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            <ChevronRight size={18} className={isActive ? "text-stock-bg/70" : "text-stock-muted"} />
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            {/* Mobile Socials */}
                            <motion.div
                                className="pt-4 mt-4 border-t border-stock-border"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center justify-center gap-4">
                                    {headerSocials.map((social) => (
                                        <a
                                            key={social.url}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 bg-stock-border/50 rounded-xl text-stock-muted hover:text-stock-text transition-colors"
                                        >
                                            <SocialGlyph icon={social.icon} size={18} />
                                            <span className="text-sm font-medium">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ticker Tape - Sticky with Header */}
            {showTicker && <TickerTape />}
        </header>
    );
}

function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative p-2.5 text-stock-muted hover:text-stock-text rounded-lg transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {icon}
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-stock-panel border border-stock-border rounded text-xs text-stock-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </motion.a>
    );
}
