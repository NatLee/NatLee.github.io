/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tech-inspired dark theme
        'dark': {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1e1e1e',
          600: '#2a2a2a',
          500: '#404040',
        },
        // Warm orange accents
        'warm': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Fire red for highlights
        'fire': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neon accents (softer warm theme)
        'neon': {
          orange: '#d4741e',
          red: '#cc5544',
          gold: '#e6b800',
          pink: '#d4669b',
          coral: '#cc6b44',
        },
        // Updated theme colors (softer warm tones)
        primary: '#0a0a0a',
        secondary: '#d4741e',
        accent: '#e6b800',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #d4741e, 0 0 10px #d4741e, 0 0 15px #d4741e' },
          '100%': { boxShadow: '0 0 10px #d4741e, 0 0 20px #d4741e, 0 0 30px #d4741e' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(212,116,30,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,116,30,0.08) 1px, transparent 1px)',
        'warm-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1e1e1e 50%, #0a0a0a 100%)',
        'neon-gradient': 'linear-gradient(45deg, #d4741e, #cc5544, #e6b800)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
