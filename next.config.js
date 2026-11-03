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
}

module.exports = nextConfig
