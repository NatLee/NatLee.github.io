"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

interface CompanyLogoProps {
    src: string;
    companyName: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Generate a consistent color based on company name
function getCompanyColor(name: string): string {
    const colors = [
        "from-emerald-500 to-emerald-700",
        "from-blue-500 to-blue-700",
        "from-purple-500 to-purple-700",
        "from-amber-500 to-amber-700",
        "from-rose-500 to-rose-700",
        "from-cyan-500 to-cyan-700",
        "from-orange-500 to-orange-700",
        "from-indigo-500 to-indigo-700",
    ];

    // Simple hash based on company name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

// Get company initial(s)
function getInitials(name: string): string {
    const words = name.split(/[\s.,&-]+/).filter(Boolean);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
};

export function CompanyLogo({
    src,
    companyName,
    size = "md",
    className = ""
}: CompanyLogoProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const initials = getInitials(companyName);
    const gradientColor = getCompanyColor(companyName);
    const sizeClass = sizeClasses[size];

    // Check if src is empty or invalid
    const isValidSrc = src && src.trim() !== "" && !src.includes("undefined");

    if (!isValidSrc || hasError) {
        // Render placeholder with company initial
        return (
            <div
                className={`${sizeClass} rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center font-bold text-white shadow-lg ${className}`}
                title={companyName}
            >
                {initials}
            </div>
        );
    }

    return (
        <div className={`${sizeClass} relative rounded-lg overflow-hidden bg-white border border-stock-border/30 shadow-lg ${className}`}>
            {isLoading && (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
                    <Building2 className="w-1/2 h-1/2 text-white/50 animate-pulse" />
                </div>
            )}
            <Image
                src={src}
                alt={companyName}
                fill
                className={`object-contain p-1 transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                unoptimized
            />
        </div>
    );
}

// Alternative: Simple fallback without Next Image (for inline use)
export function CompanyLogoSimple({
    src,
    companyName,
    size = "md",
    className = ""
}: CompanyLogoProps) {
    const [hasError, setHasError] = useState(false);

    const initials = getInitials(companyName);
    const gradientColor = getCompanyColor(companyName);
    const sizeClass = sizeClasses[size];

    const isValidSrc = src && src.trim() !== "" && !src.includes("undefined");

    if (!isValidSrc || hasError) {
        return (
            <div
                className={`${sizeClass} rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center font-bold text-white shadow-lg ${className}`}
                title={companyName}
            >
                {initials}
            </div>
        );
    }

    return (
        <div className={`${sizeClass} rounded-lg overflow-hidden bg-white border border-stock-border/30 shadow-lg flex items-center justify-center ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={companyName}
                className="w-full h-full object-contain p-1"
                onError={() => setHasError(true)}
            />
        </div>
    );
}
