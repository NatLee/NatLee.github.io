/** @type {import('tailwindcss').Config} */
// 顏色都來自 app/globals.css 的 CSS 變數（RGB 三元組），淺深主題只改變數，元件不寫 dark: 變體。
// 注意：不要在這裡定義 animation / keyframes 名稱，會蓋掉 globals.css 裡的同名定義。
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: {
          DEFAULT: token('accent'),
          fill: token('accent-fill'),
          soft: token('accent-soft'),
        },
        clip: {
          DEFAULT: token('clip'),
          soft: token('clip-soft'),
        },
        plum: token('plum'),
      },
      fontFamily: {
        sans: ['var(--font-body)', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Cascadia Mono', 'Consolas', 'monospace'],
        pixel: ['var(--font-pixel)', 'var(--font-mono)', 'monospace'],
      },
      maxWidth: {
        shell: '72rem',
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
