// Telepy 的 logo（取自 telepy/docs/brand/logo.svg）：裝置往外連（圓點 →），伺服器沿同一條連線折返（← 箭頭）＝ reverse tunnel。
export default function TelepyLogo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} className={className} role="img" aria-label="Telepy logo">
      <defs>
        <linearGradient id="telepy-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e3770e" />
          <stop offset="1" stopColor="#c04815" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#telepy-logo-gradient)" />
      <g fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16H38a12 12 0 0 1 0 24H20" />
        <path d="M26 32l-8 8 8 8" />
      </g>
      <circle cx="16" cy="16" r="7" fill="#fff" />
    </svg>
  )
}
