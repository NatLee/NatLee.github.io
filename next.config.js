/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 家目錄有一份不相干的 package-lock.json，明確指定專案根目錄，免得 Next 猜錯。
  outputFileTracingRoot: __dirname,
  // 沒有 ESLint 設定，也不再安裝 ESLint（只會帶進開發工具的安全性警告）；型別檢查照常在 build 時執行。
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // 建置當月（YYYY-MM）：/work 的時間軸用它當「現在」。在建置時固定下來，靜態輸出的 HTML 和瀏覽器端算出的位置才會一致。
  env: { NEXT_PUBLIC_BUILD_MONTH: new Date().toISOString().slice(0, 7) },
}

module.exports = nextConfig
