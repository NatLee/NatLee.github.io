"use client";

import { StockLayout } from "@/components/stock/StockLayout";
import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import type { SkillCategory } from "@/data/skills";
import { aboutImages, heroImage } from "@/data/about_images";
import Image from "next/image";
import { useState } from "react";
import {
  TrendingUp, Calendar, Code2, Briefcase, Globe,
  MapPin, Mail, Clock, BarChart3,
  Target, Building2, Shield, Eye, ChevronLeft,
  ChevronRight, FileText, Cpu
} from "lucide-react";
import { CompanyLogoSimple } from "@/components/stock/CompanyLogo";
import { SocialGlyph } from "@/components/stock/SocialIcon";

const NOTE_DOTS = ["bg-stock-green", "bg-stock-accent", "bg-stock-gold", "bg-stock-cyan"];

export default function AboutPage() {
  // Metrics derived from the bundle
  const { personal: personalInfo, skills: skillsData, experience: experienceData, stats } = useSite();
  const totalSkills = stats.skills;
  const totalProjects = stats.projects;
  const yearsExperience = stats.years;
  const totalCompanies = experienceData.length;
  const currentPosition = experienceData[0];
  const languages = personalInfo.languages;

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % aboutImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + aboutImages.length) % aboutImages.length);

  return (
    <StockLayout>
      <div className="max-w-7xl mx-auto pb-20 px-4 pt-4">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-stock-text mb-1">
            Profile Dashboard
          </h1>
        </motion.div>

        {/* ===== BENTO GRID LAYOUT ===== */}
        <div className="grid grid-cols-12 gap-4 auto-rows-auto">

          {/* ROW 1: Profile Card + Hero Image + Stats */}

          {/* Profile Card - 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 md:col-span-3 row-span-2"
          >
            <div className="glass-card p-5 h-full">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-stock-green/40 shadow-lg shadow-stock-green/10">
                  <Image
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 right-1/2 translate-x-10 bg-stock-green rounded-lg p-1.5 border-2 border-stock-panel">
                  <Shield size={12} className="text-stock-bg" />
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-stock-text">{personalInfo.name}</h2>
                <p className="text-stock-green text-sm font-medium">{personalInfo.title}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-stock-muted">
                  <MapPin size={10} />
                  {personalInfo.location}
                </div>
              </div>

              {/* Verification Status */}
              <div className="glass-subtle rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stock-muted">Status</span>
                  <span className="text-stock-green font-mono text-[10px] bg-stock-green/15 px-2 py-0.5 rounded flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-stock-green animate-pulse" /> ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stock-muted">Rating</span>
                  <span className="text-stock-gold font-mono text-[10px]">★★★★★</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stock-muted">Tier</span>
                  <span className="text-stock-accent font-mono text-[10px]">PREMIUM</span>
                </div>
              </div>

              {/* Actions */}
              {personalInfo.email && (
                <div className="space-y-2">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-stock-green text-stock-bg font-bold rounded-lg hover:bg-stock-green/90 transition-all text-sm"
                  >
                    <Mail size={14} />
                    Contact
                  </a>
                </div>
              )}

              {/* Socials */}
              <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-stock-border/30">
                {personalInfo.socialLinks.map((social) => (
                  <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer" title={social.name} aria-label={social.name} className="p-2 glass-subtle rounded-lg text-stock-muted hover:text-stock-green transition-colors">
                    <SocialGlyph icon={social.icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Asset Visual - Hero Photo - 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-5 row-span-2"
          >
            <div className="glass-card p-0 h-full overflow-hidden relative group">
              {/* Header Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-stock-bg/90 to-transparent">
                <div className="flex items-center gap-2">
                  <Eye size={12} className="text-stock-green" />
                  <span className="text-[10px] font-mono text-stock-green">LIVE FEED</span>
                </div>
                <span className="text-[10px] font-mono text-stock-muted">{heroImage.assetId}</span>
              </div>

              {/* Image Container */}
              <div className="relative h-[320px] md:h-full min-h-[320px]">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Scan lines overlay */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none" />

                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-stock-green/60" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-stock-green/60" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-stock-green/60" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-stock-green/60" />

                {/* Verification stamp */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stock-green/90 text-stock-bg px-3 py-1.5 rounded-lg">
                  <Shield size={14} />
                  <span className="text-xs font-bold font-mono">VERIFIED PROFILE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel - 4 cols, spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-12 md:col-span-4 row-span-2"
          >
            <div className="glass-card p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-stock-green" />
                <h3 className="text-sm font-bold text-stock-text">Key Fundamentals</h3>
                <span className="text-[10px] font-mono text-stock-muted bg-stock-bg/50 px-2 py-0.5 rounded ml-auto">LIVE</span>
              </div>

              <div className="space-y-3">
                <StatMetric
                  label="EXPERIENCE"
                  value={`${yearsExperience}+ YRS`}
                  subValue="+1 YoY"
                  icon={<Calendar size={14} />}
                  positive
                />
                <StatMetric
                  label="PROJECTS DELIVERED"
                  value={totalProjects.toString()}
                  subValue="Active Pipeline"
                  icon={<Code2 size={14} />}
                  positive
                />
                <StatMetric
                  label="TECH STACK (Σ)"
                  value={totalSkills.toString()}
                  subValue={`${skillsData.length} sectors`}
                  icon={<Cpu size={14} />}
                  positive
                />
                <StatMetric
                  label="POSITION HISTORY"
                  value={totalCompanies.toString()}
                  subValue="Growth trajectory"
                  icon={<Briefcase size={14} />}
                />
                {languages.length > 0 && (
                  <StatMetric
                    label="MARKET REACH"
                    value={`${languages.length} LANG`}
                    subValue={languages.map((l) => l.name).join(" · ")}
                    icon={<Globe size={14} />}
                    positive
                  />
                )}
              </div>

              {/* Mini Performance Chart Placeholder */}
              <div className="mt-4 pt-4 border-t border-stock-border/30">
                <div className="flex items-center justify-between text-xs text-stock-muted mb-2">
                  <span>Career Growth Index</span>
                  <span className="text-stock-green font-mono">+127.5%</span>
                </div>
                <div className="h-12 bg-stock-bg/50 rounded-lg flex items-end gap-1 p-2">
                  {[20, 35, 45, 40, 55, 70, 85, 90, 95, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-stock-green/60 rounded-t transition-all hover:bg-stock-green"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ROW 2: Asset Gallery + Analyst Notes */}

          {/* Asset Gallery - KYC Documentation - 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="glass-card p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-stock-border/30">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-stock-accent" />
                  <h3 className="text-sm font-bold text-stock-text">Asset Documentation</h3>
                  <span className="text-[10px] font-mono text-stock-muted bg-stock-bg/50 px-2 py-0.5 rounded">KYC GALLERY</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-stock-muted">
                    PAGE {currentImageIndex + 1} OF {aboutImages.length}
                  </span>
                  <button onClick={prevImage} className="p-1.5 glass-subtle rounded hover:bg-stock-green/20 transition-colors">
                    <ChevronLeft size={14} className="text-stock-text" />
                  </button>
                  <button onClick={nextImage} className="p-1.5 glass-subtle rounded hover:bg-stock-green/20 transition-colors">
                    <ChevronRight size={14} className="text-stock-text" />
                  </button>
                </div>
              </div>

              {/* Image Display */}
              <div className="relative h-[280px] group">
                <Image
                  src={aboutImages[currentImageIndex].url}
                  alt={aboutImages[currentImageIndex].alt}
                  fill
                  className="object-cover transition-all duration-500"
                  unoptimized
                />

                {/* Overlay info */}
                <div className="absolute inset-0 bg-gradient-to-t from-stock-bg/90 via-stock-bg/20 to-transparent" />

                {/* Asset ID watermark */}
                <div className="absolute top-3 right-3 text-[10px] font-mono text-stock-muted/50">
                  {aboutImages[currentImageIndex].assetId}
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {aboutImages[currentImageIndex].verified && (
                      <span className="text-[9px] font-mono bg-stock-green/20 text-stock-green px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Shield size={8} /> VERIFIED
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-stock-muted uppercase">
                      {aboutImages[currentImageIndex].type}
                    </span>
                  </div>
                  <p className="text-stock-text font-medium">{aboutImages[currentImageIndex].caption}</p>
                  <p className="text-xs text-stock-muted mt-1">
                    {new Date(aboutImages[currentImageIndex].timestamp || "").toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 p-3 bg-stock-bg/50 overflow-x-auto">
                {aboutImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${idx === currentImageIndex
                      ? 'border-stock-green shadow-stock-green'
                      : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Analyst Notes - 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="glass-card p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-stock-gold" />
                <h3 className="text-sm font-bold text-stock-text">Analyst Notes</h3>
              </div>

              <div className="space-y-4">
                <div className="glass-subtle rounded-lg p-3">
                  <div className="text-[10px] font-mono text-stock-accent mb-1">EXECUTIVE SUMMARY</div>
                  <p className="text-sm text-stock-muted leading-relaxed">
                    {personalInfo.bio}
                  </p>
                </div>

                <div className="space-y-2">
                  {skillsData.slice(0, 4).map((sector, i) => (
                    <div key={sector.id} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${NOTE_DOTS[i % NOTE_DOTS.length]}`} />
                      <span className="text-xs text-stock-text">{sector.name}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stock-border/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stock-muted">Recommendation</span>
                    <span className="text-stock-green font-mono font-bold">STRONG BUY</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ROW 3: Skills Sector Performance - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12"
          >
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-stock-green" />
                  <h3 className="text-sm font-bold text-stock-text">Sector Performance</h3>
                  <span className="text-[10px] font-mono text-stock-muted bg-stock-bg/50 px-2 py-0.5 rounded">SKILLS HEATMAP</span>
                </div>
                <span className="text-[10px] font-mono text-stock-green">{totalSkills} ASSETS</span>
              </div>

              <div className="space-y-4">
                {skillsData.map((sector, idx) => (
                  <SkillSector key={idx} sector={sector} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ROW 4: Career Timeline + Current Position */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-stock-green" />
                <h3 className="text-sm font-bold text-stock-text">Performance History</h3>
                <span className="text-[10px] font-mono text-stock-muted bg-stock-bg/50 px-2 py-0.5 rounded">CAREER TIMELINE</span>
              </div>

              <div className="space-y-3">
                {experienceData.slice(0, 4).map((exp, idx) => (
                  <div key={exp.id} className="flex items-center gap-4 p-3 glass-subtle rounded-lg hover:border-stock-green/20 border border-transparent transition-colors">
                    <CompanyLogoSimple src={exp.companyLogo} companyName={exp.company} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stock-text text-sm truncate">{exp.title}</span>
                        {idx === 0 && <span className="text-[9px] font-mono bg-stock-green/15 text-stock-green px-1.5 py-0.5 rounded">CURRENT</span>}
                      </div>
                      <div className="text-xs text-stock-muted truncate">{exp.company}</div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs font-mono text-stock-muted">{exp.start}</div>
                      <div className="text-[10px] text-stock-green">→ {exp.end}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Current Position Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="glass-card p-5 h-full border-l-2 border-l-stock-green">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={16} className="text-stock-green" />
                <h3 className="text-sm font-bold text-stock-text">Active Position</h3>
              </div>
              {currentPosition && (
                <div className="space-y-3">
                  <div>
                    <div className="text-lg font-bold text-stock-text">{currentPosition.title}</div>
                    <div className="text-stock-green font-medium">{currentPosition.company}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stock-muted">
                    <span className="flex items-center gap-1"><Clock size={10} /> {currentPosition.start}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {currentPosition.location}</span>
                  </div>
                  <p className="text-sm text-stock-muted leading-relaxed line-clamp-4">
                    {currentPosition.summary}
                  </p>
                  <div className="pt-3 border-t border-stock-border/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-stock-green animate-pulse" />
                    <span className="text-[10px] font-mono text-stock-green">ACTIVELY TRADING</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </StockLayout>
  );
}

// Stat Metric Component
function StatMetric({
  label,
  value,
  subValue,
  icon,
  positive
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 glass-subtle rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-stock-green">{icon}</div>
        <div>
          <div className="text-[10px] font-mono text-stock-muted uppercase">{label}</div>
          <div className="text-lg font-bold font-mono text-stock-text">{value}</div>
        </div>
      </div>
      {subValue && (
        <span className={`text-[10px] font-mono ${positive ? 'text-stock-green' : 'text-stock-muted'}`}>
          {positive && '↑ '}{subValue}
        </span>
      )}
    </div>
  );
}

// Skill Sector Component with heatmap-style bars
function SkillSector({ sector }: { sector: SkillCategory }) {
  const levelToPercent = (level: string): number => {
    switch (level) {
      case 'Expert': return 95;
      case 'Advanced': return 80;
      case 'Intermediate': return 60;
      case 'Beginner': return 40;
      default: return 70;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-stock-green" />
          <span className="text-sm font-medium text-stock-text">{sector.name}</span>
        </div>
        <span className="text-[10px] font-mono text-stock-muted">{sector.skills.length} skills</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {sector.skills.map((skill, idx) => {
          const level = levelToPercent(skill.level);
          const hue = level > 80 ? 142 : level > 60 ? 45 : 0;

          return (
            <div
              key={idx}
              className="glass-subtle rounded-lg p-2 hover:scale-105 transition-transform cursor-default group"
              style={{ borderLeft: `2px solid hsl(${hue}, 70%, 50%)` }}
            >
              <div className="text-xs font-medium text-stock-text truncate">{skill.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-stock-bg/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${level}%`,
                      background: `hsl(${hue}, 70%, 50%)`
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono text-stock-muted">{level}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
