/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  // 主題沒有 ESLint 設定，也不再安裝 ESLint；build 時略過 lint。
  eslint: { ignoreDuringBuilds: true },
  basePath: '/valhalla/terminal',
  assetPrefix: '/valhalla/terminal/',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
