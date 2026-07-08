# Nat Lee Portfolio | `sudo ./view_portfolio.sh`

A highly interactive, **Linux/Unix terminal-themed** personal portfolio website. Built with **Next.js 14**, **React 18**, and **TypeScript**, this project simulates a Zsh shell environment complete with command-line navigation, glitch effects, and a hacker-aesthetic UI.

> "There is no place like ~"

## System Features

- **Interactive Terminal**: Terminal interface with custom commands (e.g., `./intro.sh`, `ls -l --ranger-mode`).
- **Command-Line Navigation**: Navigate using shell-style UI, keyboard shortcuts `[1]`–`[4]`, or traditional clicks.
- **i18n (EN / 中文)**: Language switcher in the navigation bar with localized UI and content overlays.
- **Glitch & Cyberpunk Aesthetics**: CRT animations, text glitch effects, and scanline visuals.
- **File System Metaphor**: Projects presented as files and directories in a Ranger-style explorer.
- **Static Generation**: Next.js App Router with static export for GitHub Pages.
- **SEO**: Open Graph metadata, sitemap, robots.txt, and JSON-LD Person schema.

## Tech Stack

| Component | Specification |
|-----------|---------------|
| **Core** | Next.js 14 (App Router), React 18, TypeScript |
| **Shell UI** | Tailwind CSS, CSS keyframes, react-fast-marquee |
| **Icons** | react-icons (FontAwesome, Simple Icons) |
| **Deployment** | GitHub Pages (Static Export) |
| **Package Manager** | npm |

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/natlee/NatLee.github.io.git
cd NatLee.github.io
npm install
npm run dev
```

Open `http://localhost:3000`.

## File Structure

```
├── app/                     # Next.js App Router pages & layout
├── assets/data/             # Source-of-truth JSON content
│   └── i18n/                # Chinese content overlays
├── components/              # UI modules (Terminal, Navigation, etc.)
├── contexts/                # LanguageProvider (i18n)
├── data/                    # Typed data wrappers
├── lib/i18n/                # i18n helpers
├── messages/                # UI string dictionaries (en, zh-TW)
└── public/                  # Static assets (favicon, CNAME)
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build (static export)
npm run build:pages  # Same as build — GitHub Pages export
npm run lint         # ESLint
```

## Content & i18n

- Edit `assets/data/personal.json` for bio, contact, and social links.
- UI strings live in `messages/en.json` and `messages/zh-TW.json`.
- Chinese content overlays: `assets/data/i18n/*.zh.json`.

## Deployment

Pushes to `main` trigger GitHub Actions to build and deploy to GitHub Pages.

---
*Built with care by Nat Lee*
