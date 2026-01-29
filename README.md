# Nat Lee Portfolio | `sudo ./view_portfolio.sh`

A highly interactive, **Linux/Unix terminal-themed** personal portfolio website. Built with **Next.js 14**, **React 18**, and **TypeScript**, this project simulates a Zsh shell environment complete with command-line navigation, glitch effects, and a hacker-aesthetic UI.

> "There is no place like ~"

## 🖥️ System Features

- **💻 Interactive Terminal**: Fully functional terminal interface with support for custom commands (e.g., `./intro.sh`, `ls -l`).
- **⌨️ Command-Line Navigation**: Navigate the site using simulated shell commands or traditional UI clicks.
- **👾 Glitch & Cyberpunk Aesthetics**: Custom CRT animations, text glitch effects, and "matrix-style" visuals.
- **📁 File System Metaphor**: Projects and pages are presented as files and directories in a file explorer (Ranger-style).
- **🚀 Modern Spec**: Built on the latest Next.js App Router for blazing fast static generation.
- **🎨 Dynamic Theming**: "Dark Mode" by default with semantic highlighting for code and terminal output.
- **📊 Real-time Stats**: "System" statistics (career stats) displayed like server metrics.

## 🛠️ Kernel Specs (Tech Stack)

| Component | Specification |
|-----------|---------------|
| **Core** | Next.js 14 (App Router), React 18, TypeScript |
| **Shell UI** | Tailwind CSS, Framer Motion (animations) |
| **Icons** | react-icons (FontAwesome, Simple Icons) |
| **Deployment** | GitHub Pages (Static Export) |
| **Package Manager** | npm / yarn |

## 🚀 Boot Sequence (Quick Start)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/natlee/NatLee.github.io.git
    cd NatLee.github.io
    ```

2.  **Install modules:**
    ```bash
    npm install
    ```

3.  **Initialize local server:**
    ```bash
    npm run dev
    ```

4.  **Access Localhost:**
    Open `http://localhost:3000` to establish a session.

## 📂 File System Structure

```
/home/natlee/portfolio
├── app/                  # Kernel (Next.js App Router)
├── components/           # UI Modules (Terminal, Shell, Glitch Components)
│   ├── TerminalCommand.tsx   # Command execution logic
│   ├── TechHero.tsx          # Main boot screen / Hero
│   └── ...
├── data/                 # System Data (JSON files for content)
├── public/               # Static Assets
└── tailwind.config.js    # UI Configuration
```

## 📜 Available Commands (Scripts)

```bash
# Development Mode
npm run dev          # Start local development server

# Production Build
npm run build        # Compile system binaries

# Static Export
npm run build:pages  # Export static site for GitHub Pages

# Deployment
npm run deploy       # Deploy to remote (GitHub Pages)

# System Check
npm run lint         # Run code analysis
```

## 🔧 Deployment

This system is configured for automatic deployment via **GitHub Actions**.
Pushes to the `main` branch trigger a workflow that builds and deploys the static site to the `gh-pages` branch.

## 👤 User Profile

**Nat Lee**
b. Software Engineer // Full Stack Developer

Edit `assets/data/personal.json` to update user variables such as bio, contact info, and social links.

---
*Built with <3 and caffeine by Nat Lee*
