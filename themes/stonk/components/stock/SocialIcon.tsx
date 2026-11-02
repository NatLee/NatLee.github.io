"use client";

import { Github, Linkedin, Rss, Globe } from "lucide-react";
import { FaMedium, FaKaggle } from "react-icons/fa";
import { SiHuggingface, SiLeetcode } from "react-icons/si";

/** Icon for a profile.socials entry, keyed by its `icon` field. Unknown keys get a globe. */
export function SocialGlyph({ icon, size = 18 }: { icon: string; size?: number }) {
    switch (icon.toLowerCase()) {
        case "github": return <Github size={size} />;
        case "linkedin": return <Linkedin size={size} />;
        case "medium": return <FaMedium size={size} />;
        case "kaggle": return <FaKaggle size={size} />;
        case "huggingface": return <SiHuggingface size={size} />;
        case "leetcode": return <SiLeetcode size={size} />;
        case "blog":
        case "rss": return <Rss size={size} />;
        default: return <Globe size={size} />;
    }
}
