/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stock: {
          bg: "#09090b", // Zinc 950
          panel: "#18181b", // Zinc 900
          "panel-light": "#1f1f23", // Slightly lighter panel
          border: "#27272a", // Zinc 800
          "border-light": "#3f3f46", // Zinc 700
          green: "#22c55e", // Green 500
          "green-dim": "#166534", // Green 800
          red: "#ef4444", // Red 500
          "red-dim": "#991b1b", // Red 800
          text: "#e4e4e7", // Zinc 200
          muted: "#a1a1aa", // Zinc 400
          accent: "#3b82f6", // Blue 500
          gold: "#f59e0b", // Amber 500
          cyan: "#06b6d4", // Cyan 500
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        sans: ['"Inter"', "sans-serif"],
        led: ['"Digital-7"', '"JetBrains Mono"', "monospace"],
      },
      animation: {
        "ticker": "ticker 20s linear infinite",
        "ticker-fast": "ticker 10s linear infinite",
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
        "pulse-red": "pulseRed 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "chart-draw": "chartDraw 2s ease-out forwards",
        "number-tick": "numberTick 0.3s ease-out",
        "blink": "blink 1s step-end infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 5px #22c55e, 0 0 10px #22c55e" },
          "50%": { boxShadow: "0 0 20px #22c55e, 0 0 30px #22c55e" },
        },
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 5px #ef4444, 0 0 10px #ef4444" },
          "50%": { boxShadow: "0 0 20px #ef4444, 0 0 30px #ef4444" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px currentColor" },
          "100%": { boxShadow: "0 0 20px currentColor, 0 0 30px currentColor" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        chartDraw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        numberTick: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
        "radial-vignette": "radial-gradient(ellipse at center, transparent 0%, #09090b 100%)",
        "gradient-green": "linear-gradient(180deg, #22c55e 0%, #166534 100%)",
        "gradient-red": "linear-gradient(180deg, #ef4444 0%, #991b1b 100%)",
      },
      boxShadow: {
        "stock-green": "0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)",
        "stock-red": "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)",
        "stock-panel": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "glow-green": "inset 0 0 20px rgba(34, 197, 94, 0.1), 0 0 20px rgba(34, 197, 94, 0.2)",
        "glow-accent": "0 0 15px rgba(59, 130, 246, 0.5)",
      },
    },
  },
  plugins: [],
};
