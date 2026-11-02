"use client";

// Runtime content store. The bundle is fetched once from the site root (/content/site.json,
// never under the theme's basePath), adapted into the theme's view models, and handed to
// components through context. Components read it synchronously with useSite() once the
// gate (components/stock/SiteGate.tsx) has rendered them.
import { createContext, useContext } from "react";
import type { SiteBundle } from "./site-contract";
import { toPersonal, type PersonalInfo } from "@/data/personal";
import { toExperience, type Experience } from "@/data/experience";
import { toProject, type ProjectDetail } from "@/data/projects";
import { toSkillCategory, type SkillCategory } from "@/data/skills";

export const SITE_JSON_URL = "/content/site.json";

export interface SiteData {
    personal: PersonalInfo;
    experience: Experience[];
    projects: ProjectDetail[];
    skills: SkillCategory[];
    stats: {
        /** Whole years since profile.careerStartYear. */
        years: number;
        projects: number;
        skills: number;
    };
}

export function adaptBundle(bundle: SiteBundle): SiteData {
    const personal = toPersonal(bundle.profile);
    const experience = (bundle.experience ?? []).map(toExperience);
    const projects = (bundle.projects ?? []).map(toProject);
    const skills = (bundle.skills ?? []).map(toSkillCategory);
    return {
        personal,
        experience,
        projects,
        skills,
        stats: {
            years: Math.max(0, new Date().getFullYear() - personal.careerStartYear),
            projects: projects.length,
            skills: skills.reduce((n, c) => n + c.skills.length, 0),
        },
    };
}

let pending: Promise<SiteData> | null = null;

/** Fetch and adapt the bundle; concurrent callers share one request, a failure can be retried. */
export function loadSite(): Promise<SiteData> {
    if (!pending) {
        pending = fetch(SITE_JSON_URL, { cache: "no-cache" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
                return res.json() as Promise<SiteBundle>;
            })
            .then(adaptBundle)
            .catch((err) => {
                pending = null;
                throw err;
            });
    }
    return pending;
}

export const SiteContext = createContext<SiteData | null>(null);

export function useSite(): SiteData {
    const site = useContext(SiteContext);
    if (!site) throw new Error("useSite() used outside <SiteGate>");
    return site;
}

/** Symbol for a skill / technology / project name, e.g. "Time Series Analysis" → "TIMESE". */
export function toSymbol(name: string, length = 6): string {
    return name.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, length) || "N/A";
}
